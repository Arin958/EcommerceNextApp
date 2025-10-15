import { Cart, Order } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { AnyAaaaRecord } from "node:dns";



export async function POST(req: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
        }

        const { paymentMethod, address } = await req.json()
        const cart = await Cart.findOne({ clerkId: userId })

        if (!cart || cart.items.length === 0) {
            return new Response(JSON.stringify({ error: "Cart is empty" }), { status: 400 })
        }

        const subtotal = cart.items.reduce((acc: number, item: { price: number; quantity: number; }) => acc + item.price * item.quantity, 0)
        const shippingFee = 0;
        const totalAmount = subtotal + shippingFee;


        const order = await Order.create({
            clerkId: userId,
            items: cart.items,
            subtotal,
            shippingFee,
            totalAmount,
            paymentMethod,
            address,
            paymentStatus: "pending",
            orderStatus: "pending"
        })

        return new Response(JSON.stringify({ success: true, order }), { status: 201 })

    } catch (error: unknown) {
  let message = "Something went wrong";

  if (error instanceof Error) {
    message = error.message;
  }

  return new Response(JSON.stringify({ error: message }), { status: 500 });
}
}