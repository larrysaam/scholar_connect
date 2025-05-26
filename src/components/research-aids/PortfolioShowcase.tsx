
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Star } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  fileUrl?: string;
  rating: number;
  clientFeedback: string;
  completedDate: string;
}

interface PortfolioShowcaseProps {
  portfolioItems: PortfolioItem[];
}

const PortfolioShowcase = ({ portfolioItems }: PortfolioShowcaseProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Portfolio & Previous Work</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolioItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{item.title}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              {item.imageUrl && (
                <div className="mb-3">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < item.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-2">{item.rating}/5</span>
              </div>
              
              <blockquote className="text-xs italic text-gray-600 mb-3 border-l-2 border-gray-200 pl-2">
                "{item.clientFeedback}"
              </blockquote>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Completed: {new Date(item.completedDate).toLocaleDateString()}
                </span>
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3" />
                  </Button>
                  {item.fileUrl && (
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortfolioShowcase;
