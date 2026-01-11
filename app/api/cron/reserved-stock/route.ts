import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/schema/schema";

export async function GET(req: NextRequest) {
  // 🔐 Security: only cron can call this
  const secret = req.headers.get("x-cron-secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const now = new Date();

    const products = await Product.find({
      "variants.reservedStock": { $gt: 0 },
      "variants.reservedUntil": { $lt: now },
    });

    let releasedCount = 0;

    for (const product of products) {
      for (const variant of product.variants) {
        if (
          variant.reservedStock > 0 &&
          variant.reservedUntil &&
          variant.reservedUntil < now
        ) {
          variant.stock += variant.reservedStock;
          variant.reservedStock = 0;
          variant.reservedUntil = undefined;
          releasedCount++;
        }
      }
      await product.save();
    }

    return NextResponse.json({
      message: "Expired reservations released",
      releasedCount,
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json(
      { message: "Cron failed" },
      { status: 500 }
    );
  }
}
