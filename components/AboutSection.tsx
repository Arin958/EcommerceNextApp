"use client";

import React from "react";
import { Truck, Shield, Star, Heart, CheckCircle, ArrowRight, Package, Users, Clock, Award, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: <Truck className="h-8 w-8" />,
    title: "Lightning Fast Delivery",
    description: "Get your orders delivered within 24-48 hours. Free shipping on orders over $50.",
    stat: "24-48h",
    highlight: "FREE SHIPPING"
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Bank-Level Security",
    description: "256-bit encryption protects all transactions. Your payment data is always secure.",
    stat: "100% Safe",
    highlight: "ENCRYPTED"
  },
  {
    icon: <Star className="h-8 w-8" />,
    title: "Premium Quality",
    description: "Every product undergoes rigorous quality checks. Curated excellence guaranteed.",
    stat: "5★ Rating",
    highlight: "CERTIFIED"
  },
  {
    icon: <Package className="h-8 w-8" />,
    title: "Easy Returns",
    description: "30-day hassle-free return policy. Your satisfaction is our priority.",
    stat: "30 Days",
    highlight: "NO QUESTIONS"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "24/7 Support",
    description: "Round-the-clock customer service. Real humans, not robots.",
    stat: "24/7",
    highlight: "LIVE CHAT"
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: "Award Winning",
    description: "Recognized as Best E-commerce Platform 2023. Industry leader in innovation.",
    stat: "Top 1%",
    highlight: "AWARDED"
  },
];

const stats = [
  { value: "50K+", label: "Happy Customers", icon: <Users className="h-4 w-4" /> },
  { value: "4.9★", label: "Average Rating", icon: <Star className="h-4 w-4" /> },
  { value: "98%", label: "Satisfaction Rate", icon: <Heart className="h-4 w-4" /> },
  { value: "24h", label: "Avg Delivery", icon: <Clock className="h-4 w-4" /> },
  { value: "10K+", label: "Products", icon: <Package className="h-4 w-4" /> },
  { value: "150+", label: "Brands", icon: <Globe className="h-4 w-4" /> },
];

const AboutSection = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-gradient-to-br from-gray-100 to-transparent rounded-full opacity-50" />
        <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-gradient-to-tr from-gray-100 to-transparent rounded-full opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-black to-transparent" />
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-black animate-pulse" />
              <span className="text-sm font-black tracking-widest text-black uppercase">
                Why We&apos;re Different
              </span>
              <Zap className="h-5 w-5 text-black animate-pulse" />
            </div>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-black to-transparent" />
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bebas font-black mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-black to-gray-900">
              UNCOMPROMISING
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700">
              EXCELLENCE
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            We don&apos;t just sell products—we deliver exceptional experiences. Every detail is 
            crafted to exceed your expectations, from premium quality to unparalleled service.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white border-2 border-black p-4 rounded-xl hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-xs font-bold text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-white border-2 border-black rounded-2xl p-8 h-full hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-500">
                {/* Corner Accents */}
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs font-black tracking-widest bg-black text-white px-3 py-1 rounded-full inline-block mb-2">
                      {feature.highlight}
                    </div>
                    <div className="text-2xl font-black">{feature.stat}</div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-black transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between pt-6 border-t-2 border-gray-100 group-hover:border-black transition-colors duration-300">
                  <span className="text-sm font-bold text-black">
                    LEARN MORE
                  </span>
                  <div className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Background Pattern on Hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.2),transparent_70%)]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-24">
          <div className="bg-black text-white rounded-2xl p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-8 text-white opacity-90" />
              <h2 className="text-4xl font-black mb-8 tracking-tight">
                OUR COMMITMENT TO PERFECTION
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-10 font-medium">
                We believe that exceptional experiences are built on attention to detail, 
                uncompromising quality, and genuine care for every customer. This isn&apos;t just 
                our promise—it&apos;s our standard.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="font-bold">Industry-leading quality standards</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="font-bold">Sustainable & ethical practices</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="font-bold">Customer-first philosophy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-6 bg-white border-4 border-black rounded-full px-8 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-left">
              <p className="text-lg font-black">Join 50,000+ satisfied customers worldwide</p>
              <p className="text-sm text-gray-600">Experience the difference today</p>
            </div>
            <button className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-black border-2 border-black transition-all duration-300">
              START SHOPPING
            </button>
          </div>
        </div>

   
      </div>
    </section>
  );
};

export default AboutSection;