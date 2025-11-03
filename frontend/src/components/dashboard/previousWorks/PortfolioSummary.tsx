
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformWork, PrePlatformWork } from "@/types/previousWorks";

interface PortfolioSummaryProps {
  platformWorks: PlatformWork[];
  prePlatformWorks: PrePlatformWork[];
}

const PortfolioSummary = ({ platformWorks, prePlatformWorks }: PortfolioSummaryProps) => {
  const averageRating = platformWorks.length > 0 
    ? (platformWorks.reduce((sum, work) => sum + work.rating, 0) / platformWorks.length).toFixed(1)
    : "0.0";
    
  const totalEarnings = platformWorks.reduce((sum, work) => 
    sum + parseInt(work.projectValue.replace(/[^\d]/g, '')), 0
  ).toLocaleString();

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Portfolio Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
            <p className="text-lg sm:text-2xl font-bold text-blue-600">{platformWorks.length}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Platform Projects</p>
          </div>
          <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
            <p className="text-lg sm:text-2xl font-bold text-green-600">{prePlatformWorks.length}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Previous Projects</p>
          </div>
          <div className="p-3 sm:p-4 bg-purple-50 rounded-lg">
            <p className="text-lg sm:text-2xl font-bold text-purple-600">{averageRating}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Average Rating</p>
          </div>
          <div className="p-3 sm:p-4 bg-orange-50 rounded-lg">
            <p className="text-lg sm:text-2xl font-bold text-orange-600 truncate">{totalEarnings}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Earnings (XAF)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummary;
