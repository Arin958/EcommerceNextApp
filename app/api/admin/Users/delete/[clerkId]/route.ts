import connectDB from "@/lib/mongodb";
import { User } from "@/schema/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest, {params}: {params: Promise<{clerkId: string}>}) {
    try {
        const {userId} = await auth();

        if(!userId) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }


        
     

        await connectDB();
        const admin = await User.findOne({clerkId: userId});

        if(!admin || admin.role !== "admin") {
            return NextResponse.json({message: "Unauthorized"}, {status: 403})
        }

           const {clerkId} = await params;

          const clerk = await clerkClient();

         await clerk.users.deleteUser(clerkId);


         const deleteUser = await User.findOneAndDelete({clerkId: clerkId});


         if(!deleteUser) {
            return NextResponse.json({message: "User not found"}, {status: 404})
         }

         return NextResponse.json({message: "User deleted successfully"}, {status: 200})


    } catch (error: unknown) {
        console.log(error )
        let msg = 'Something went wrong';
        if (error instanceof Error) {
            msg = error.message;
        }
        return NextResponse.json({ message: msg }, { status: 500 });
    }
 

}