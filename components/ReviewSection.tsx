"use client";

import React from "react";
import { Star } from "lucide-react";
import Image from "next/image";

const reviews = [
  {
    name: "Alice Johnson",
    rating: 5,
    comment: "Amazing products and fast delivery! Highly recommended.",
    avatar: "https://picsum.photos/seed/alice/80/80",
  },
  {
    name: "Mark Thompson",
    rating: 4,
    comment: "Great quality but packaging could be better.",
    avatar: "https://picsum.photos/seed/mark/80/80",
  },
  {
    name: "Sophia Lee",
    rating: 5,
    comment: "Excellent customer service and smooth shopping experience.",
    avatar: "https://picsum.photos/seed/sophia/80/80",
  },
  {
    name: "David Kim",
    rating: 4,
    comment: "Products arrived on time and matched the description perfectly.",
    avatar: "https://picsum.photos/seed/david/80/80",
  },
];

const ReviewSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from our satisfied customers
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                    width={80}
                    height={80}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.name}</h3>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-gray-700 leading-relaxed">
                &quot;{review.comment}&quot;
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-gray-900">4.8/5</div>
              <div className="text-gray-600 text-sm mt-1">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-gray-600 text-sm mt-1">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">98%</div>
              <div className="text-gray-600 text-sm mt-1">Would Recommend</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-gray-600 text-sm mt-1">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;