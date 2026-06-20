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
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Calculate visible count based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(1);
      } else if (width < 768) {
        setVisibleCount(1);
      } else if (width < 1024) {
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

  // Auto-rotate carousel
  useEffect(() => {
    if (isHovering || reviews.length <= visibleCount) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isHovering, nextSlide, visibleCount]);

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const maxIndex = Math.max(0, reviews.length - visibleCount);
    setCurrentIndex(Math.min(index, maxIndex));
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      // Swipe left
      nextSlide();
    } else if (touchStartX - touchEndX < -50) {
      // Swipe right
      prevSlide();
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < rating 
          ? "fill-black text-black" 
          : "fill-gray-300 text-gray-300"
        } transition-all duration-200`}
      />
    ));
  };

  // Calculate total slides based on visible items
  const totalSlides = Math.max(1, reviews.length - visibleCount + 1);

  // Check if navigation is needed
  const showNavigation = reviews.length > visibleCount;

  return (
    <section className="py-12 sm:py-16 bg-linear-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern - Simplified for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 sm:w-96 sm:h-96 bg-linear-to-br from-gray-100 to-transparent rounded-full opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 sm:w-96 sm:h-96 bg-linear-to-tr from-gray-100 to-transparent rounded-full opacity-50" />
        <div className="absolute inset-0 bg-[radial-linear(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-size-[20px_20px] hidden sm:block" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header - Responsive */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4">
            <div className="w-8 sm:w-12 h-px bg-linear-to-r from-transparent via-black to-transparent" />
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            <div className="w-8 sm:w-12 h-px bg-linear-to-r from-transparent via-black to-transparent" />
          </div>
          
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4 sm:mb-6">
            <span className="bg-clip-text font-bebas text-transparent bg-linear-to-r from-gray-900 via-black to-gray-900">
              CUSTOMER TESTIMONIALS
            </span>
          </h2>

          {/* Stats Grid - Responsive */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto mt-8 sm:mt-12">
            {[
              { value: "4.8/5", label: "Average Rating" },
              { value: "500+", label: "Happy Customers" },
              { value: "98%", label: "Recommend Rate" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white border-2 border-black p-4 sm:p-6 text-center hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-gray-600 tracking-wider">
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
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Buttons - Hidden on smallest screens */}
          {showNavigation && (
            <>
              <button
                onClick={prevSlide}
                disabled={isAnimating}
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 md:-translate-x-8 z-20 bg-white border-2 border-black w-10 h-10 sm:w-12 sm:h-12 rounded-full items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={nextSlide}
                disabled={isAnimating}
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 md:translate-x-8 z-20 bg-white border-2 border-black w-10 h-10 sm:w-12 sm:h-12 rounded-full items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div className="overflow-hidden px-1 sm:px-4">
            <div 
              className={`flex gap-3 sm:gap-6 transition-transform duration-500 ease-out ${isAnimating ? 'opacity-90' : 'opacity-100'}`}
              style={{ 
                transform: `translateX(calc(-${currentIndex} * (100% / ${visibleCount}) - ${currentIndex} * 0.75rem))`,
              }}
            >
              {reviews.map((review) => (
                <div 
                  key={review.id}
                  className="shrink-0"
                  style={{ 
                    width: `calc((100% - ${(visibleCount - 1) * 0.75}rem) / ${visibleCount})`
                  }}
                >
                  <div className="bg-white border-2 border-black p-5 sm:p-6 md:p-8 h-full hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 group relative">
                    {/* Quote Icon - Smaller on mobile */}
                    <div className="mb-4 sm:mb-6">
                      <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 group-hover:text-black transition-colors duration-300" />
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-4 sm:mb-6">
                      {renderStars(review.rating)}
                    </div>

                    {/* Comment - Smaller text on mobile */}
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 italic font-medium group-hover:text-gray-900 transition-colors duration-300">
                      &ldquo;{review.comment}&rdquo;
                    </p>

                    {/* User Info - Flexible layout */}
                    <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t-2 border-gray-100 group-hover:border-black transition-colors duration-300">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-gray-300 group-hover:border-black transition-colors duration-300">
                          <Image
                            src={review.avatar}
                            alt={review.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-black rounded-full flex items-center justify-center">
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-white" />
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-base sm:text-lg text-gray-900 truncate">
                          {review.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                          {review.role}
                        </p>
                      </div>
                    </div>

                    {/* Decorative Corner - Hidden on mobile */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block" />
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Swipe Indicator */}
        {showNavigation && (
          <div className="flex justify-center items-center gap-1 mt-2 sm:hidden">
            <span className="text-xs text-gray-400">Swipe</span>
            <span className="text-gray-400">←</span>
            <span className="text-gray-400">→</span>
          </div>
        )}

        {/* Carousel Indicators - Responsive */}
        {totalSlides > 1 && (
          <div className="flex justify-center items-center gap-2 sm:gap-3 mt-8 sm:mt-12">
            {Array.from({ length: Math.min(totalSlides, 10) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-black w-6 sm:w-8" 
                    : "bg-gray-300 hover:bg-gray-400 w-2 sm:w-3"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
            {totalSlides > 10 && (
              <span className="text-xs text-gray-400 ml-1">+{totalSlides - 10}</span>
            )}
          </div>
        )}

        {/* Counter - Responsive */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-xs sm:text-sm font-medium text-gray-700">
            <span className="font-black">{currentIndex + 1}</span> 
            <span className="mx-1 sm:mx-2">/</span>
            <span className="font-medium">{totalSlides}</span>
            <span className="hidden xs:inline ml-1 sm:ml-2 text-gray-600">pages</span>
            <span className="hidden xs:inline mx-2 sm:mx-4">•</span>
            <span className="font-black">{reviews.length}</span>
            <span className="hidden xs:inline ml-1 sm:ml-2 text-gray-600">total reviews</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;