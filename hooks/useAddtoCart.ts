// hooks/useAddToCart.ts
"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { getGuestId } from "@/utils/getGuestId"; // 👈 Generate Guest ID if user not signed in

export function useAddToCart() {
  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);

  const addToCart = async (payload: {
    productId: string;
    name: string;
    price: number;
    image?: string;
    quantity?: number;
    size?: string;
    color?: string;
  }) => {
    setLoading(true);

    try {
      // If user is not signed in, use guestId
      const guestId = !isSignedIn ? getGuestId() : undefined;

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, guestId }),
        credentials: "include",
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error(data?.error || "Failed to add to cart");
        return { ok: false, error: data?.error || "Failed" };
      }

      toast.success("Added to cart");
      document.dispatchEvent(new Event("cartUpdated"));
      return { ok: true, cart: data.cart };

    } catch (err: any) {
      setLoading(false);
      console.error(err);
      toast.error("Network error");
      return { ok: false, error: "Network error" };
    }
  };

  return { addToCart, loading };
}
