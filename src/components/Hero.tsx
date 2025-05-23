
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero-gradient text-white py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 md:opacity-40">
        <img 
          src="/lovable-uploads/327ccde5-c0c9-443a-acd7-4570799bb7f8.png" 
          alt="Student consulting with researcher" 
          className="h-full w-full object-cover object-left"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-600"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Connecting students with research experts
            </h2>
            <p className="text-lg mb-8 text-blue-100">
              Book one-on-one consultations with research experts across various fields.
              Get personalized guidance for your research projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-blue-500 text-white hover:bg-blue-600">
                <Link to="/researchers">Find Researchers</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                <Link to="/register">Join as a Researcher</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
