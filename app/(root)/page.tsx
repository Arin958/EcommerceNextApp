import AboutSection from "@/components/AboutSection";
import CategorySection from "@/components/CategoryList";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetails";
import ProductList from "@/components/ProductList";
import PromoTicker from "@/components/Promo";
import ReviewSection from "@/components/ReviewSection";
import connectDB from "@/lib/mongodb";
import { Product, User } from "@/schema/schema";
import { IProduct } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function Home() {

  const { userId } = await auth();


  const dbUser = await User.findOne({ clerkId: userId });


  const adminUser = dbUser ? JSON.parse(JSON.stringify(dbUser)) : null;


  // const product = {
  //   "name": "Premium Wireless Headphones",
  //   "slug": "premium-wireless-headphones",
  //   "description": "Experience crystal-clear sound with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and superior comfort for all-day wear.",
  //   "sku": "WH-2024-001",
  //   "brand": "SoundWave",
  //   "category": "6501234567890abcdef12345",
  //   "images": [
  //     "https://picsum.photos/seed/headphones1/800/800",
  //     "https://picsum.photos/seed/headphones2/800/800",
  //     "https://picsum.photos/seed/headphones3/800/800",
  //     "https://picsum.photos/seed/headphones4/800/800"
  //   ],
  //   "thumbnail": "https://picsum.photos/seed/headphones1/400/400",
  //   "price": 299.99,
  //   "discountPrice": 249.99,
  //   "stock": 150,
  //   "sold": 87,
  //   "variants": [
  //     {
  //       "color": "Black",
  //       "size": "Standard",
  //       "stock": 75
  //     },
  //     {
  //       "color": "White",
  //       "size": "Standard",
  //       "stock": 50
  //     },
  //     {
  //       "color": "Silver",
  //       "size": "Standard",
  //       "stock": 25
  //     }
  //   ],
  //   "tags": ["wireless", "audio", "noise-cancelling", "premium"],
  //   "collections": ["electronics", "featured", "bestsellers"],
  //   "averageRating": 4.7,
  //   "totalReviews": 234,
  //   "isFeatured": true,
  //   "isPublished": true,
  //   "metaTitle": "Premium Wireless Headphones - Active Noise Cancellation | SoundWave",
  //   "metaDescription": "Shop premium wireless headphones with 30-hour battery life and active noise cancellation. Free shipping on orders over $50."
  // }


  // highest sold 


  const bestSellerJson = await Product.find({}).sort({ sold: -1 }).limit(4).lean();
  const bestSeller = bestSellerJson ? JSON.parse(JSON.stringify(bestSellerJson)) : null;

  const productsDetails = await Product.find({}).limit(1).lean<IProduct[]>();
  const products = productsDetails ? JSON.parse(JSON.stringify(productsDetails)) : null;

  const newArrivals = await Product.find({}).sort({ createdAt: -1 }).limit(4).lean<IProduct[]>();
  const newArrivalsJson = newArrivals ? JSON.parse(JSON.stringify(newArrivals)) : null;




  return (
    <div className="flex min-h-screen flex-col">

      <Hero />
      <ProductList product={bestSeller} title="Best Sellers" subtitle="Top picks chosen by thousands of happy customers" />
      <PromoTicker />
      <ProductList product={newArrivalsJson} title="New Arrivals" subtitle="Latest additions to our collection" />
      <div className="mt-10 mb-10">


        <ProductDetail product={products[0]}  />
      </div>
      <CategorySection />
      <AboutSection />
      <ReviewSection />
     

    </div>
  );
}
