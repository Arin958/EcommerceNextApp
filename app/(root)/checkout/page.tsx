"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import PayPalButton from "@/components/PayPalButton";
import Image from "next/image";
import { PayPalPaymentDetails } from "@/types";



interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
}



export default function SimpleCheckout() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    email: "",
  });

  // Fetch cart data when component mounts
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cart');
        const data = await response.json();
        
        if (response.ok) {
          setCartItems(data.cart || []);
        } else {
          console.error('Failed to fetch cart:', data.message);
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate order total from cart items
  const calculateOrderTotal = () => {
    if (cartItems.length === 0) return 0;
    
    const subtotal = cartItems.reduce(
      (sum: number, item: CartItem) => sum + (item.price * item.quantity), 
      0
    );
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    return subtotal + shipping + tax;
  };

  const orderTotal = calculateOrderTotal();

  // Handle COD order submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === "paypal") {
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        shippingAddress: formData,
        paymentMethod: "COD",
      };

      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/thank-you?orderId=${result.order._id}`);
      } else {
        alert(result.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle PayPal success
  const handlePayPalSuccess = async (paypalData: PayPalPaymentDetails) => {
    setIsSubmitting(true);

    const transactionId = paypalData.purchase_units?.[0]?.payments?.captures?.[0]?.id;

if (!transactionId) {
  alert("Failed to get transaction ID from PayPal");
  setIsSubmitting(false);
  return;
}

    try {
      const orderData = {
        shippingAddress: formData,
        paymentMethod: "paypal",
        paypalOrderId: paypalData.id,
        transactionId,
      };

      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/thank-you?orderId=${result.order._id}`);
      } else {
        alert(result.message || "Failed to place order");
      }
    } catch (error) {
      console.error("PayPal Order Error:", error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayPalError = (error: Error) => {
    console.error("PayPal Error:", error);
    alert("Payment failed. Please try again.");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading your cart...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show empty cart message
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
            <Button 
              onClick={() => router.push('/products')}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate detailed breakdown for display
  const subtotal = cartItems.reduce(
    (sum: number, item: CartItem) => sum + (item.price * item.quantity), 
    0
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold ml-4">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Shipping & Payment */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
                <CardDescription>
                  Enter your complete shipping address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email*</Label>
                  <Input
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="G4e2y@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    name="addressLine1"
                    required
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="123 Main St"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Apt, Suite, etc. (Optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">ZIP Code *</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="10001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="United States"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="COD" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span>Cash on Delivery (COD)</span>
                        <Badge variant="secondary">Pay Later</Badge>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span>PayPal</span>
                        <Badge variant="secondary">Secure</Badge>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* COD Notice */}
                {paymentMethod === "COD" && (
                  <Alert>
                    <AlertDescription className="text-sm">
                      <strong>Cash on Delivery:</strong> You will pay when your order is delivered. 
                      Please have the exact amount ready.
                    </AlertDescription>
                  </Alert>
                )}

                {/* PayPal Button */}
                {paymentMethod === "paypal" && (
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <PayPalButton
                      amount={orderTotal}
                      onSuccess={handlePayPalSuccess}
                      onError={handlePayPalError}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                        width={40}
                        height={40}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.color}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.size}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 pt-4 border-t">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Secure checkout</span>
                </div>

                {/* COD Submit Button */}
                {paymentMethod === "COD" && (
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full h-12 text-base"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Placing Order...
                      </>
                    ) : (
                      `Place COD Order - $${orderTotal.toFixed(2)}`
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}