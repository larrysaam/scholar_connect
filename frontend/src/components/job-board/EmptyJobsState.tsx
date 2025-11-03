
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

const EmptyJobsState = () => {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
      </CardContent>
    </Card>
  );
};

export default EmptyJobsState;
