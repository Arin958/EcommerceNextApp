// components/ReplyForm.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ReplyFormProps {
  reviewId: string;
  onReplySuccess: () => void;
  onCancel?: () => void;
}

export const ReplyForm: React.FC<ReplyFormProps> = ({
  reviewId,
  onReplySuccess,
  onCancel,
}) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/get/${reviewId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: comment.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to post reply");
        return;
      }

      toast.success("✅ Reply posted successfully!");
      setComment("");
      setIsExpanded(false);
      onReplySuccess();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setComment("");
    setIsExpanded(false);
    onCancel?.();
  };

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className="mt-2"
      >
        Reply as Admin
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div className="space-y-2">
        <Label htmlFor="reply" className="text-sm font-medium">
          Admin Reply
        </Label>
        <Textarea
          id="reply"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your reply as an admin..."
          className="min-h-[80px] resize-y"
          autoFocus
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Post Reply"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};