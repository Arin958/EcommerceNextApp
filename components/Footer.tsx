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
  MapPin, 
  Phone, 
  Clock,
  ArrowRight,
  Shield,
  CreditCard,
  Truck,
  CheckCircle,
  ChevronUp,
  Building,
  Globe,
  Lock,
  Package,
  Award,
  Users,
  Headphones,
  RefreshCw,
  Store,
  Gift,
  Tag,
  TrendingUp,
  Sparkles
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-950 text-gray-300 relative overflow-hidden border-t border-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:50px_50px]" />
      </div>

     

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h3 className="text-3xl font-black text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-white" />
                <span>ELEVATE</span>
                <span className="text-gray-400">COMMERCE</span>
              </h3>
              <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
                Your premium destination for curated products. Experience exceptional quality, 
                seamless shopping, and customer-first service since 2020.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="w-10 h-10 border border-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-white">Corporate Office</div>
                  <div className="text-gray-400 text-sm">123 Commerce Street, San Francisco, CA 94107</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="w-10 h-10 border border-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-white">Customer Support</div>
                  <div className="text-gray-400 text-sm">1-800-ELEVATE (1-800-353-8283)</div>
                </div>
              </div>

              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="w-10 h-10 border border-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-white">Email Support</div>
                  <div className="text-gray-400 text-sm">support@elevatecommerce.com</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <div className="font-bold text-white">FOLLOW US</div>
              <div className="flex gap-3">
                {[
                  { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
                  { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
                  { icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
                  { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" },
                  { icon: <Youtube className="h-5 w-5" />, label: "YouTube" },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="w-12 h-12 border border-gray-700 rounded-lg flex items-center justify-center hover:bg-white hover:text-gray-900 hover:border-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Links - Real E-commerce Categories */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Shop Categories */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 pb-3 border-b border-gray-700">
                SHOP BY CATEGORY
              </h4>
              <ul className="space-y-3">
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
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group text-sm"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 pb-3 border-b border-gray-700">
                CUSTOMER SERVICE
              </h4>
              <ul className="space-y-3">
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
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group text-sm"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About & Resources */}
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-bold text-white mb-6 pb-3 border-b border-gray-700">
                  ABOUT ELEVATE
                </h4>
                <ul className="space-y-3">
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
                        className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group text-sm"
                      >
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

          
            </div>
          </div>
        </div>

        {/* Apps & Download */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h5 className="font-bold text-white mb-4">DOWNLOAD OUR APP</h5>
              <div className="flex gap-4">
                <button className="flex items-center gap-3 bg-gray-900 border border-gray-700 px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.8 1.53.12 2.66.72 3.57 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.03.03zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="font-bold text-white">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-gray-900 border border-gray-700 px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 20.5v-17c0-.77.47-1.45 1.18-1.73l13 8.5c.64.42.64 1.36 0 1.78l-13 8.5C3.47 21.95 3 21.27 3 20.5z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Get it on</div>
                    <div className="font-bold text-white">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <div className="font-bold text-white text-sm">SECURE PAYMENT METHODS</div>
              <div className="flex gap-3 flex-wrap">
                {["VISA", "MASTERCARD", "AMEX", "DISCOVER", "PAYPAL", "APPLE PAY", "GOOGLE PAY", "SHOP PAY"].map((method) => (
                  <div 
                    key={method}
                    className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-xs text-gray-300 hover:text-white hover:border-gray-500 transition-colors duration-300"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} ELEVATE COMMERCE, INC. ALL RIGHTS RESERVED.
            </div>
            
            {/* Country Selector */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <select className="bg-transparent text-gray-400 text-sm focus:outline-none">
                  <option>United States (USD $)</option>
                  <option>Canada (CAD $)</option>
                  <option>United Kingdom (GBP £)</option>
                  <option>European Union (EUR €)</option>
                  <option>Australia (AUD $)</option>
                </select>
              </div>
              <span className="text-gray-600">|</span>
              <div className="text-xs text-gray-500">
                Prices include applicable taxes
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
              >
                Back to Top
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Compliance & Trust Seals */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-xs text-gray-500 text-center md:text-left">
                Elevate Commerce is a participant in various affiliate marketing programs. 
                This site is protected by reCAPTCHA and the Google{" "}
                <Link href="/privacy" className="underline">Privacy Policy</Link> and{" "}
                <Link href="/terms" className="underline">Terms of Service</Link> apply.
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Lock className="h-3 w-3" />
                  <span>SSL Secured</span>
                </div>
                <div className="text-xs text-gray-500">
                  •
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="h-3 w-3" />
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