
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  showScore?: boolean;
}

const StarRating = ({ rating, showScore = true }: StarRatingProps) => {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-3 w-3 sm:h-4 sm:w-4 ${
            index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
      {showScore && (
        <span className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2">({rating}/5)</span>
      )}
    </div>
  );
};

export default StarRating;
