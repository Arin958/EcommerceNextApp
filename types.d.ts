

interface User {
  _id: string;
  clerkId: string;
  username: string;
  email: string;
  role: string;
  lastActivity: Date;
}

interface Variant {
  color: string;
  size: string;
  stock: number;
}

export interface IProduct extends Document {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  sku?: string;
  brand?: string | null;
  category?: string;
  images?: string[] | null;
  thumbnail?: string;
  price: number;
  discountPrice?: number | null;
  stock?: number;
  sold?: number;
  variants?: {
    [x: string]: Key | null | undefined;
    color: string;
    size: string;
    stock: number;
  }[];
  tags?: string[];
  collections?: string[];
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  isPublished: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
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


interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
  sku: string
}

interface IAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  email: string;
}

export interface IOrder extends Document {
  _id: string;
  orderId: string;
  clerkId: string;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: "COD" | "PayPal" | "Stripe";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  transactionId?: string;
  orderStatus:
  | "placed"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";
  shippingAddress: IAddress;

  tracking?: {
    courier: string;
    trackingNumber: string;
    trackingUrl?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}


type PayPalCapture = {
  id: string;
  status: string;
  amount: {
    value: string;
    currency_code: string;
  };
};


interface PayPalPaymentDetails {
  id?: string;
  transactionId: string;
  status?: string;
  payer?: {
    name?: {
      given_name?: string;
      surname?: string;
    };
    email_address?: string;
    payer_id?: string;
  };
  purchase_units?: Array<{
    reference_id?: string;
    amount?: {
      currency_code?: string;
      value?: string;
    };
    payments: {
      captures: PayPalCapture[];
    };
  }>;
}

export interface IReview {
  save(): unknown;
  _id?: string;
  productId: string; // Reference to the product being reviewed
  user: {
    _id: string;
    username: string;
    email?: string;
    avatar?: string; // optional — if you allow profile pictures
  };
  rating?: number; // e.g. 1–5
  title?: string; // short headline like “Great product!”
  comment?: string; // main review text
  images?: string[]; // optional images added by user
  likes?: number; // number of helpful votes
  dislikes?: number;
  likedBy?: string[]; // references to users who liked this review
  dislikedBy?: string[];
  createdAt: Date;
  updatedAt: Date;
  replies: IReviewReply[]; // optional nested replies
}

export interface IReviewReply {
  _id: string;
  user: {
    _id: string;
    username: string;
    role: string; // e.g., “admin” or “vendor”
  };
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}


type OrderStatus =
  | "placed"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";


  type PaymentStatus = "pending" | "paid" | "failed" | "refunded";


export interface INotification extends Document {
  _id: string;
  recipient: {
    _id: string;
    clerkId: string;
    username: string;
    email: string;
    role: "user" | "admin"
  };
  sender: {
    _id: string;
    clerkId: string;
    username: string;
    email: string;
    role: "user" | "admin"
  };
    type:
    | "order_placed"
    | "order_confirmed"
    | "order_shipped"
    | "order_delivered"
    | "order_cancelled"
    | "payment_success"
    | "payment_failed"
    | "review_posted"
    | "refund_requested"
    | "system";
title: string;
message: string;
orderId: string;
productId: string;
reviewId: string;
url?: string;

isRead: boolean;
isSeen: boolean;
readAt?: Date;
seenAt?: Date;
createdAt: Date;
updatedAt: Date;


}



