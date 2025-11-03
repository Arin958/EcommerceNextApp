import connectDB from "@/lib/mongodb";
import { Review, User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ updated type
) {
  try {
    // ✅ Await params (new in Next.js 15+)
    const { id } = await context.params;

    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Please Sign In" }, { status: 401 });
    }

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 🛡️ Authorization check
    if (review.user._id !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ message: "You are not authorized" }, { status: 401 });
    }

    await Review.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    let msg = "Something went wrong";
    if (typeof error === "string") msg = error;
    else if (error instanceof Error) msg = error.message;

    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
