import { auth } from "@clerk/nextjs/server";
import { Cart } from "@/schema/schema";

export async function POST(req: Request) {
  const { userId } = await auth();
  const { productId, guestId } = await req.json();

  if (!productId) {
    return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
  }

  const identifier = userId ? { clerkId: userId } : { guestId };
  const cart = await Cart.findOne(identifier);
  if (!cart) return new Response(JSON.stringify({ error: "Cart not found" }), { status: 404 });

  cart.items = cart.items.filter(i => i.productId !== productId);
  await cart.save();

  return new Response(JSON.stringify({ cart: cart.items }), { status: 200 });
}
