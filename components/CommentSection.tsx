"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Star, MessageSquare, ThumbsUp, ThumbsDown, Filter, ChevronDown } from "lucide-react";
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
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with subtle accent */}
        <div className="mb-8 text-center relative">
          <h1 className="text-4xl font-black font-bebas bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-black to-gray-900 inline-block relative px-8 bg-white">
            CUSTOMER REVIEWS
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Summary Card */}
            <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-black">
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current text-black" />
                  <span className="font-black text-xl">RATING OVERVIEW</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RatingSummary
                  averageRating={averageRating}
                  totalReviews={totalReviews}
                  ratingDistribution={ratingDistribution}
                />
                
                {/* Visual Rating Distribution */}
                <div className="mt-6 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2 group cursor-pointer">
                      <div className="flex items-center gap-1 min-w-[60px]">
                        <span className="font-bold text-sm">{rating}</span>
                        <Star className="w-3 h-3 fill-current text-black" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-black transition-all duration-300 group-hover:bg-gray-800"
                          style={{ width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / (totalReviews || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold min-w-[30px]">
                        {ratingDistribution[rating as keyof typeof ratingDistribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filters Card */}
            <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-black">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  <span className="font-black text-xl">FILTER REVIEWS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ReviewFilters
                  activeFilter={activeFilter}
                  onFilterChange={handleFilterChange}
                  totalReviews={totalReviews}
                  ratingDistribution={ratingDistribution}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Reviews & Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Review Form Card */}
            <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-black">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-black text-xl">WRITE A REVIEW</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ReviewForm
                  productId={productId}
                  onSubmitSuccess={() => fetchReviews(1, activeFilter)}
                />
              </CardContent>
            </Card>

            {/* Reviews List Card */}
            <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-black">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-black text-xl">
                      CUSTOMER FEEDBACK
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        ({reviews.length} of {totalReviews})
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    <ThumbsDown className="w-4 h-4" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Loading State */}
                {isLoadingReviews ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600 font-medium">Loading authentic reviews...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <>
                    {/* Reviews Grid */}
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review._id} className="group">
                          <ReviewItem
                            review={review}
                            onLike={handleLike}
                            onDislike={handleDislike}
                            getInitials={getInitials}
                            getTimeAgo={getTimeAgo}
                            onReplySuccess={() => fetchReviews(pagination.page, activeFilter)}
                            onDeleteSuccess={() => fetchReviews()}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Load More */}
                    {pagination.hasNext && (
                      <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-300">
                        <Button
                          onClick={handleLoadMore}
                          className="w-full py-6 border-2 border-black bg-white hover:bg-black hover:text-white transition-all duration-200 font-bold group"
                          disabled={isLoadingReviews}
                        >
                          {isLoadingReviews ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Loading...
                            </>
                          ) : (
                            <>
                              LOAD MORE REVIEWS
                              <ChevronDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  /* Empty State */
                  <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <MessageSquare className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-black mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {activeFilter === "all" 
                        ? "Be the first to share your experience with this product!"
                        : `No ${activeFilter} star reviews yet.`}
                    </p>
                    {activeFilter !== "all" && (
                      <Button
                        variant="outline"
                        onClick={() => handleFilterChange("all")}
                        className="border-2 border-black hover:bg-black hover:text-white font-bold"
                      >
                        VIEW ALL REVIEWS
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border-2 border-black p-4 text-center hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="text-2xl font-black">{totalReviews}</div>
                <div className="text-xs text-gray-600 font-bold">TOTAL REVIEWS</div>
              </div>
              <div className="bg-white border-2 border-black p-4 text-center hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="text-2xl font-black">{averageRating.toFixed(1)}</div>
                <div className="text-xs text-gray-600 font-bold">AVG RATING</div>
              </div>
              <div className="bg-white border-2 border-black p-4 text-center hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="text-2xl font-black">{reviews.length}</div>
                <div className="text-xs text-gray-600 font-bold">DISPLAYED</div>
              </div>
              <div className="bg-white border-2 border-black p-4 text-center hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="text-2xl font-black">{pagination.totalPages}</div>
                <div className="text-xs text-gray-600 font-bold">PAGES</div>
              </div>
            </div>
          </div>
        </div>

        {/* Designer Signature (for recruiter) */}
  
      </div>
    </div>
  );
};

export default ReviewSection