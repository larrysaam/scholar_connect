import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useReviews } from "@/hooks/useReviews"; // Assuming this hook exists
import { useAuth } from "@/hooks/useAuth"; // To get the current researcher's ID

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  booking: {
    id: string;
    service: {
      title: string;
    };
    scheduled_date: string;
    scheduled_time: string;
  };
}

const ReviewsTab = () => {
  const { user } = useAuth();
  const { reviews, loading, error, fetchReviewsByRevieweeId } = useReviews(); // Assuming this fetches reviews for a specific reviewee

  useEffect(() => {
    if (user?.id) {
      fetchReviewsByRevieweeId(user.id);
    }
  }, [user?.id, fetchReviewsByRevieweeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mr-3" />
        <span>Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error loading reviews: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Reviews</h2>
      <p className="text-gray-600">View feedback from your consultations.</p>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">No reviews yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review: Review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={review.reviewer.avatar_url} />
                    <AvatarFallback>{review.reviewer.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{review.reviewer.full_name}</CardTitle>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{review.rating} out of 5</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                <div className="text-sm text-gray-500">
                  <p>Consultation: {review.booking.service.title}</p>
                  <p>Date: {format(new Date(review.booking.scheduled_date), 'MMM dd, yyyy')} at {review.booking.scheduled_time}</p>
                  <p>Reviewed on: {format(new Date(review.created_at), 'MMM dd, yyyy')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
