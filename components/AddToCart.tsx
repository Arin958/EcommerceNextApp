"use client";

import React from "react";
import { Button } from "./ui/button";
import { IProduct } from "@/types";
import { useAddToCart } from "@/hooks/useAddtoCart";

type Props = {
  product: IProduct;
  selectedSize?: string;
  selectedColor?: string;
};

export default function AddToCartButton({ product, selectedSize, selectedColor }: Props) {
  const { addToCart, loading } = useAddToCart();

  // Destructure once
  const { _id, name, price, images, discountPrice } = product;

  const handleAdd = async () => {
    await addToCart({
      productId: _id.toString(),          // MongoDB _id
      name,
      price: discountPrice || price,      // use discount if available
      image: images?.[0] || "/fallback.jpg", // first image
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
    });
  };

  return (
    <Button
      onClick={handleAdd}
      disabled={loading}
      className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
    >
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
