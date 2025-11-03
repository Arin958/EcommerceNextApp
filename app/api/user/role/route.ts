// app/api/user/role/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/schema/schema';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ role: null }, { status: 200 });
    }

    await connectDB();
    const user = await User.findOne({ clerkId: userId });

    return NextResponse.json({ 
      role: user?.role || null 
    }, { status: 200 });
    
  } catch (error: unknown) {
    console.log(error)
    let msg = 'Something went wrong';
    if(typeof error === 'string') msg = error
    else if(error instanceof Error) msg = error.message
    return NextResponse.json({ 
      role: null 
    }, { status: 200 });
  }
}