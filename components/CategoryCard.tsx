"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  name: string;
  image: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, image }) => {
  return (
    <Link href={`/shop?category=${encodeURIComponent(name)}`}>
      <Card className="group relative overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl aspect-square">
        {/* Category Image */}
        <div className="relative h-full w-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/30 transition-all duration-500"></div>

          {/* Category Name */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center w-full px-4">
            <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-2xl mb-2 transform group-hover:translate-y-[-2px] transition-transform duration-300">
              {name}
            </h3>
            <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              <span className="text-white/90 text-sm font-medium tracking-wide border-b border-white/50 pb-1">
                Shop Now
              </span>
              <svg 
                className="w-4 h-4 ml-2 text-white transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </div>
      </Card>
    </Link>
  );
};

// Usage component for two categories side by side
interface CategoriesGridProps {
  categories: CategoryCardProps[];
}

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({ categories }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.name}
            name={category.name}
            image={category.image}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;