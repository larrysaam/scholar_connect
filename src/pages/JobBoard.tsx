
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobBoard from "@/components/job-board/JobBoard";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const JobBoardPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in and is a research aid
    if (!user) {
      toast({
        title: "Access Denied",
        description: "Please log in to access the job board.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    // Check if user role is research aid
    if (profile && profile.role !== 'aid') {
      toast({
        title: "Access Restricted",
        description: "Job board is only accessible to Research Aids.",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }
  }, [user, profile, navigate, toast]);

  // Don't render if user is not authenticated or not a research aid
  if (!user || (profile && profile.role !== 'aid')) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <JobBoard />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobBoardPage;
