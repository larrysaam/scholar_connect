
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Star } from "lucide-react";

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="text-center border-green-100">
        <CardContent className="p-4">
          <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">200+</div>
          <div className="text-sm text-gray-600">Active Research Aids</div>
        </CardContent>
      </Card>
      <Card className="text-center border-green-100">
        <CardContent className="p-4">
          <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">15+</div>
          <div className="text-sm text-gray-600">Service Categories</div>
        </CardContent>
      </Card>
      <Card className="text-center border-green-100">
        <CardContent className="p-4">
          <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">4.7</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
