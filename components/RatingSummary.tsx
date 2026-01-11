// components/RatingSummary.tsx
import React from "react";
import { StarRating } from "./StarRating";

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({
  averageRating,
  totalReviews,
  ratingDistribution,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Overall Rating */}
      <div className="text-center p-6 border rounded-lg">
        <div className="text-2xl font-bold text-blue-600 mb-2">
          {averageRating.toFixed(1)}
        </div>
        <StarRating rating={Math.round(averageRating)} readonly size={12} />
        <div className="text-sm text-muted-foreground mt-2">
          Based on {totalReviews} reviews
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm font-medium">{stars}</span>
              <StarRating rating={stars} readonly size={12} />
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{
                  width: totalReviews > 0 ? `${(ratingDistribution[stars as keyof typeof ratingDistribution] / totalReviews) * 100}%` : '0%'
                }}
              />
            </div>
            <span className="text-sm text-muted-foreground w-8">
              {ratingDistribution[stars as keyof typeof ratingDistribution]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};