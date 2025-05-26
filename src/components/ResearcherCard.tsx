
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Calendar, Star } from "lucide-react";
import { VerificationBadge } from "@/components/verification/VerificationBadge";
import ServiceBookingModal from "@/components/payment/ServiceBookingModal";

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
  institution,
  field,
  specialties,
  hourlyRate,
  rating,
  reviews,
  imageUrl,
  verifications
}: ResearcherCardProps) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
            <img 
              src={imageUrl} 
              alt={name}
              className="w-20 h-20 rounded-full object-cover absolute bottom-4 left-4 border-4 border-white shadow-lg"
            />
            <div className="absolute top-4 right-4">
              <VerificationBadge verifications={verifications} />
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{name}</h3>
              <p className="text-sm text-gray-600 mb-1">{title}</p>
              <p className="text-sm text-gray-500">{institution}</p>
            </div>
            
            <div className="mb-4">
              <Badge variant="secondary" className="mb-2">{field}</Badge>
              <div className="flex flex-wrap gap-1">
                {specialties.slice(0, 2).map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {specialties.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{specialties.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-sm text-gray-500">({reviews} reviews)</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">{hourlyRate.toLocaleString()} XAF/hr</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => setIsBookingModalOpen(true)}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Book Now
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
