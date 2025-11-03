import { IAddress, ICart, ICartItem, INotification, IOrder, IOrderItem, IProduct, IReview, IReviewReply } from "@/types";
import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  username: { type: String },
  email: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  lastActivity: { type: Date, default: Date.now },
}, {
  timestamps: true
});

const ProductSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },

    sku: { type: String, required: true, unique: true },
    brand: { type: String },
    category: { type: String, required: true },

    images: { type: [String], required: true },
    thumbnail: { type: String, required: true },

    price: { type: Number, required: true },
    discountPrice: { type: Number },


    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },

    variants: [
      {
        color: String,
        size: String,
        stock: Number,
      },
    ],

    tags: [String],
    collections: [String],

    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },

    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    quantity: { type: Number, default: 1 },
    size: { type: String },
    color: { type: String },
  },
  { _id: false }
);


const CartSchema = new Schema<ICart>(
  {
    clerkId: { type: String, unique: true, sparse: true },
    guestId: { type: String, unique: true, sparse: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  size: { type: String },
  color: { type: String },
  image: { type: String },
});

const AddressSchema = new Schema<IAddress>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    clerkId: { type: String, required: true },

    items: [OrderItemSchema],

    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["COD", "paypal", "Stripe"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    transactionId: { type: String },

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "placed",
    },

    shippingAddress: { type: AddressSchema, required: true },
    

    tracking: {
      courier: { type: String },
      trackingNumber: { type: String },
      trackingUrl: { type: String },
    },

    notes: { type: String },
  },
  { timestamps: true }
);


const ReplySchema = new Schema<IReviewReply>(
  {
    user: {
      _id: { type: String, ref: "User", required: true },
      username: { type: String, required: true },
      role: { type: String },
    },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Review Schema
const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: String, ref: "Product", required: true },
    user: {
      _id: { type: String, ref: "User", required: true },
      username: { type: String, required: true },
      email: { type: String },
      avatar: { type: String },
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true },
    comment: { type: String, required: true, trim: true },
    images: [{ type: String }],
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likedBy: { type: [String], ref: "User", default: [] },
dislikedBy: { type: [String], ref: "User", default: [] },
    replies: [ReplySchema],
  },
  { timestamps: true }
);


 // optional if you have a type file

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      _id: { type: String, ref: "User", required: true },
      clerkId: { type: String},
      username: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, enum: ["user", "admin"], default: "user" },
    },
    sender: {
      _id: { type: String, ref: "User", required: true },
      clerkId: { type: String, required: true },
      username: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, enum: ["user", "admin"] },
    },
    type: {
      type: String,
      enum: [
        "order_placed",
        "order_confirmed",
        "order_shipped",
        "order_delivered",
        "order_cancelled",
        "payment_success",
        "payment_failed",
        "review_posted",
        "refund_requested",
        "review_liked",
        "system",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    orderId: { type: String, ref: "Order" },
    productId: { type: String, ref: "Product" },
    reviewId: { type: String, ref: "Review" },
    url: { type: String },
    isRead: { type: Boolean, default: false },
    isSeen: { type: Boolean, default: false },
    readAt: { type: Date },
    seenAt: { type: Date },
    
  },
  { timestamps: true }
);

export const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);

export const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);