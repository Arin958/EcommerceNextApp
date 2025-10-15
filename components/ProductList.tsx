"use client";
import React from "react";
import ProductCard from "./ProductCard";
import { IProduct } from "@/types";
import { motion } from "framer-motion";

interface Props {
  product: IProduct[];
  title: string;
  subtitle?: string;
}

const ProductList: React.FC<Props> = ({ product, title, subtitle }) => {
  return (
    <section className="space-y-6 mt-10">
      {/* Section Title */}
      <div className="text-center mb-10">
        <h2 className="font-bebas text-3xl sm:text-4xl md:text-5xl tracking-wide">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-500 text-sm md:text-base mt-2">
            {subtitle}
          </p>
        )}
        <div className="w-24 h-1 bg-black mx-auto mt-4"></div>
      </div>

      {/* Product Grid */}
      <motion.ul
        className="
          grid 
          gap-6 
          sm:gap-8 
          grid-cols-2
          sm:grid-cols-2
          lg:grid-cols-4 
        "
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {product.map((item) => (
          <motion.li
            key={item._id.toString()}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <ProductCard product={item} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};

export default ProductList;
