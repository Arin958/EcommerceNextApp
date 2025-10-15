"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { getGuestId } from "@/utils/getGuestId";

const CartLength = () => {
  const { isSignedIn } = useUser();
  const [totalItems, setTotalItems] = useState(0);

  const fetchCart = async () => {
    try {
      const guestId = getGuestId();
      const res = await fetch(`/api/cart?guestId=${guestId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      // Count unique items
      const count = (data.cart || []).length;
      setTotalItems(count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart(); // Initial fetch on mount/login state change

    // Listen for cart updates (from adding/removing items)
    document.addEventListener("cartUpdated", fetchCart);

    return () => {
      document.removeEventListener("cartUpdated", fetchCart);
    };
  }, [isSignedIn]);

  return <span>{totalItems}</span>;
};

export default CartLength;
