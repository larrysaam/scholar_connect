
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, BookOpen } from "lucide-react";

interface QuickActionsCardProps {
  onFindResearcher: () => void;
  onCheckMessages: () => void;
  onMyProgress: () => void;
}

const QuickActionsCard = ({ onFindResearcher, onCheckMessages, onMyProgress }: QuickActionsCardProps) => {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Button 
            className="h-16 sm:h-20 flex flex-col space-y-1 sm:space-y-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
            onClick={onFindResearcher}
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            <span className="text-xs sm:text-sm font-medium">Find Researcher</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 sm:h-20 flex flex-col space-y-1 sm:space-y-2 border-2 hover:bg-gray-50 transition-all duration-200"
            onClick={onCheckMessages}
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            <span className="text-xs sm:text-sm font-medium">Check Messages</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 sm:h-20 flex flex-col space-y-1 sm:space-y-2 border-2 hover:bg-gray-50 transition-all duration-200"
            onClick={onMyProgress}
          >
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            <span className="text-xs sm:text-sm font-medium">My Progress</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
