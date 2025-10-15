import { auth } from "@clerk/nextjs/server";
import { Cart } from "@/schema/schema";
import { ICartItem } from "@/types";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectDB()
  try {
    const { userId } = await auth();
    const { productId, guestId } = await req.json();

    if (!productId) {
      return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
    }

    const identifier = userId ? { clerkId: userId } : { guestId };
    const cart = await Cart.findOne(identifier);
    if (!cart) return new Response(JSON.stringify({ error: "Cart not found" }), { status: 404 });

    cart.items = cart.items.filter((i: ICartItem) => i.productId !== productId);
    await cart.save();

    return new Response(JSON.stringify({ cart: cart.items }), { status: 200 });
  } catch (error: unknown) {
    let message = "Something went wrong";
    if (typeof error === "string") message = error;
    else if (error instanceof Error) message = error.message;
    return new Response(JSON.stringify({ error: message }), { status: 500 });

  }

}
