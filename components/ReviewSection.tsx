"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, MessageCircle, Quote } from "lucide-react";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    name: "Alice Johnson",
    rating: 5,
    comment: "Amazing products and fast delivery! Highly recommended.",
    avatar: "https://picsum.photos/seed/alice/200/200",
    role: "Verified Buyer",
  },
  {
    id: 2,
    name: "Mark Thompson",
    rating: 4,
    comment: "Great quality but packaging could be better. Overall satisfied.",
    avatar: "https://picsum.photos/seed/mark/200/200",
    role: "Premium Member",
  },
  {
    id: 3,
    name: "Sophia Lee",
    rating: 5,
    comment: "Excellent customer service and smooth shopping experience. Will shop again!",
    avatar: "https://picsum.photos/seed/sophia/200/200",
    role: "Verified Buyer",
  },
  {
    id: 4,
    name: "David Kim",
    rating: 4,
    comment: "Products arrived on time and matched the description perfectly. Great value.",
    avatar: "https://picsum.photos/seed/david/200/200",
    role: "First-time Buyer",
  },
  {
    id: 5,
    name: "Elena Rodriguez",
    rating: 5,
    comment: "Exceptional quality! The attention to detail is impressive.",
    avatar: "https://picsum.photos/seed/elena/200/200",
    role: "VIP Customer",
  },
  {
    id: 6,
    name: "Michael Chen",
    rating: 4,
    comment: "Good products, excellent support team. Resolved my issues quickly.",
    avatar: "https://picsum.photos/seed/michael/200/200",
    role: "Verified Buyer",
  },
];

const ReviewSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  // Calculate visible count based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, reviews.length - visibleCount);
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
    
    setTimeout(() => setIsAnimating(false), 300);
  }, [isAnimating, visibleCount]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, reviews.length - visibleCount);
      return prevIndex === 0 ? maxIndex : prevIndex - 1;
    });
    
    setTimeout(() => setIsAnimating(false), 300);
  }, [isAnimating, visibleCount]);

  // Auto-rotate carousel - FIXED: removed visibleCount from dependency array
  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isHovering, nextSlide]); // Use nextSlide instead of visibleCount

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const maxIndex = Math.max(0, reviews.length - visibleCount);
    setCurrentIndex(Math.min(index, maxIndex));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating 
          ? "fill-black text-black" 
          : "fill-gray-300 text-gray-300"
        } transition-all duration-200`}
      />
    ));
  };

  // Calculate total slides based on visible items
  const totalSlides = Math.max(1, reviews.length - visibleCount + 1);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-gray-100 to-transparent rounded-full opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-gray-100 to-transparent rounded-full opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-black to-transparent" />
            <MessageCircle className="w-6 h-6 text-black" />
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-black to-transparent" />
          </div>
          
          <h2 className="text-5xl font-black tracking-tight text-gray-900 mb-6">
            <span className="bg-clip-text font-bebas text-transparent bg-gradient-to-r from-gray-900 via-black to-gray-900">
              CUSTOMER TESTIMONIALS
            </span>
          </h2>
          
         

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
            {[
              { value: "4.8/5", label: "Average Rating" },
              { value: "500+", label: "Happy Customers" },
              { value: "98%", label: "Recommend Rate" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white border-2 border-black p-6 text-center hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-gray-600 tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Navigation Buttons */}
          {reviews.length > visibleCount && (
            <>
              <button
                onClick={prevSlide}
                disabled={isAnimating}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-20 bg-white border-2 border-black w-12 h-12 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={nextSlide}
                disabled={isAnimating}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-20 bg-white border-2 border-black w-12 h-12 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Next review"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div className="overflow-hidden px-4">
            <div 
              className={`flex gap-6 transition-transform duration-500 ease-out ${isAnimating ? 'opacity-90' : 'opacity-100'}`}
              style={{ 
                transform: `translateX(calc(-${currentIndex} * (100% / ${visibleCount}) - ${currentIndex} * 1.5rem))`,
              }}
            >
              {reviews.map((review) => (
                <div 
                  key={review.id}
                  className="flex-shrink-0"
                  style={{ 
                    width: `calc((100% - ${(visibleCount - 1) * 1.5}rem) / ${visibleCount})`
                  }}
                >
                  <div className="bg-white border-2 border-black p-8 h-full hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-500 group">
                    {/* Quote Icon */}
                    <div className="mb-6">
                      <Quote className="w-10 h-10 text-gray-300 group-hover:text-black transition-colors duration-300" />
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-6">
                      {renderStars(review.rating)}
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 leading-relaxed text-lg mb-8 italic font-medium group-hover:text-gray-900 transition-colors duration-300">
                      &ldquo;{review.comment}&rdquo;
                    </p>

                    {/* User Info */}
                    <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-100 group-hover:border-black transition-colors duration-300">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 group-hover:border-black transition-colors duration-300">
                          <Image
                            src={review.avatar}
                            alt={review.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 text-white fill-white" />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-black text-lg text-gray-900">
                          {review.name}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">
                          {review.role}
                        </p>
                      </div>
                    </div>

                    {/* Decorative Corner */}
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-black w-8" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

     

        {/* Counter */}
        <div className="text-center mt-6">
          <p className="text-sm font-medium text-gray-700">
            <span className="font-black">{currentIndex + 1}</span> 
            <span className="mx-2">/</span>
            <span className="font-medium">{totalSlides}</span>
            <span className="ml-2 text-gray-600">pages</span>
            <span className="mx-4">•</span>
            <span className="font-black">{reviews.length}</span>
            <span className="ml-2 text-gray-600">total reviews</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;