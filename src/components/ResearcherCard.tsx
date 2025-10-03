
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Calendar, Star, Eye, Users } from "lucide-react";
import VerificationBadge from "@/components/verification/VerificationBadge";
import ServiceBookingModal from "@/components/payment/ServiceBookingModal";
import { useNavigate } from "react-router-dom";

interface ResearcherCardProps {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  institution: string;
  field: string;
  specialties: string[];
  hourlyRate: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  studentsSupervised?: number;
  verifications: {
    academic: "verified" | "pending" | "unverified";
    publication: "verified" | "pending" | "unverified";
    institutional: "verified" | "pending" | "unverified";
  };
}

const ResearcherCard = ({
  id,
  name,
  title,
  subtitle,
  institution,
  field,
  specialties,
  hourlyRate,
  rating,
  reviews,
  imageUrl,
  studentsSupervised = 0,
  verifications
}: ResearcherCardProps) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/researcher/${id}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const shouldShowFallback = !imageUrl || imageError;

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">        <CardContent className="p-0">
          <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
            {shouldShowFallback ? (
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold absolute bottom-4 left-4 border-4 border-white shadow-lg">
                {getInitials(name)}
              </div>
            ) : (
              <img 
                src={imageUrl} 
                alt={name}
                className="w-20 h-20 rounded-full object-cover absolute bottom-4 left-4 border-4 border-white shadow-lg"
                onError={() => setImageError(true)}
              />
            )}
            <div className="absolute top-4 right-4">
              <VerificationBadge 
                type="overall" 
                status="verified" 
                verifications={verifications} 
              />
            </div>
          </div>
            <div className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {subtitle && <span className="">{subtitle} </span>}
                {name}
              </h3>
              {title && (
                <p className="text-sm font-medium text-blue-600 mb-1">{title}</p>
              )}
              <p className="text-sm text-gray-500">{institution}</p>
            </div>
            
            <div className="mb-4">
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-2">SPECIALIZATIONS</p>
                <div className="flex flex-wrap gap-1">
                  {specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="default" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {specialty}
                    </Badge>
                  ))}
                  {specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs text-gray-600">
                      +{specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              {field && (
                <div className="mb-2">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">{field}</Badge>
                </div>
              )}
            </div>
              <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-sm text-gray-500">({reviews} reviews)</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-600">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">{studentsSupervised}</span>
                <span className="text-sm text-gray-500">students</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={handleViewProfile}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Profile
              </Button>
              
            </div>
          </div>
        </CardContent>
      </Card>

      <ServiceBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        provider={{
          id,
          name,
          title,
          rating,
          hourlyRate
        }}
        serviceType="consultation"
      />
    </>
  );
};

export default ResearcherCard;
