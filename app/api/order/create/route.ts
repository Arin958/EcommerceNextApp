import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Cart, Notification, Order, Product, User } from "@/schema/schema";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      shippingAddress,
      paymentMethod = "COD",
      billingAddress,
      notes,
      paypalOrderId,
      transactionId,
    } = body;

    const cart = await Cart.findOne({ clerkId: userId });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const subtotal = cart.items.reduce(
      (acc: number, item: { price: number; quantity: number }) =>
        acc + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    // Set payment status based on payment method
    const paymentStatus = paymentMethod === "paypal" ? "paid" : "pending";

    const order = await Order.create({
      orderId: `ORD-${Date.now()}`,
      clerkId: userId,
      items: cart.items,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
      paymentStatus,
      orderStatus: "placed",
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      transactionId: paymentMethod === "paypal" ? transactionId : undefined,
      notes,
      ...(paymentMethod === "paypal" && { paypalOrderId }),
    });

    // 🔹 Decrease stock for products and variants
for (const item of cart.items) {
  await Product.updateOne(
    {
      _id: item.productId,
      "variants.color": item.color,
      "variants.size": item.size,
    },
    {
      $inc: {
        sold: item.quantity,
        stock: -item.quantity,
        "variants.$.stock": -item.quantity,
      },
    }
  );
}
    // 🔹 Clear Cart after order
    await Cart.deleteOne({ clerkId: userId });

    // 🔹 Notify Admins
    const sender = await User.findOne({ clerkId: userId });
    if (!sender) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const admins = await User.find({ role: "admin" });

    const notifications = admins.map(
      (admin: {
        _id: string;
        clerkId: string;
        username: string;
        email: string;
        role: string;
      }) => ({
        recipient: {
          _id: admin._id.toString(),
          clerkId: admin.clerkId,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
        sender: {
          _id: sender._id.toString(),
          clerkId: sender.clerkId,
          username: sender.username,
          email: sender.email,
          role: sender.role,
        },
        type: "order_placed",
        title: "New Order Placed",
        message: `${sender.username} placed a new order (${order.orderId})`,
        orderId: order.orderId,
        url: `/admin/orders/${order.orderId}`,
      })
    );

    await Notification.insertMany(notifications);

    return NextResponse.json(
      {
        message: "Order Placed",
        order: {
          id: order._id,
          orderId: order.orderId,
          total: order.total,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
