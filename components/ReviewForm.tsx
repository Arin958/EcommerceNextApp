// components/ReviewForm.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "./StarRating";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  onSubmitSuccess: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onSubmitSuccess,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || !comment) {
      toast.error("Please fill all required fields!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to post review");
        return;
      }

      toast.success("✅ Review posted successfully!");
      setRating(0);
      setTitle("");
      setComment("");
      onSubmitSuccess();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Write a Review</h3>

      <div className="space-y-2">
        <Label htmlFor="rating" className="text-sm font-medium">
          Rating *
        </Label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Title (optional)
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your review a title"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment" className="text-sm font-medium">
          Comment *
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          className="min-h-[120px] resize-y"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};