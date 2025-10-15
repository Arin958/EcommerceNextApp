"use client";

import React from "react";

const PromoTicker = () => {
  const messages = [
    "🚚 Free Shipping on Orders Over $50",
    "⏳ Limited Time Offer – 30% OFF!",
    "🆕 New Arrivals Just Dropped!",
    "💳 Secure Payment & Easy Returns",
  ];

  // Repeat messages to create a seamless loop
  const repeatedMessages = [...messages, ...messages];

  return (
    <div className="w-full bg-black text-white py-2 overflow-hidden mt-10 mb-10">
      <div className="animate-marquee whitespace-nowrap flex">
        {repeatedMessages.map((msg, index) => (
          <span key={index} className="mx-8 text-xl font-medium">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PromoTicker;
