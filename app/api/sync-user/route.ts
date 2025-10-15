import { NextRequest, NextResponse } from "next/server";
import { syncUser } from "@/lib/syncUser";

export async function POST(req: NextRequest) {
  const { clerkId } = await req.json();
  if (!clerkId) return NextResponse.json({ error: "No clerkId" }, { status: 400 });

  const user = await syncUser(clerkId);
  return NextResponse.json({ success: true, user });
}
