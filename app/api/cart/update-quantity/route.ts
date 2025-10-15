import { auth } from "@clerk/nextjs/server";
import { Cart } from "@/schema/schema";

export async function POST(req: Request) {
  const { userId } = await auth();
  const { productId, quantity, guestId } = await req.json();
  console.log(productId, quantity, "json")

  try {
    
      if (!productId || quantity < 1) {
        return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
      }
    
      const identifier = userId ? { clerkId: userId } : { guestId };
      const cart = await Cart.findOne(identifier);
      if (!cart) return new Response(JSON.stringify({ error: "Cart not found" }), { status: 404 });
    
      const item = cart.items.find(i => i.productId === productId);
      if (!item) return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
    
      item.quantity = quantity;
      await cart.save();
    
      return new Response(JSON.stringify({ cart: cart.items }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }

}