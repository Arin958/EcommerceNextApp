import { IProduct } from "@/types";
import mongoose, { Schema } from "mongoose";


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
        reservedStock: {
          type: Number,
          default: 0
        }
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

ProductSchema.index({ category: 1 });
ProductSchema.index({ collections: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ sold: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ averageRating: -1 });


export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);