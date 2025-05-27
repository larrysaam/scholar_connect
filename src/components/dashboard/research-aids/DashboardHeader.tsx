
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface DashboardHeaderProps {
  onViewJobBoard: () => void;
}

const DashboardHeader = ({ onViewJobBoard }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Research Aids Dashboard</h1>
        <p className="text-gray-600">Manage your jobs, clients, and earnings</p>
      </div>
      <Button 
        onClick={onViewJobBoard}
        className="bg-primary hover:bg-primary/90 lg:w-auto w-full mt-4 lg:mt-0"
      >
        <Search className="h-4 w-4 mr-2" />
        Browse Job Board
      </Button>
    </div>
  );
};

export default DashboardHeader;
