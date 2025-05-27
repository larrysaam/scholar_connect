
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Award, Eye } from "lucide-react";

interface ResearchAid {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  rating: number;
  reviews: number;
  hourlyRate: number;
  location: string;
  imageUrl: string;
  featured: boolean;
  description: string;
}

interface ResearchAidsListingProps {
  filteredAids: ResearchAid[];
  onViewProfile: (aidId: string) => void;
}

const ResearchAidsListing = ({ filteredAids, onViewProfile }: ResearchAidsListingProps) => {
  const ResearchAidCard = ({ aid }: { aid: ResearchAid }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img 
              src={aid.imageUrl} 
              alt={aid.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
            />
            {aid.featured && (
              <div className="absolute -top-1 -right-1 bg-accent rounded-full p-1">
                <Award className="h-3 w-3 text-accent-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{aid.name}</h3>
                <p className="text-sm text-primary font-medium">{aid.title}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {aid.location}
                </p>
              </div>
              {aid.featured && (
                <Badge className="bg-accent text-accent-foreground border-0">
                  Featured
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{aid.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {aid.expertise.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                  {skill}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{aid.rating}</span>
                  <span className="text-sm text-gray-500">({aid.reviews})</span>
                </div>
                <div className="text-sm font-bold text-primary">
                  {aid.hourlyRate.toLocaleString()} XAF/hr
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => onViewProfile(aid.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section id="research-aids-listing" className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">
            Available Research Aids 
            <span className="text-gray-500 font-normal ml-2">({filteredAids.length} found)</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAids.map((aid) => (
              <ResearchAidCard key={aid.id} aid={aid} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchAidsListing;
