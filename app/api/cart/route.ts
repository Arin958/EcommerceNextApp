// /app/api/cart/add/route.ts
import { auth } from "@clerk/nextjs/server";
import { Cart } from "@/schema/schema";
import connectDB from "@/lib/mongodb";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface AddToCartRequest {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
  size?: string;
  color?: string;
  guestId?: string;
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const { userId } = await auth();
    const body: AddToCartRequest = await req.json();

    const { productId, name, price, image, quantity = 1, size, color, guestId } = body;

    if (!productId || !name || !price) {
      return new Response(JSON.stringify({ error: "Missing required product data" }), {
        status: 400,
      });
    }

    // For guest users, ensure we have a guestId and don't use clerkId at all
    let query, createData;
    if (userId) {
      query = { clerkId: userId };
      createData = { clerkId: userId };
    } else if (guestId) {
      query = { guestId };
      createData = { guestId };
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    let cart = await Cart.findOne(query);

    const newItem: CartItem = { productId, name, price, image, quantity, size, color };

    if (!cart) {
      cart = await Cart.create({ ...createData, items: [newItem] });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (i: CartItem) =>
          i.productId === productId &&
          i.size === size &&
          i.color === color
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push(newItem);
      }

      await cart.save();
    }

    return new Response(JSON.stringify({ cart }), { status: 200 });
  } catch (err: unknown) {
    console.log(err);
    let message = "Something went wrong";
    if (err instanceof Error) message = err.message;
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export async function GET(req: Request) {
  await connectDB()
  const { userId } = await auth();
  const url = new URL(req.url);
  const guestId = url.searchParams.get("guestId");

  let cart;
  if (userId) {
    cart = await Cart.findOne({ clerkId: userId });
  } else if (guestId) {
    cart = await Cart.findOne({ guestId });
  }

  return new Response(
    JSON.stringify({ cart: cart?.items || [] }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
