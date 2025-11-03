// app/api/paypal/create-order/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Cart } from "@/schema/schema";
import connectDB from "@/lib/mongodb";
import configEnv from "@/lib/config";

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${configEnv.env.paypal.clientId}:${configEnv.env.paypal.clientSecret}`
  ).toString("base64");

  const response = await fetch(`${configEnv.env.paypal.api}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
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

    // Get cart to calculate total
    const cart = await Cart.findOne({ clerkId: userId });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const subtotal = cart.items.reduce(
      (acc: number, item: { price: number; quantity: number }) => acc + item.price * item.quantity,
      0
    );
  const shipping = 0; // Free shipping for all orders
const tax = subtotal * 0.1; // or adjust/remove if needed
const total = subtotal + tax; // No shipping added

    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(
      `${configEnv.env.paypal.api}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
        shipping: {
          currency_code: "USD",
          value: shipping.toFixed(2)
        },
        tax_total: {
          currency_code: "USD",
          value: tax.toFixed(2)
        }
      }
    },
    items: cart.items.map((item: { name: string; price: number; quantity: number }) => ({
      name: item.name,
      unit_amount: {
        currency_code: "USD",
        value: item.price.toFixed(2)
      },
      quantity: item.quantity.toString()
    }))
  },
]

        }),
      }
    );

    const order = await response.json();

    console.log(order,"order")

    if (!response.ok) {
      throw new Error(order.message || "Failed to create PayPal order");
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("PayPal create order error:", error);
    return NextResponse.json(
      { message: "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}