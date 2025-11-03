
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const StudentThankYouMessage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold mb-4">Welcome to ResearchTandem!</h1>
            <p className="text-gray-600 mb-6">
              Your student account has been created successfully. You can now access your personalized dashboard 
              to browse expert support, track progress, and request consultations or mentorship.
            </p>
            <Button asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default StudentThankYouMessage;
