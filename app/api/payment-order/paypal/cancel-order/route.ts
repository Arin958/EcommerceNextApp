import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { Cart, Product } from "@/schema/schema";
import mongoose from "mongoose";


export async function POST() {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectDB();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cart = await Cart.findOne({ clerkId: userId }).session(session);

    if (!cart || cart.items.length === 0) {
      await session.commitTransaction();
      return NextResponse.json({ message: "Nothing to release" }, { status: 200 });
    }

    for (const item of cart.items) {
      const result = await Product.updateOne(
        {
          _id: item.productId,
          "variants.color": item.color,
          "variants.size": item.size,
          "variants.reservedStock": { $gte: item.quantity } // 🔒 idempotency
        },
        {
          $inc: {
            "variants.$.stock": item.quantity,
            "variants.$.reservedStock": -item.quantity
          }
        },
        { session }
      );

      // If already released → skip safely
      if (result.modifiedCount === 0) {
        continue;
      }
    }

    await session.commitTransaction();

    return NextResponse.json(
      { message: "Reserved stock safely released" },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction();
    console.error("Cancel-order error:", error);
    return NextResponse.json({ message: "Cancel failed" }, { status: 500 });
  } finally {
    session.endSession();
  }
}