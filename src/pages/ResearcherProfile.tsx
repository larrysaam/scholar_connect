import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileHeader from "@/components/researcher/ProfileHeader";
import ProfileTabs from "@/components/researcher/ProfileTabs";
import { useResearcherProfile } from "@/hooks/useResearcherProfile";

const ResearcherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { researcher, loading, error, refetch } = useResearcherProfile(id || '');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Profile</h3>
              <p className="text-gray-600">Please wait while we fetch the researcher's information...</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !researcher) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md border-red-200">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
              <p className="text-gray-600 mb-6">
                {error || "The researcher profile you're looking for doesn't exist or is not available."}
              </p>
              <div className="space-y-2">
                <Button onClick={() => navigate('/dashboard')} className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <Button variant="outline" onClick={refetch} className="w-full">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  
  const safeArray = (val, fallback = []) => Array.isArray(val) ? val : fallback;
  const safeExperience = safeArray(researcher.experience).map(e =>
    typeof e === 'object' && e !== null && 'position' in e && 'institution' in e && 'period' in e
      ? e
      : { position: '', institution: '', period: '' }
  );
  const safeEducation = safeArray(researcher.education).map(e =>
    typeof e === 'object' && e !== null && 'degree' in e && 'institution' in e && 'year' in e
      ? e
      : { degree: '', institution: '', year: '' }
  );
  const transformedResearcher = {
    ...researcher,
    expertise: researcher.specialties || researcher.expertise || [],
    specialties: researcher.specialties || researcher.expertise || [],
    reviews: (researcher.reviews || []).map(review => ({
      id: review.id,
      reviewer_name: review.reviewer_name,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      service_type: review.service_type,
      collaboration_type: review.collaboration_type
    })),
    // Only include properties that exist on ResearcherProfileData
    // availableTimes: researcher.available_times || [],
    // onlineStatus: researcher.online_status,
    // responseTime: researcher.response_time,
    id: researcher.id,
    // Always prepend subtitle if present and non-empty
    name: (researcher.subtitle ? researcher.subtitle + ' ' : '') + researcher.name,
    title: (typeof researcher.subtitle === 'string' && researcher.subtitle) ? researcher.subtitle : (typeof researcher.title === 'string' ? researcher.title : ''),
    // affiliation: researcher.affiliation || '',
    location: researcher.location || '',
    rating: researcher.rating || 0,
    // totalReviews: researcher.totalReviews || 0,
    studentsSupervised: researcher.studentsSupervised,
    // yearsExperience: researcher.yearsExperience || 0,
    bio: researcher.bio || '',
    education: safeEducation,
    experience: safeExperience,
    awards: safeArray(researcher.awards),
    // fellowships: safeArray(researcher.fellowships),
    // grants: safeArray(researcher.grants),
    // memberships: safeArray(researcher.memberships),
    // supervision: safeArray(researcher.supervision),
    publications: safeArray(researcher.publications),
    verifications: researcher.verifications,
    imageUrl: researcher.imageUrl || '',
    // isOnline: researcher.isOnline || false,
    languages: researcher.languages || [],
    // field: researcher.field || '',
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        <ProfileHeader researcher={transformedResearcher} />
        
        <div className="container mx-auto px-4 py-8">
          <ProfileTabs researcher={transformedResearcher} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearcherProfile;
