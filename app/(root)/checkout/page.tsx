import { auth } from "@clerk/nextjs/server";
import React from "react";
import { SignInButton } from "@clerk/nextjs";

const CheckoutPage = async () => {
    const { userId } = await auth();

    if (!userId) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-xl font-semibold mb-4">You need to sign in to continue to checkout</h2>
                <SignInButton mode="modal" forceRedirectUrl={"/checkout"}>
                    <button className="px-6 py-3 bg-black text-white rounded-lg">
                        Sign In
                    </button>
                </SignInButton>
            </div>
        );
    }

    return <div>Checkout Page Content</div>;
};

export default CheckoutPage;
