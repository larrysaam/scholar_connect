import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

interface QuickActionsCardProps {
  onViewJobBoard: () => void;
}

const QuickActionsCard = ({ onViewJobBoard }: QuickActionsCardProps) => {
  return (
    <div className="hidden sm:block mb-8">
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">New Opportunities Available</h3>
                <p className="text-gray-600 text-sm">Check out the latest research assistance jobs posted by students</p>
              </div>
            </div>
            <Button 
              onClick={() => onViewJobBoard?.()}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              View All Jobs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActionsCard;
