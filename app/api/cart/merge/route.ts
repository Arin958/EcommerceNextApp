import { auth } from "@clerk/nextjs/server";
import { Cart } from "@/schema/schema";

export async function POST(req: Request) {
  const { userId } = await auth();
  const { guestId } = await req.json();

  if (!userId || !guestId) {
    return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });
  }

  // 1️⃣ Fetch both carts (guest + user)
  const guestCart = await Cart.findOne({ guestId });
  const userCart = await Cart.findOne({ clerkId: userId });

  // 2️⃣ If no guest cart, nothing to merge
  if (!guestCart) {
    return new Response(JSON.stringify({ message: "No guest cart found" }), { status: 200 });
  }

  // 3️⃣ If user has no cart, assign guest cart to user
  if (!userCart) {
    guestCart.clerkId = userId;
    guestCart.guestId = null;
    await guestCart.save();
    return new Response(JSON.stringify({ message: "Cart merged successfully (new user cart)" }), { status: 200 });
  }

  // 4️⃣ Merge guest items into user cart
  guestCart.items.forEach((guestItem) => {
    const existingIndex = userCart.items.findIndex(i => i.productId === guestItem.productId);
    if (existingIndex > -1) {
      userCart.items[existingIndex].quantity += guestItem.quantity;
    } else {
      userCart.items.push(guestItem);
    }
  });

  await userCart.save();

  // 5️⃣ Delete guest cart
  await Cart.deleteOne({ guestId });

  return new Response(JSON.stringify({ message: "Cart merged successfully" }), { status: 200 });
}
