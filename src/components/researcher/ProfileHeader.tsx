
import { Badge } from "@/components/ui/badge";
import BookingModal from "./BookingModal";
import StatusIndicator from "./StatusIndicator";
import CoAuthorModal from "./CoAuthorModal";
import VerificationBadge from "@/components/verification/VerificationBadge";

interface ProfileHeaderProps {
  researcher: {
    field: string;
    specialties: string[];
    name: string;
    title: string;
    institution: string;
    department: string;
    hourlyRate: number;
    rating: number;
    reviews: any[];
    availableTimes: {
      date: Date;
      slots: string[];
    }[];
    imageUrl: string;
    onlineStatus: "online" | "offline" | "in-session";
    verifications?: {
      academic: "verified" | "pending" | "unverified";
      publication: "verified" | "pending" | "unverified";
      institutional: "verified" | "pending" | "unverified";
    };
  };
}

const ProfileHeader = ({ researcher }: ProfileHeaderProps) => {
  const verifications = researcher.verifications || {
    academic: "unverified",
    publication: "unverified",
    institutional: "unverified"
  };

  return (
    <div className="bg-blue-600 text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img 
                src={researcher.imageUrl} 
                alt={researcher.name} 
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
              <div className="flex justify-center">
                <StatusIndicator status={researcher.onlineStatus} />
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-3/4">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-blue-500">{researcher.field}</Badge>
              {researcher.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="outline" className="bg-blue-700 border-blue-400">
                  {specialty}
                </Badge>
              ))}
            </div>

            {/* Single Verification Badge */}
            <div className="mb-4">
              <VerificationBadge 
                type="overall" 
                status="verified" 
                size="md" 
                verifications={verifications}
              />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold">{researcher.name}</h1>
            <p className="text-blue-100 text-lg mb-2">{researcher.title} at {researcher.institution}</p>
            <p className="text-blue-100">{researcher.department}</p>
            
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center bg-blue-700 px-4 py-2 rounded-lg">
                <div className="mr-3">
                  <div className="text-xl font-bold">{researcher.hourlyRate} XAF</div>
                  <div className="text-xs text-blue-200">per hour</div>
                </div>
              </div>
              
              <div className="flex items-center bg-blue-700 px-4 py-2 rounded-lg">
                <div className="flex items-center">
                  {Array(5).fill(0).map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(researcher.rating) ? 'text-yellow-400' : 'text-blue-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <span className="ml-1 text-sm">{researcher.rating} ({researcher.reviews.length} reviews)</span>
              </div>
              
              <div className="flex gap-3">
                <BookingModal researcher={researcher} />
                <CoAuthorModal researcher={researcher} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
