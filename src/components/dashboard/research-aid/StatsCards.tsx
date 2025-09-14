
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Star } from "lucide-react";

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {/* Active Research Aids */}
      <Card className="text-center border-green-100 hover:border-green-200 transition-colors">
        <CardContent className="p-4 sm:p-6">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mx-auto mb-2 sm:mb-3" />
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">200+</div>
          <div className="text-xs sm:text-sm text-gray-600">Active Research Aids</div>
        </CardContent>
      </Card>
      
      {/* Service Categories */}
      <Card className="text-center border-green-100 hover:border-blue-200 transition-colors">
        <CardContent className="p-4 sm:p-6">
          <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mx-auto mb-2 sm:mb-3" />
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">15+</div>
          <div className="text-xs sm:text-sm text-gray-600">Service Categories</div>
        </CardContent>
      </Card>
      
      {/* Average Rating */}
      <Card className="text-center border-green-100 hover:border-yellow-200 transition-colors sm:col-span-2 lg:col-span-1">
        <CardContent className="p-4 sm:p-6">
          <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mx-auto mb-2 sm:mb-3" />
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">4.7</div>
          <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
