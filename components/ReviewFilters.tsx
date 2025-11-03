// components/ReviewFilters.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ReviewFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  activeFilter,
  onFilterChange,
  totalReviews,
  ratingDistribution,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={activeFilter === "all" ? "default" : "outline"}
        className="cursor-pointer"
        onClick={() => onFilterChange("all")}
      >
        All ({totalReviews})
      </Badge>
      {[5, 4, 3, 2, 1].map(rating => (
        <Badge
          key={rating}
          variant={activeFilter === rating.toString() ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onFilterChange(rating.toString())}
        >
          {rating} Star ({ratingDistribution[rating as keyof typeof ratingDistribution]})
        </Badge>
      ))}
    </div>
  );
};