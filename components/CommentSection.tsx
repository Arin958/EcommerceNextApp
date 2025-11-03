"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ReviewForm } from "./ReviewForm";
import { ReviewItem } from "./ReviewItem";
import { RatingSummary } from "./RatingSummary";
import { ReviewFilters } from "./ReviewFilters";
import { IReviewReply } from "@/types";

interface IUser {
  _id: string;
  username: string;
  avatar?: string;
}

interface IReview {
  _id: string;
  user: IUser;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  likes: number;
  dislikes: number;
  replies: IReviewReply[];
  createdAt: string;
  updatedAt: string;
}

interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: IReview[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

interface ReviewSectionProps {
  productId: string;
  initialReviews?: IReview[];
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, initialReviews = [] }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [reviews, setReviews] = useState<IReview[]>(initialReviews);
  const [isLoadingReviews, setIsLoadingReviews] = useState(!initialReviews.length);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch reviews with filtering and pagination
  const fetchReviews = async (page = 1, ratingFilter?: string) => {
    try {
      setIsLoadingReviews(true);

      const params = new URLSearchParams({
        productId,
        page: page.toString(),
        limit: pagination.limit.toString(),
        sortBy: 'createdAt',
        sortOrder: 'desc',
        ...(ratingFilter && ratingFilter !== 'all' && { rating: ratingFilter })
      });

      const response = await fetch(`/api/reviews/get/?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data: ReviewsResponse = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // Initial load or when filter changes
  useEffect(() => {
    fetchReviews(1, activeFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, productId]);

  // Calculate rating distribution from current reviews
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const totalReviews = pagination.total;
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const handleLike = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/get/${reviewId}/like`, {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Liked review!");
        fetchReviews(pagination.page, activeFilter);
      }
    } catch {
      toast.error("Failed to like review");
    }
  };

  const handleDislike = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/get/${reviewId}/dislike`, {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Disliked review!");
        fetchReviews(pagination.page, activeFilter);
      }
    } catch {
      toast.error("Failed to dislike review");
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    fetchReviews(1, filter);
  };

  const handleLoadMore = () => {
    if (pagination.hasNext) {
      fetchReviews(pagination.page + 1, activeFilter);
    }
  };

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return reviewDate.toLocaleDateString();
  };

  return (
    <Card className="mt-10 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Rating Summary */}
        <RatingSummary
          averageRating={averageRating}
          totalReviews={totalReviews}
          ratingDistribution={ratingDistribution}
        />

        {/* Review Filters */}
        <ReviewFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          totalReviews={totalReviews}
          ratingDistribution={ratingDistribution}
        />

        <Separator />

        {/* Review Form */}
        <ReviewForm
          productId={productId}
          onSubmitSuccess={() => fetchReviews(1, activeFilter)}
        />

        {/* Existing Reviews */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Customer Reviews ({reviews.length} of {totalReviews})
            </h3>
          </div>

          {isLoadingReviews ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : reviews.length > 0 ? (
            <>
              {reviews.map((review) => (
                <ReviewItem
                  key={review._id}
                  review={review}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  getInitials={getInitials}
                  getTimeAgo={getTimeAgo}
                  onReplySuccess={() => fetchReviews(pagination.page, activeFilter)}
                  onDeleteSuccess={() => fetchReviews()}
                />
              ))}

              {/* Load More Button */}
              {pagination.hasNext && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    disabled={isLoadingReviews}
                  >
                    {isLoadingReviews ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Load More Reviews
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <div className="text-muted-foreground mb-4">
                {activeFilter === "all" ? (
                  <>No reviews yet. Be the first to review this product!</>
                ) : (
                  <>No {activeFilter} star reviews yet.</>
                )}
              </div>
              {activeFilter !== "all" && (
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange("all")}
                >
                  View All Reviews
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSection;