
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import GetStartedModal from "@/components/GetStartedModal";

const JoinSection = () => {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join ResearchWahoo Today
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with top researchers, get expert guidance, and accelerate your research journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">For Students</h3>
              <p className="text-gray-600 text-sm mb-4">Get expert help and guidance for your research projects</p>
              <Button asChild className="w-full">
                <Link to="/student-signup">Join as Student</Link>
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">For Researchers</h3>
              <p className="text-gray-600 text-sm mb-4">Share your expertise and earn additional income</p>
              <Button asChild className="w-full">
                <Link to="/researcher-signup">Join as Researcher</Link>
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">For Research Aids</h3>
              <p className="text-gray-600 text-sm mb-4">Provide professional research assistance</p>
              <Button asChild className="w-full">
                <Link to="/research-aid-signup">Join as Research Aid</Link>
              </Button>
            </div>
          </div>
          
          <div className="mb-8">
            <GetStartedModal>
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started
              </Button>
            </GetStartedModal>
          </div>
          
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;
