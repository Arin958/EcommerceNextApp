"use client";

import React from "react";
import { Truck, Shield, Star, Heart, CheckCircle } from "lucide-react";


const features = [
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Fast Delivery",
    description: "Get your orders delivered quickly and safely to your doorstep.",
    stat: "24-48h"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Payment",
    description: "Safe and secure payment options with full protection.",
    stat: "100% Safe"
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Premium Quality",
    description: "Top-quality products curated for our valued customers.",
    stat: "5★ Rating"
  },
];

const AboutSection = () => {
  return (
    <>
      {/* Option 1: Modern Gradient with Stats */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Heart className="h-4 w-4 text-pink-400" />
              <span className="text-sm font-medium text-white">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Exceptional Shopping
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Experience
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We are dedicated to providing the best products and services to our customers.  
              Enjoy exclusive deals, free shipping, and a seamless shopping experience.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {feature.icon}
                  </div>
                  {/* Stat Badge */}
                  <div className="absolute -top-2 -right-2 px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-sm font-bold rounded-full border border-white">
                    {feature.stat}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-4">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <span className="text-white font-semibold">Join 10,000+ satisfied customers worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Option 2: Minimal Dark (Uncomment to use) */}
      {/*
      <section className="relative py-20 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built Different
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the difference with our customer-first approach and premium service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-slate-700 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}
    </>
  );
};

export default AboutSection;