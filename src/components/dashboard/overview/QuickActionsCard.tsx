
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
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            className="h-20 flex flex-col space-y-2"
            onClick={onFindResearcher}
          >
            <Search className="h-6 w-6" />
            <span>Find Researcher</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col space-y-2"
            onClick={onCheckMessages}
          >
            <MessageCircle className="h-6 w-6" />
            <span>Check Messages</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col space-y-2"
            onClick={onMyProgress}
          >
            <BookOpen className="h-6 w-6" />
            <span>My Progress</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
