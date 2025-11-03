"use client";

import configEnv from "@/lib/config";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const initialOptions = {
  clientId: configEnv.env.paypal.clientId,
  currency: "USD",
  intent: "capture",
};

export default function PayPalProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}