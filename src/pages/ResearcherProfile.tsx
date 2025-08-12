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
  const { researcher, loading, error, addReview, refetch } = useResearcherProfile(id || '');

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

  // Transform data to match the existing ProfileHeader and ProfileTabs interface
  const transformedResearcher = {
    ...researcher,
    // Map database fields to component expected fields
    expertise: researcher.specialties || researcher.expertise || [],
    reviews: researcher.reviews.map(review => ({
      id: review.id,
      name: review.reviewer_name,
      rating: review.rating,
      date: new Date(review.created_at).toISOString().split('T')[0],
      comment: review.comment
    })),
    availableTimes: researcher.available_times || [],
    onlineStatus: researcher.online_status,
    // Ensure all required fields are present
    hourlyRate: researcher.hourly_rate,
    responseTime: researcher.response_time
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
