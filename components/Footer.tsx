"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube,
  Mail, 
  Phone, 
  ArrowRight,
  Shield,
  ChevronUp,
  Building,
  Globe,
  Lock,
  Sparkles
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-950 text-gray-300 relative overflow-hidden border-t border-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:50px_50px]" />
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Brand Section - Full width on mobile */}
          <div className="lg:col-span-1">
            <div className="mb-6 sm:mb-8">
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 sm:mb-4 flex flex-wrap items-center gap-1 sm:gap-2">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <span>ELEVATE</span>
                <span className="text-gray-400">COMMERCE</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-md">
                Your premium destination for curated products. Experience exceptional quality, 
                seamless shopping, and customer-first service since 2020.
              </p>
            </div>

            {/* Contact Info - Stacked on mobile */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-700 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
                  <Building className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white text-sm sm:text-base">Corporate Office</div>
                  <div className="text-gray-400 text-xs sm:text-sm truncate">123 Commerce Street, San Francisco, CA 94107</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-700 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm sm:text-base">Customer Support</div>
                  <div className="text-gray-400 text-xs sm:text-sm">1-800-ELEVATE (1-800-353-8283)</div>
                </div>
              </div>

              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-700 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm sm:text-base">Email Support</div>
                  <div className="text-gray-400 text-xs sm:text-sm">support@elevatecommerce.com</div>
                </div>
              </div>
            </div>

            {/* Social Links - Responsive grid */}
            <div className="space-y-3 sm:space-y-4">
              <div className="font-bold text-white text-sm sm:text-base">FOLLOW US</div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { icon: <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Facebook" },
                  { icon: <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Instagram" },
                  { icon: <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Twitter" },
                  { icon: <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />, label: "LinkedIn" },
                  { icon: <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />, label: "YouTube" },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="w-10 h-10 sm:w-12 sm:h-12 border border-gray-700 rounded-lg flex items-center justify-center hover:bg-white hover:text-gray-900 hover:border-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Links - Responsive grid */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
              {/* Shop Categories */}
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-700">
                  SHOP BY CATEGORY
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    { href: "/category/men", label: "Men's Fashion" },
                    { href: "/category/women", label: "Women's Fashion" },
                    { href: "/category/electronics", label: "Electronics" },
                    { href: "/category/home", label: "Home & Living" },
                    { href: "/category/beauty", label: "Beauty & Wellness" },
                    { href: "/category/sports", label: "Sports & Outdoors" },
                    { href: "/category/toys", label: "Toys & Games" },
                    { href: "/category/books", label: "Books & Media" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                      >
                        <ArrowRight className="h-2 w-2 sm:h-3 sm:w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer Service */}
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-700">
                  CUSTOMER SERVICE
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    { href: "/help-center", label: "Help Center" },
                    { href: "/track-order", label: "Track Your Order" },
                    { href: "/shipping-delivery", label: "Shipping & Delivery" },
                    { href: "/returns-exchanges", label: "Returns & Exchanges" },
                    { href: "/size-guides", label: "Size Guides" },
                    { href: "/product-care", label: "Product Care" },
                    { href: "/contact-us", label: "Contact Us" },
                    { href: "/accessibility", label: "Accessibility" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                      >
                        <ArrowRight className="h-2 w-2 sm:h-3 sm:w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About & Resources */}
              <div className="sm:col-span-2">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-700">
                      ABOUT ELEVATE
                    </h4>
                    <ul className="space-y-2 sm:space-y-3">
                      {[
                        { href: "/about-us", label: "About Us" },
                        { href: "/careers", label: "Careers" },
                        { href: "/press", label: "Press & Media" },
                        { href: "/sustainability", label: "Sustainability" },
                        { href: "/affiliate-program", label: "Affiliate Program" },
                        { href: "/investor-relations", label: "Investor Relations" },
                        { href: "/brand-partners", label: "Brand Partners" },
                        { href: "/site-map", label: "Site Map" },
                      ].map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                          >
                            <ArrowRight className="h-2 w-2 sm:h-3 sm:w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apps & Download - Responsive */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="w-full lg:w-auto">
              <h5 className="font-bold text-white mb-4 text-center lg:text-left text-sm sm:text-base">DOWNLOAD OUR APP</h5>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
                <button className="flex items-center gap-3 bg-gray-900 border border-gray-700 px-4 sm:px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 w-full sm:w-auto justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.8 1.53.12 2.66.72 3.57 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.03.03zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] sm:text-xs text-gray-400">Download on the</div>
                    <div className="font-bold text-white text-sm sm:text-base">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-gray-900 border border-gray-700 px-4 sm:px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 w-full sm:w-auto justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 20.5v-17c0-.77.47-1.45 1.18-1.73l13 8.5c.64.42.64 1.36 0 1.78l-13 8.5C3.47 21.95 3 21.27 3 20.5z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] sm:text-xs text-gray-400">Get it on</div>
                    <div className="font-bold text-white text-sm sm:text-base">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Methods - Responsive wrapping */}
            <div className="w-full lg:w-auto">
              <div className="font-bold text-white text-sm text-center lg:text-left mb-4">SECURE PAYMENT METHODS</div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                {["VISA", "MASTERCARD", "AMEX", "DISCOVER", "PAYPAL", "APPLE PAY", "GOOGLE PAY", "SHOP PAY"].map((method) => (
                  <div 
                    key={method}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-900 border border-gray-700 rounded text-[10px] sm:text-xs text-gray-300 hover:text-white hover:border-gray-500 transition-colors duration-300"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Completely responsive */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Copyright and Country - Stacked on mobile */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="text-center md:text-left">
              <div className="text-gray-500 text-[10px] sm:text-sm">
                © {currentYear} ELEVATE COMMERCE, INC. ALL RIGHTS RESERVED.
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                <select className="bg-transparent text-gray-400 text-[10px] sm:text-sm focus:outline-none max-w-[120px] sm:max-w-none">
                  <option>United States (USD $)</option>
                  <option>Canada (CAD $)</option>
                  <option>United Kingdom (GBP £)</option>
                  <option>European Union (EUR €)</option>
                  <option>Australia (AUD $)</option>
                </select>
              </div>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <div className="text-[10px] sm:text-xs text-gray-500 text-center">
                Prices include applicable taxes
              </div>
            </div>
          </div>

          {/* Legal Links - Responsive wrapping */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 sm:gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-[10px] sm:text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[10px] sm:text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-[10px] sm:text-sm text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <Link href="/sitemap" className="text-[10px] sm:text-sm text-gray-400 hover:text-white transition-colors">
              Sitemap
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[10px] sm:text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back to Top
              <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Compliance & Trust Seals - Responsive */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
              <div className="text-[10px] sm:text-xs text-gray-500 text-center md:text-left">
                Elevate Commerce is a participant in various affiliate marketing programs. 
                This site is protected by reCAPTCHA and the Google{" "}
                <Link href="/privacy" className="underline">Privacy Policy</Link> and{" "}
                <Link href="/terms" className="underline">Terms of Service</Link> apply.
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                  <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>SSL Secured</span>
                </div>
                <div className="text-gray-500 text-[10px] sm:text-xs hidden sm:inline">
                  •
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Trusted Site</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;