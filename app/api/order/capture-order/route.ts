// app/api/paypal/capture-order/route.ts
import configEnv from "@/lib/config";
import { NextResponse } from "next/server";

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${configEnv.env.paypal.clientId}:${configEnv.env.paypal.clientSecret}`
  ).toString("base64");

  const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
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

export async function POST(req: Request) {
  try {
    const { orderID } = await req.json();

    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const captureData = await response.json();

    if (!response.ok) {
      throw new Error(captureData.message || "Failed to capture payment");
    }

    return NextResponse.json(captureData);
  } catch (error) {
    console.error("PayPal capture order error:", error);
    return NextResponse.json(
      { message: "Failed to capture PayPal payment" },
      { status: 500 }
    );
  }
}