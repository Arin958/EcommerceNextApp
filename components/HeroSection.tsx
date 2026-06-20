"use client";
import React, { useEffect, useState } from "react";

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 rounded-4xl mt-10">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
        
        {/* Floating Product Shapes */}
        <div className={`absolute w-72 h-72 -top-24 -left-24 bg-blue-900/20 rounded-full mix-blend-screen filter blur-xl opacity-50 animate-float-slow ${isVisible ? 'opacity-50' : 'opacity-0'} transition-opacity duration-1000`}></div>
        <div className={`absolute w-72 h-72 -bottom-24 -right-24 bg-purple-900/20 rounded-full mix-blend-screen filter blur-xl opacity-50 animate-float-medium ${isVisible ? 'opacity-50' : 'opacity-0'} transition-opacity duration-1000 delay-300`}></div>
        <div className={`absolute w-64 h-64 top-1/2 left-1/3 bg-emerald-900/20 rounded-full mix-blend-screen filter blur-xl opacity-40 animate-float-fast ${isVisible ? 'opacity-40' : 'opacity-0'} transition-opacity duration-1000 delay-600`}></div>

        {/* Animated Shopping Elements */}
        <div className="absolute top-1/4 left-1/5 animate-bounce-slow">
          <div className="w-6 h-6 bg-white/20 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-1/3 right-1/4 animate-bounce-medium">
          <div className="w-4 h-4 bg-white/30 rounded-full opacity-70"></div>
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-bounce-fast">
          <div className="w-3 h-3 bg-white/40 rounded-full opacity-80"></div>
        </div>

        {/* Additional Stars */}
        <div className="absolute top-1/5 right-1/6 animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
        </div>
        <div className="absolute bottom-1/3 right-1/5 animate-pulse delay-1000">
          <div className="w-1.5 h-1.5 bg-white rounded-full opacity-40"></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className={`transform transition-all duration-700 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-2xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Elevate Your
            <span className="block bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Shopping Experience
            </span>
          </h1>
        </div>

        <div className={`transform transition-all duration-700 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <p className="text-md md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover curated collections, exclusive deals, and seamless shopping. 
            Where quality meets convenience and every purchase tells a story.
          </p>
        </div>

        <div className={`transform transition-all duration-700 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
     <button className="group relative bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-2xl hover:scale-105 min-w-40 sm:min-w-50 border border-white/20">
  <span className="relative z-10">Shop Now</span>
  <div className="absolute inset-0 rounded-full bg-linear-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
</button>

<button className="group border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 hover:border-white hover:bg-white/10 hover:shadow-lg min-w-40 sm:min-w-50 backdrop-blur-sm">
  <span className="flex items-center justify-center gap-2">
    Explore Collections
    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </span>
</button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className={`mt-12 hidden md:block transform transition-all duration-700 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2 backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Free Shipping Worldwide
            </div>
            <div className="flex items-center gap-2 backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Secure Payment
            </div>
            <div className="flex items-center gap-2 backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              24/7 Customer Support
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-gray-900/50 via-transparent to-gray-900/30 pointer-events-none"></div>
      <div className="absolute inset-0 bg-linear-to-b from-gray-900/40 via-transparent to-gray-900/40 pointer-events-none"></div>

   
    </section>
  );
};

export default Hero;