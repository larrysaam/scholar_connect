
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Star } from "lucide-react";

const StatsCards = () => {
  return (
    <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Active Research Aids */}
      <Card className="group hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 border-0 bg-gradient-to-br from-emerald-50 to-green-100/50 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        <CardContent className="p-6 text-center relative">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent mb-1">200+</div>
          <div className="text-sm font-medium text-gray-600">Expert Research Aids</div>
          <div className="mt-2 text-xs text-emerald-600 flex items-center justify-center">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
            Available Now
          </div>
        </CardContent>
      </Card>
      
      {/* Service Categories */}
      <Card className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border-0 bg-gradient-to-br from-blue-50 to-indigo-100/50 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        <CardContent className="p-6 text-center relative">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-1">15+</div>
          <div className="text-sm font-medium text-gray-600">Service Categories</div>
          <div className="mt-2 text-xs text-blue-600 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
            Specialized Fields
          </div>
        </CardContent>
      </Card>
      
      {/* Average Rating */}
      <Card className="group hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 border-0 bg-gradient-to-br from-yellow-50 to-orange-100/50 overflow-hidden relative sm:col-span-2 lg:col-span-1">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        <CardContent className="p-6 text-center relative">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Star className="h-8 w-8 text-white fill-current" />
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text text-transparent mb-1">4.7</div>
          <div className="text-sm font-medium text-gray-600">Average Rating</div>
          <div className="mt-2 text-xs text-yellow-600 flex items-center justify-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse" />
            Quality Assured
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
