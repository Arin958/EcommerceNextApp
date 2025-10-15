"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Phone, Clock } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand & Social */}
        <div className="lg:col-span-2">
          <h3 className="text-white text-2xl font-bold mb-4">ShopEase</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
            Your one-stop online store for premium products. Quality, style, and convenience delivered to your doorstep with exceptional customer service.
          </p>
          
          {/* Contact Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-blue-400" />
              <span className="text-sm">123 Commerce Street, City, State 12345</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-blue-400" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-blue-400" />
              <span className="text-sm">Mon-Fri: 9AM-6PM EST</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <Link 
              href="https://facebook.com" 
              className="bg-gray-800 p-3 rounded-lg hover:bg-blue-600 transition-all duration-300 hover:scale-110"
            >
              <Facebook size={20} />
            </Link>
            <Link 
              href="https://instagram.com" 
              className="bg-gray-800 p-3 rounded-lg hover:bg-pink-600 transition-all duration-300 hover:scale-110"
            >
              <Instagram size={20} />
            </Link>
            <Link 
              href="https://twitter.com" 
              className="bg-gray-800 p-3 rounded-lg hover:bg-blue-400 transition-all duration-300 hover:scale-110"
            >
              <Twitter size={20} />
            </Link>
            <Link 
              href="https://linkedin.com" 
              className="bg-gray-800 p-3 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
            >
              <Linkedin size={20} />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-6 pb-2 border-b border-gray-700">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {[
              { href: "/", label: "Home" },
              { href: "/shop", label: "Shop" },
              { href: "/categories", label: "Categories" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" }
            ].map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-6 pb-2 border-b border-gray-700">
            Support
          </h3>
          <ul className="space-y-3">
            {[
              { href: "/faq", label: "FAQ" },
              { href: "/shipping", label: "Shipping & Delivery" },
              { href: "/returns", label: "Returns & Refunds" },
              { href: "/track-order", label: "Track Order" },
              { href: "/terms", label: "Terms & Conditions" },
              { href: "/privacy", label: "Privacy Policy" }
            ].map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-6 pb-2 border-b border-gray-700">
            Newsletter
          </h3>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Get exclusive deals, new product launches, and special offers directly in your inbox.
          </p>
          
          <form className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                required
              />
              <button 
                type="submit"
                className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 text-white flex items-center justify-center gap-2 font-medium text-sm whitespace-nowrap"
              >
                <Mail size={16} />
                Subscribe
              </button>
            </div>
            <p className="text-gray-500 text-xs">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </form>

          {/* Payment Methods */}
          <div className="mt-8">
            <h4 className="text-white text-sm font-semibold mb-3">We Accept</h4>
            <div className="flex gap-2 flex-wrap">
              {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((method) => (
                <div 
                  key={method}
                  className="bg-gray-800 px-3 py-2 rounded text-xs text-gray-400 border border-gray-700"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm text-center md:text-left">
            &copy; {currentYear} ShopEase. All rights reserved.
          </div>
          
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;