import { clerkClient } from "@clerk/nextjs/server";
import connectDB from "./mongodb";
import { User } from "@/schema/schema";

export async function syncUser(clerkUserId: string) {
    await connectDB();

    // Remove the parentheses - use clerkClient directly
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(clerkUserId);

    let user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
        user = new User({
            clerkId: clerkUser.id,
            username: clerkUser.username || clerkUser.firstName,
            email: clerkUser.emailAddresses[0].emailAddress,
            role: clerkUser.publicMetadata.role || "user",
        });
        await user.save();
    }

    return user;
}