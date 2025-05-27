
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
      <CardHeader>
        <CardTitle>Portfolio Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{platformWorks.length}</p>
            <p className="text-sm text-gray-600">Platform Projects</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{prePlatformWorks.length}</p>
            <p className="text-sm text-gray-600">Previous Projects</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{averageRating}</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{totalEarnings}</p>
            <p className="text-sm text-gray-600">Total Earnings (XAF)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummary;
