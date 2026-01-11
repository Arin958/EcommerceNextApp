import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Cart, Product } from "@/schema/schema";
import connectDB from "@/lib/mongodb";
import configEnv from "@/lib/config";
import { ICartItem } from "@/types";


async function getPayPalAccessToken(): Promise<string> {
    const authHeader = Buffer.from(
        `${configEnv.env.paypal.clientId}:${configEnv.env.paypal.clientSecret}`
    ).toString("base64");

    const response = await fetch(`${configEnv.env.paypal.api}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${authHeader}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error("Failed to get PayPal access token");
    }
    return data.access_token;
}


export async function POST() {
    try {
        await connectDB();
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const cart = await Cart.findOne({ clerkId: userId });
        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
        }


        for (const item of cart.items) {
            const result = await Product.updateOne({
                _id: item.productId,
                "variants.color": item.color,
                "variants.size": item.size,
                "variants.stock": { $gte: item.quantity }
            },
                {
                    $inc: {
                        "variants.$.stock": -item.quantity,
                        "variants.$.reservedStock": item.quantity
                    }
                })

            if (result.modifiedCount === 0) {
                throw new Error(`Out of stock for ${item.name}`);
            }
        }

        const subtotal = cart.items.reduce(
            (acc: number, item: { price: number; quantity: number }) => acc + item.price * item.quantity,
            0
        );

        const shipping = 0;
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        const accessToken = await getPayPalAccessToken();

        const paypalRes = await fetch(`${configEnv.env.paypal.api}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: total.toFixed(2),
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: subtotal.toFixed(2)
                                },
                                tax_total: {
                                    currency_code: "USD",
                                    value: tax.toFixed(2)
                                },

                            },
                        },
                        items: cart.items.map((item: ICartItem) => ({
                            name: item.name,

                            unit_amount: {
                                currency_code: "USD",
                                value: item.price.toFixed(2)

                            },
                            quantity: item.quantity.toString(),
                        }))
                    }
                ]
            }
            )
        })

        const paypalOrder = await paypalRes.json();
        if (!paypalRes.ok) {
            throw new Error("PayPal order creation failed");
        }

        return NextResponse.json(paypalOrder)
    } catch (error) {
        console.error("PayPal create-order error:", error);
        return NextResponse.json({ message: "Failed to create PayPal order" }, { status: 500 });


    }
}
