// /app/api/cart/add/route.ts
import { auth } from "@clerk/nextjs/server";

import { Cart } from "@/schema/schema";

;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { productId, name, price, image, quantity = 1, size, color, guestId } = await req.json();

    if (!productId || !name || !price) {
      return new Response(JSON.stringify({ error: "Missing required product data" }), {
        status: 400,
      });
    }

    // Identify user as guest OR logged-in
    const identifier = userId ? { clerkId: userId } : { guestId };

    let cart = await Cart.findOne(identifier);

    if (!cart) {
      cart = await Cart.create({
        ...identifier,
        items: [{ productId, name, price, image, quantity, size, color }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(i => i.productId === productId);
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, name, price, image, quantity, size, color });
      }
      await cart.save();
    }

    return new Response(JSON.stringify({ cart }), { status: 200 });
  } catch (err: any) {
    console.log(err);
    return new Response(JSON.stringify({ error: err.message || "Server error" }), { status: 500 });
  }
}


export async function GET(req: Request) {
  const { userId } = await auth();
  const { searchParams } = new URL(req.url);
  const guestId = searchParams.get("guestId");

  // If user is authenticated, only use their clerkId
  if (userId) {
    const cart = await Cart.findOne({ clerkId: userId });
    return new Response(JSON.stringify({ cart: cart?.items || [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // If no user but has guestId, use guest cart
  if (guestId) {
    const cart = await Cart.findOne({ guestId });
    return new Response(JSON.stringify({ cart: cart?.items || [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // No user and no guestId - return empty cart
  return new Response(JSON.stringify({ cart: [] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
