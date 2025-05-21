
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResearcherCardProps {
  id: string;
  name: string;
  title: string;
  institution: string;
  field: string;
  specialties: string[];
  hourlyRate: number;
  rating: number;
  reviews: number;
  imageUrl: string;
}

const ResearcherCard = ({ 
  id,
  name,
  title,
  institution,
  field,
  specialties,
  hourlyRate,
  rating,
  reviews,
  imageUrl
}: ResearcherCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-blue-100">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white to-transparent pt-16">
            <div className="flex items-end">
              <div className="h-20 w-20 rounded-full bg-white border-4 border-white shadow-sm overflow-hidden">
                <img
                  src={imageUrl}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{name}</CardTitle>
            <CardDescription className="text-sm">{title} at {institution}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            {field}
          </Badge>
        </div>
        
        <div className="mt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <div className="flex items-center">
                {Array(5).fill(0).map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-600">{rating} ({reviews})</span>
            </div>
            <div className="text-right">
              <span className="block text-xl font-bold text-gray-900">${hourlyRate}</span>
              <span className="block text-xs text-gray-500">per hour</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 bg-gray-50">
        <Button asChild className="w-full">
          <Link to={`/researchers/${id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResearcherCard;
