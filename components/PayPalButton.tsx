"use client";

import { PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import { useState } from "react";
import { toast } from "sonner";

interface PayPalButtonProps {
  amount: number;
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

export default function PayPalButton({ amount, onSuccess, onError }: PayPalButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrder = async (): Promise<string> => {
    try {
      const response = await fetch("/api/order/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount.toFixed(2),
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.message || "Failed to create order");
      }

      return orderData.id;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  };

  const handleError =(error: unknown) => {
    console.error("PayPal Error:", error);
    toast.error("Payment failed. Please try again.");
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      setIsProcessing(true);
      
      const response = await fetch("/api/order/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      });

      const captureData = await response.json();

      if (!response.ok) {
        throw new Error(captureData.message || "Failed to capture payment");
      }

      onSuccess(captureData);
    } catch (error) {
      console.error("Capture order error:", error);
      onError(error as Error);
    } finally {
      setIsProcessing(false);
    }
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
      style={{ 
        layout: "vertical",
        shape: "rect",
        color: "blue"
      }}
      createOrder={createOrder}
      onApprove={onApprove}
      onError={handleError}
    />
  );
}