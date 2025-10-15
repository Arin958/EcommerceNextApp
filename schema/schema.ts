import { ICart, ICartItem, IOrder, IOrderItem, IProduct } from "@/types";
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

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
    image: { type: String },
  },
  { _id: false }
);


const OrderSchema = new Schema<IOrder>(
  {
    clerkId: { type: String, sparse: true },
    guestId: { type: String, sparse: true },

    items: { type: [OrderItemSchema], required: true },

    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["paypal", "cod", "card"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    address: {
      fullName: { type: String },
      phone: { type: String },
      street: { type: String },
      city: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },

    transactionId: { type: String },
  },
  { timestamps: true }
);


export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);