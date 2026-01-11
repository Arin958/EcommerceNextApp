import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Cart, Notification, Order, Product, User } from "@/schema/schema";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST(req: Request) {
  const session = await mongoose.startSession();
  session.startTransaction();

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

    const cart = await Cart.findOne({ clerkId: userId }).session(session);
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    // 🔹 Idempotency for PayPal
    if (paymentMethod === "paypal") {
      if (!transactionId) {
        return NextResponse.json(
          { message: "Missing PayPal transaction ID" },
          { status: 400 }
        );
      }

      const existingOrder = await Order.findOne({ transactionId });
      if (existingOrder) {
        return NextResponse.json(
          { message: "Order already exists", order: existingOrder },
          { status: 200 }
        );
      }
    }

    const subtotal = cart.items.reduce(
      (acc: number, item: { price: number; quantity: number }) => acc + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const paymentStatus = paymentMethod === "paypal" ? "paid" : "pending";

    const order = await Order.create(
      [
        {
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
          paypalOrderId: paymentMethod === "paypal" ? paypalOrderId : undefined,
          notes,
        },
      ],
      { session }
    );

    // 🔹 Finalize stock for PayPal (convert reserved → sold)
if (paymentMethod === "paypal") {
  for (const item of cart.items) {
    const updated = await Product.updateOne(
      {
        _id: item.productId,
        "variants.color": item.color,
        "variants.size": item.size,
      },
      {
        $inc: {
          sold: item.quantity,
          "variants.$.reservedStock": -item.quantity
        }
      },
      { session }
    );

    if (updated.modifiedCount === 0) {
      throw new Error("Failed to finalize reserved stock");
    }
  }
}


    // 🔹 Deduct stock ONLY for COD
    if (paymentMethod === "COD") {
      for (const item of cart.items) {
        const updated = await Product.updateOne(
          {
            _id: item.productId,
            "variants.color": item.color,
            "variants.size": item.size,
            "variants.stock": { $gte: item.quantity },
          },
          {
            $inc: {
              sold: item.quantity,
              stock: -item.quantity,
              "variants.$.stock": -item.quantity,
            },
          },
          { session }
        );

        if (updated.modifiedCount === 0) {
          throw new Error("Insufficient stock");
        }
      }
    }

    // 🔹 Clear cart
    await Cart.deleteOne({ clerkId: userId }).session(session);

    // 🔹 Notify admins
    const sender = await User.findOne({ clerkId: userId });
    const admins = await User.find({ role: "admin" });

    const notifications = admins.map((admin) => ({
      recipient: {
        _id: admin._id.toString(),
        clerkId: admin.clerkId,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
      sender: {
        _id: sender!._id.toString(),
        clerkId: sender!.clerkId,
        username: sender!.username,
        email: sender!.email,
        role: sender!.role,
      },
      type: "order_placed",
      title: "New Order Placed",
      message: `${sender!.username} placed a new order (${order[0].orderId})`,
      orderId: order[0].orderId,
      url: `/admin/orders/${order[0].orderId}`,
    }));

    await Notification.insertMany(notifications, { session });

    await session.commitTransaction();

    return NextResponse.json(
      {
        message: "Order placed successfully",
        order: order[0],
      },
      { status: 201 }
    );
  } catch (error) {
    await session.abortTransaction();
    console.error("Order Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  } finally {
    session.endSession();
  }
}
