// components/ReviewItem.tsx
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "./StarRating";
import { ThumbsUp, ThumbsDown, MessageCircle, Share, Reply, Trash2 } from "lucide-react";
import Image from "next/image";
import { ReplyForm } from "./ReplyForm";
import { IReviewReply } from "@/types";
import { toast } from "sonner";

interface ReviewItemProps {
  review: {
    _id: string;
    user: {
      _id: string;
      username: string;
      avatar?: string;
    };
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
    likes: number;
    dislikes: number;
    replies: IReviewReply[];
    createdAt: string;
    updatedAt: string;
  };
  onLike: (reviewId: string) => void;
  onDislike: (reviewId: string) => void;
  onReplySuccess: () => void;
  onDeleteSuccess: () => void; // New prop for handling successful deletion
  getInitials: (username: string) => string;
  getTimeAgo: (date: string) => string;
  isAdmin?: boolean;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  onLike,
  onDislike,
  onReplySuccess,
  onDeleteSuccess, // New prop
  getInitials,
  getTimeAgo,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkRoleAndUser = async () => {
      try {
        // Check user role
        const res = await fetch("/api/user/role");
        const data = await res.json();
        if (data.role === "admin") {
          setIsAdmin(true);
        }
        
        // Get current user ID (you might need to adjust this based on your auth setup)
        const userRes = await fetch("/api/user/me");
   
        const userData = await userRes.json();
      
        if (userData) {
          setCurrentUserId(userData._id);
        }

       
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    };
    checkRoleAndUser();
  }, []);

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onReplySuccess();
  };

  const handleDeleteReply = async (reviewId: string, replyId: string) => {
    if (!confirm("Are you sure you want to delete this reply?")) {
      return;
    }

    setIsDeleting(replyId);
    try {
      const response = await fetch(`/api/reviews/get/${reviewId}/replies/${replyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Reply deleted successfully");
        onReplySuccess();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to delete reply");
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
      toast.error("Failed to delete reply");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setIsDeleting(reviewId);
    try {
      const response = await fetch(`/api/reviews/delete/${reviewId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Review deleted successfully");
        onDeleteSuccess(); // Call the success callback to refresh the list
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(null);
    }
  };

  // Check if current user can delete this review
  const canDeleteReview = isAdmin || currentUserId === review.user._id;
  console.log(canDeleteReview, "canDeleteReview")


  return (
    <Card key={review._id} className="p-6">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12 border">
          <AvatarImage src={review.user?.avatar} alt={review.user?.username} />
          <AvatarFallback className="text-sm font-medium">
            {getInitials(review.user?.username || "User")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <p className="font-semibold text-base">{review.user?.username}</p>
              <StarRating rating={review.rating} readonly size={16} />
              <span className="text-sm text-muted-foreground">
                {getTimeAgo(review.createdAt)}
              </span>
            </div>
            
            {/* Delete Review Button */}
            {canDeleteReview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteReview(review._id)}
                disabled={isDeleting === review._id}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                <span className="sr-only">Delete review</span>
              </Button>
            )}
          </div>

          {review.title && (
            <h4 className="font-semibold text-lg text-foreground">
              {review.title}
            </h4>
          )}

          <p className="text-base text-foreground leading-relaxed">
            {review.comment}
          </p>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-3 mt-3 flex-wrap">
              {review.images.map((img, i) => (
                <div
                  key={i}
                  className="w-24 h-24 rounded-lg overflow-hidden border cursor-pointer"
                  onClick={() => window.open(img, '_blank')}
                >
                  <Image
                    src={img}
                    alt="Review image"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    width={96}
                    height={96}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Review Actions */}
          <div className="flex items-center gap-4 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(review._id)}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{review.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDislike(review._id)}
              className="flex items-center gap-2"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{review.dislikes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{review.replies.length} replies</span>
            </Button>

            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-2"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>

          {/* Admin Reply Form */}
          {isAdmin && showReplyForm && (
            <ReplyForm
              reviewId={review._id}
              onReplySuccess={handleReplySuccess}
              onCancel={() => setShowReplyForm(false)}
            />
          )}

          {/* Replies Section */}
          {review.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
              {review.replies.map((reply, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-blue-100">
                      {getInitials(reply.user?.username || "A")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{reply.user?.username}</span>
                      {reply.user?.role === "admin" && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Admin
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(reply.createdAt.toISOString())}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{reply.comment}</p>
                  </div>
                  
                  {/* Delete button for admin */}
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReply(review._id, reply._id!)}
                      disabled={isDeleting === reply._id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};