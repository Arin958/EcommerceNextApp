"use client";

import React from "react";
import { Truck, Shield, Star, Heart, CheckCircle, ArrowRight, Package, Users, Clock, Award, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: <Truck className="h-6 w-6 md:h-8 md:w-8" />,
    title: "Lightning Fast Delivery",
    description: "Get your orders delivered within 24-48 hours. Free shipping on orders over $50.",
    stat: "24-48h",
    highlight: "FREE SHIPPING"
  },
  {
    icon: <Shield className="h-6 w-6 md:h-8 md:w-8" />,
    title: "Bank-Level Security",
    description: "256-bit encryption protects all transactions. Your payment data is always secure.",
    stat: "100% Safe",
    highlight: "ENCRYPTED"
  },
  {
    icon: <Star className="h-6 w-6 md:h-8 md:w-8" />,
    title: "Premium Quality",
    description: "Every product undergoes rigorous quality checks. Curated excellence guaranteed.",
    stat: "5★ Rating",
    highlight: "CERTIFIED"
  },
  {
    icon: <Package className="h-6 w-6 md:h-8 md:w-8" />,
    title: "Easy Returns",
    description: "30-day hassle-free return policy. Your satisfaction is our priority.",
    stat: "30 Days",
    highlight: "NO QUESTIONS"
  },
  {
    icon: <Users className="h-6 w-6 md:h-8 md:w-8" />,
    title: "24/7 Support",
    description: "Round-the-clock customer service. Real humans, not robots.",
    stat: "24/7",
    highlight: "LIVE CHAT"
  },
  {
    icon: <Award className="h-6 w-6 md:h-8 md:w-8" />,
    title: "Award Winning",
    description: "Recognized as Best E-commerce Platform 2023. Industry leader in innovation.",
    stat: "Top 1%",
    highlight: "AWARDED"
  },
];

const stats = [
  { value: "50K+", label: "Customers", icon: <Users className="h-3 w-3 md:h-4 md:w-4" /> },
  { value: "4.9★", label: "Rating", icon: <Star className="h-3 w-3 md:h-4 md:w-4" /> },
  { value: "98%", label: "Satisfaction", icon: <Heart className="h-3 w-3 md:h-4 md:w-4" /> },
  { value: "24h", label: "Delivery", icon: <Clock className="h-3 w-3 md:h-4 md:w-4" /> },
  { value: "10K+", label: "Products", icon: <Package className="h-3 w-3 md:h-4 md:w-4" /> },
  { value: "150+", label: "Brands", icon: <Globe className="h-3 w-3 md:h-4 md:w-4" /> },
];

const AboutSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-linear-to-b from-white to-gray-50">
      {/* Background Pattern - Simplified for mobile */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />
        <div className="absolute inset-0 bg-[radial-linear(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-size-[40px_40px] hidden md:block" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Simplified for mobile */}
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
            <div className="w-8 md:w-16 h-px bg-linear-to-r from-transparent via-black to-transparent" />
            <div className="flex items-center gap-1 md:gap-2">
              <Zap className="h-4 w-4 md:h-5 md:w-5 text-black" />
              <span className="text-xs md:text-sm font-black tracking-widest text-black uppercase">
                Why We&apos;re Different
              </span>
              <Zap className="h-4 w-4 md:h-5 md:w-5 text-black" />
            </div>
            <div className="w-8 md:w-16 h-px bg-linear-to-r from-transparent via-black to-transparent" />
          </div>
          
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bebas font-black mb-4 md:mb-8">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-gray-900 via-black to-gray-900">
              UNCOMPROMISING
            </span>
            <br className="md:hidden" />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-gray-700 via-gray-900 to-gray-700">
              EXCELLENCE
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed font-medium px-4 md:px-0">
            We don&apos;t just sell products—we deliver exceptional experiences. Every detail is 
            crafted to exceed your expectations.
          </p>

          {/* Stats Grid - Optimized for mobile */}
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4 max-w-4xl mx-auto mb-12 md:mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white border-2 border-black p-3 md:p-4 rounded-xl hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-black rounded-full flex items-center justify-center">
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all hidden md:block" />
                </div>
                <div className="text-base md:text-2xl font-black">{stat.value}</div>
                <div className="text-[10px] md:text-xs font-bold text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid - Single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Card - Reduced padding on mobile */}
              <div className="relative bg-white border-2 border-black rounded-2xl p-6 md:p-8 h-full hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-500">
                {/* Corner Accents - Hidden on mobile */}
                <div className="absolute top-4 right-4 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block" />
                <div className="absolute bottom-4 left-4 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block" />
                
                {/* Header */}
                <div className="flex items-start justify-between mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-black rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-[10px] md:text-xs font-black tracking-widest bg-black text-white px-2 md:px-3 py-1 rounded-full inline-block mb-1 md:mb-2">
                      {feature.highlight}
                    </div>
                    <div className="text-lg md:text-2xl font-black">{feature.stat}</div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2 md:mb-4 group-hover:text-black transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 md:mb-6">
                  {feature.description}
                </p>

                {/* CTA - Simplified on mobile */}
                <div className="flex items-center justify-between pt-4 md:pt-6 border-t-2 border-gray-100 group-hover:border-black transition-colors duration-300">
                  <span className="text-xs md:text-sm font-bold text-black">
                    LEARN MORE
                  </span>
                  <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-black rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement - Optimized for mobile */}
        <div className="mt-16 md:mt-24">
          <div className="bg-black text-white rounded-2xl p-6 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[linear-linear(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-size-[20px_20px]" />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <CheckCircle className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-6 md:mb-8 text-white opacity-90" />
              <h2 className="text-2xl md:text-4xl font-black mb-4 md:mb-8 tracking-tight">
                OUR COMMITMENT TO PERFECTION
              </h2>
              <p className="text-base md:text-xl text-gray-300 leading-relaxed mb-6 md:mb-10 font-medium">
                We believe that exceptional experiences are built on attention to detail, 
                uncompromising quality, and genuine care for every customer.
              </p>
              
              {/* Mission items - Stacked on mobile */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
                  <span className="text-sm md:text-base font-bold">Industry-leading quality</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
                  <span className="text-sm md:text-base font-bold">Sustainable & ethical</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
                  <span className="text-sm md:text-base font-bold">Customer-first philosophy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA - Fully responsive */}
        <div className="text-center mt-12 md:mt-20">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 md:gap-6 bg-white border-4 border-black rounded-2xl md:rounded-full px-6 md:px-8 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 group w-full sm:w-auto">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center shrink-0">
              <Heart className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-base md:text-lg font-black">Join 50,000+ satisfied customers</p>
              <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Experience the difference today</p>
            </div>
            <button className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-sm md:text-base w-full sm:w-auto">
              START SHOPPING
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;