"use client";

import { PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import { useState } from "react";
import { toast } from "sonner";

interface PayPalButtonProps {

  onSuccess: (details: PayPalPaymentDetails) => void;
  onError: (error: Error) => void;
}


type PayPalCapture = {
  id: string;
  status: string;
  amount: {
    value: string;
    currency_code: string;
  };
};

// Define PayPal payment details type
interface PayPalPaymentDetails {
  id?: string;
  status?: string;
  payer?: {
    name?: {
      given_name?: string;
      surname?: string;
    };
    email_address?: string;
    payer_id?: string;
  };
  purchase_units?: Array<{
    reference_id?: string;
    amount?: {
      currency_code?: string;
      value?: string;
    };
      payments: {
    captures: PayPalCapture[];
  };
  }>;
}

export default function PayPalButton({ onSuccess, onError }: PayPalButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ PayPal CREATE (reserves stock)
  const createOrder = async (): Promise<string> => {
    const res = await fetch("/api/payment-order/paypal/create-order", {
      method: "POST",
    });

    const data = await res.json();
    console.log(data, "data")

    if (!res.ok) {
      throw new Error(data.message || "Failed to create PayPal order");
    }

    return data.id; // PayPal order id
  };

  // ✅ PayPal CAPTURE (finalizes stock)
  const onApprove = async (data: { orderID: string }) => {
    try {
      setIsProcessing(true);

      const res = await fetch("/api/payment-order/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderID}),
      });

      const result = await res.json();

      console.log(result, "result")

      if (!res.ok) {
       console.error(result, "result")
        throw new Error(result.message || "Capture failed");
      }

      onSuccess(result);
    } catch (err) {
      console.error("PayPal capture error:", err);
      onError(err as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 🔓 Layer-1: RELEASE stock if user cancels
  const onCancel = async () => {
    await fetch("/api/payment-order/paypal/cancel-order", { method: "POST" });
    toast.info("Payment cancelled");
  };

  // 🔓 Layer-1: RELEASE stock if error happens
  const onPayPalError = async (err: unknown) => {
    console.error("PayPal error:", err);
    await fetch("/api/payment-order/paypal/cancel-order", { method: "POST" });
    toast.error("Payment failed. Stock released.");
  };

  if (isPending || isProcessing) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
        <span className="text-sm">Processing PayPal...</span>
      </div>
    );
  }

  return (
      <PayPalButtons
      style={{ layout: "vertical", color: "blue" }}
      createOrder={createOrder}
      onApprove={onApprove}
      onCancel={onCancel}
      onError={onPayPalError}
    />
  );
}