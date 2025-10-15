import Image from "next/image";
import React, { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { getGuestId } from "@/utils/getGuestId";
import Link from "next/link";
import { Button } from "./ui/button";

interface UserPayload {
  productId: string;
  quantity: number;
}

interface GuestPayload extends UserPayload {
  guestId: string;
}

interface CartItem {
    id?: string;
    productId?: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image?: string;
}

interface CartSliderProps {
    isOpen: boolean;
    onClose: () => void;
    items?: CartItem[];
}

const CartSlider = ({ isOpen, onClose, items = [] }: CartSliderProps) => {
    const { isSignedIn } = useUser();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            const guestId = getGuestId();
            fetch(`/api/cart?guestId=${guestId}`, {
                method: "GET",
                credentials: "include",
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("API CART =", data);
                    setCartItems(data.cart || []);
                })
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Skeleton Loader Component
    const CartSkeleton = () => (
        <div className="p-6 space-y-6">
            {[...Array(3)].map((_, index) => (
                <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100"
                >
                    {/* Image Skeleton */}
                    <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-lg bg-gray-200 animate-pulse" />
                    </div>

                    {/* Content Skeleton */}
                    <div className="flex-1 min-w-0 space-y-3">
                        {/* Title Skeleton */}
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />

                        {/* Size/Color Skeleton */}
                        <div className="flex items-center gap-3">
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                            <span>•</span>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                        </div>

                        {/* Price and Controls Skeleton */}
                        <div className="flex items-center justify-between">
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                                <div className="w-6 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>

                        {/* Item Total Skeleton */}
                        <div className="text-right">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-12 ml-auto" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    // Footer Skeleton
    const FooterSkeleton = () => (
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur-sm">
            <div className="p-6 space-y-4">
                {/* Pricing Breakdown Skeleton */}
                <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex justify-between text-sm">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                        </div>
                    ))}
                    <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                            <div className="h-5 bg-gray-200 rounded animate-pulse w-12" />
                            <div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
                        </div>
                    </div>
                </div>

                {/* Button Skeletons */}
                <div className="space-y-3">
                    <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
                    <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
                </div>

                {/* Security Badge Skeleton */}
                <div className="flex items-center justify-center pt-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
                </div>
            </div>
        </div>
    );

    const subtotal = cartItems.reduce((sum, item) => {
        if (!item || typeof item.price !== "number" || typeof item.quantity !== "number") return sum;
        return sum + (item.price * item.quantity);
    }, 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + shipping;

    const handleQuantityChange = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            )
        );

        const payload: UserPayload | GuestPayload = { productId, quantity: newQuantity };
       if (!isSignedIn) {
  let guestId = localStorage.getItem("guest_id");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guest_id", guestId);
  }
  // TypeScript knows payload can be extended
  (payload as GuestPayload).guestId = guestId;
}
        try {
            const res = await fetch("/api/cart/update-quantity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update quantity");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemoveItem = async (id: string) => {
        try {
            const guestId = localStorage.getItem("guest_id");
            const res = await fetch("/api/cart/remove-quantity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: id, guestId }),
            });
            const data = await res.json();
            if (res.ok) {
                setCartItems(data.cart);
                document.dispatchEvent(new Event("cartUpdated"));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            {/* Overlay Background with Animation */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-300"
                onClick={handleBackdropClick}
            />

            {/* Cart Drawer with Enhanced Animation */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">

                {/* Enhanced Header */}
                <div className="p-6 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-black rounded-lg">
                                <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                                <p className="text-sm text-gray-500">
                                    {isLoading ? (
                                        <span className="h-4 bg-gray-200 rounded animate-pulse inline-block w-16" />
                                    ) : (
                                        `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'}`
                                    )}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                        >
                            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <CartSkeleton />
                    ) : cartItems.length === 0 ? (
                        // Empty State
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                            <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
                            <button
                                onClick={onClose}
                                className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="p-6 space-y-6">
                            {cartItems.map((item) => (
                                <div
                                    key={item.productId || item.id}
                                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 group"
                                >
                                    {/* Product Image */}
                                    <div className="relative flex-shrink-0">
                                        <Image
                                            src={item.image!}
                                            alt={item.name}
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />
                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveItem(item.productId!)}
                                            className="absolute -top-2 -left-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                            <span>Size: {item.size}</span>
                                            <span>•</span>
                                            <span>Color: {item.color}</span>
                                        </div>

                                        {/* Price and Quantity Controls */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-gray-900">
                                                ${item.price.toFixed(2)}
                                            </span>

                                            <div className="flex items-center gap-3">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId!, item.quantity - 1)}
                                                        className="p-1 hover:bg-white rounded-md transition-colors duration-200"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3 text-gray-600" />
                                                    </button>
                                                    <span className="text-sm font-semibold w-6 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId!, item.quantity + 1)}
                                                        className="p-1 hover:bg-white rounded-md transition-colors duration-200"
                                                    >
                                                        <Plus className="w-3 h-3 text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="text-right mt-2">
                                            <span className="text-sm font-semibold text-gray-700">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Enhanced Footer */}
                {!isLoading && cartItems.length > 0 && (
                    <div className="border-t border-gray-100 bg-white/95 backdrop-blur-sm">
                        <div className="p-6 space-y-4">
                            {/* Pricing Breakdown */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className={shipping === 0 ? "text-green-600 font-semibold" : "font-semibold"}>
                                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-xs text-gray-500 text-center">
                                        Free shipping on orders over $100
                                    </p>
                                )}
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 gap-2">
                                <Link href={"/checkout"} >
                                    <Button onClick={onClose} className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]">
                                        Proceed to Checkout
                                    </Button>
                                </Link>
                                <Button
                                    onClick={onClose}
                                    className="w-full border bg-white border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Continue Shopping
                                </Button>
                            </div>

                            {/* Security Badge */}
                            <div className="flex items-center justify-center gap-2 pt-2">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <span>🔒</span>
                                    <span>Secure checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Show footer skeleton when loading with items */}
                {isLoading && cartItems.length === 0 && <FooterSkeleton />}
            </div>
        </>
    );
};

export default CartSlider;