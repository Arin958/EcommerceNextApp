// components/MergeCartOnLogin.tsx
"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getGuestId } from "@/utils/getGuestId";

export default function MergeCartOnLogin() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      const guestId = getGuestId();
      fetch("/api/cart/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId }),
      });
      localStorage.removeItem("guest_id"); // ✅ Clear guest cart
    }
  }, [isSignedIn]);

  return null;
}
