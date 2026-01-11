// app/api/paypal/capture-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import configEnv from "@/lib/config";
import connectDB from "@/lib/mongodb";

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${configEnv.env.paypal.clientId}:${configEnv.env.paypal.clientSecret}`
  ).toString("base64");

  const response = await fetch(
    `${configEnv.env.paypal.api}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error("PayPal token error");
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ message: "Order ID required" }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();

    const res = await fetch(
      `${configEnv.env.paypal.api}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok || data.status !== "COMPLETED") {
      return NextResponse.json(
        { message: "Payment not completed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "PAID",
      paypalOrderId: orderId,
      transactionId: data.purchase_units[0].payments.captures[0].id,
    });
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json({ message: "Capture failed" }, { status: 500 });
  }
}
