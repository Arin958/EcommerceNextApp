// app/api/user/me/route.ts
import { User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ userId: null }, { status: 200 });
    }

   const user = await User.findOne({clerkId: userId});

       return NextResponse.json(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
      let msg = "Something went wrong";

    if(typeof error === "string") msg = error;
    else if(error instanceof Error) msg = error.message;
    return NextResponse.json({message: msg}, {status: 500})

  }
}