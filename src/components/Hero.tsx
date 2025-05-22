
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero-gradient text-white py-20 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
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
              <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700 border-2 border-white">
                <Link to="/register">Join as a Researcher</Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 md:mt-0 flex justify-center md:justify-end">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/lovable-uploads/327ccde5-c0c9-443a-acd7-4570799bb7f8.png" 
                alt="Student consulting with researcher" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
