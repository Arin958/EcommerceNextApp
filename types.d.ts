import mongoose from "mongoose";

interface User {
    clerkId: string;
    username: string;
    email: string;
    role: string;
    lastActivity: Date;
}


export interface IProduct extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  sku: string;
  brand: string;
  category: string;
  images: string[];
  thumbnail: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sold: number;
  variants?: {
    [x: string]: Key | null | undefined;
    color?: string;
    size?: string;
    stock?: number;
  }[];
  tags?: string[];
  collections?: string[];
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ICart extends Document {
  clerkId: string;// store clerk user id
  guestId?: string; 
  items: ICartItem[];
}

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}

export interface IOrder extends Document {
  clerkId?: string;
  guestId?: string;
  items: IOrderItem[];
  subtotal: number;
  shippingFee?: number;
  discount?: number;
  totalAmount: number;
  paymentMethod: "paypal" | "cod" | "card";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  address?: {
    fullName?: string;
    phone?: string;
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  transactionId?: string;
}