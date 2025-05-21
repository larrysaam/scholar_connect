
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero-gradient text-white py-20 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <div className="flex items-center mb-6">
              <img 
                src="/lovable-uploads/0c2151ac-5e74-4b77-86a9-9b359241cfca.png" 
                alt="ScholarConnect Logo" 
                className="h-10 mr-2"
              />
              <h1 className="text-3xl font-bold">ScholarConnect</h1>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Connecting students with research experts
            </h2>
            <p className="text-lg mb-4 text-emerald-100">
              Book one-on-one consultations with research experts across various fields.
              Get personalized guidance for your research projects.
            </p>
            <p className="text-md mb-8 italic text-emerald-100">
              "Bridging the gap in research guidance to elevate research quality, mentorship, and academic excellence."
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50">
                <Link to="/researchers">Find Researchers</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-emerald-700">
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
