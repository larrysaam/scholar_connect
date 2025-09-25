import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Users, Calendar, CheckCircle } from "lucide-react"; // Added CheckCircle
import { useState } from "react";
import { Button } from '@/components/ui/button';
import StatusIndicator from "./StatusIndicator";
import ComprehensiveBookingModal from "./booking/ComprehensiveBookingModal";
import MessageModal from "./MessageModal";
import CoAuthorInvitationModal from "./CoAuthorInvitationModal";
import { ResearcherProfileData } from "@/hooks/useResearcherProfile";

interface ProfileHeaderProps {
  researcher: ResearcherProfileData;
}

const ProfileHeader = ({ researcher }: ProfileHeaderProps) => {
  // Helper functions for verification status (copied from VerificationTab.tsx)
  const hasVerifiedDocuments = (documents?: { status: 'pending' | 'verified' | 'rejected'; }[]) => {
    return documents?.some(doc => doc.status === 'verified') || false;
  };

  const getDisplayStatus = (
    topLevelStatus: 'pending' | 'verified' | 'rejected',
    documents?: { status: 'pending' | 'verified' | 'rejected'; }[]
  ) => {
    if (topLevelStatus === 'verified' || hasVerifiedDocuments(documents)) {
      return 'verified';
    }
    if (topLevelStatus === 'pending' || documents?.some(doc => doc.status === 'pending')) {
      return 'pending';
    }
    return 'unverified';
  };

  const isOverallVerified = () => {
    const academicStatus = getDisplayStatus(researcher.verifications.academic, researcher.verifications.education?.documents);
    const publicationStatus = getDisplayStatus(researcher.verifications.publication, researcher.verifications.publications?.documents);
    const institutionalStatus = getDisplayStatus(researcher.verifications.institutional, researcher.verifications.employment?.documents);

    console.log("Verification statuses:", { academicStatus, publicationStatus, institutionalStatus })
    return academicStatus === "verified" && publicationStatus === "verified" && institutionalStatus === "verified";
  };

  const showVerifiedBadge = isOverallVerified();
  const [manualProjectId, setManualProjectId] = useState("");

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image and Status */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={researcher.imageUrl}
                alt={researcher.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              {showVerifiedBadge && (
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-white shadow-md">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              )}
              {/* <StatusIndicator 
                isOnline={researcher.isOnline} 
                className="absolute -bottom-2 -right-2"
              /> */}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-grow space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{researcher.name}</h1>
              <p className="text-lg text-gray-600">{researcher.title}</p>
              {/* Use affiliations if available, fallback to empty string */}
              <p className="text-gray-600">{Array.isArray(researcher.affiliations) ? researcher.affiliations.join(', ') : ''}</p>
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{researcher.location}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="font-medium">{researcher.rating}</span>
                {/* Remove totalReviews if not present */}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-blue-500 mr-1" />
                <span>{researcher.studentsSupervised} students supervised</span>
              </div>
              {/* Remove yearsExperience if not present */}
            </div>

            {/* Expertise Tags */}
            <div className="flex flex-wrap gap-2">
              {(researcher.skills || []).slice(0, 5).map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
              {(researcher.skills && researcher.skills.length > 5) && (
                <Badge variant="outline">+{researcher.skills.length - 5} more</Badge>
              )}
            </div>

            {/* Languages */}
            <div>
              <span className="text-sm font-medium text-gray-700">Languages: </span>
              <span className="text-sm text-gray-600">
                {researcher.languages.join(", ")}
              </span>
            </div>

            {/* Hourly Rate */}
            <div className="text-lg font-bold text-green-600">
              {(typeof researcher.hourly_rate === 'number' ? researcher.hourly_rate : 0).toLocaleString()} XAF/hour
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 md:w-64">
            <ComprehensiveBookingModal researcher={{
              ...researcher,
              institution: Array.isArray(researcher.affiliations) && researcher.affiliations.length > 0 ? researcher.affiliations[0] : '',
              hourlyRate: typeof researcher.hourly_rate === 'number' ? researcher.hourly_rate : 0,
              title: researcher.title || '',
              imageUrl: researcher.imageUrl || '',
            }} />
            
            <MessageModal researcher={researcher} />

            {/* Co-author invitation: always show modal, let modal handle project creation/selection */}
            <CoAuthorInvitationModal researcher={researcher} />
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-gray-700 leading-relaxed">{researcher.bio}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
