
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero-gradient text-white py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-1/2 z-10">
        <div className="relative h-full w-full">
          <img 
            src="/lovable-uploads/327ccde5-c0c9-443a-acd7-4570799bb7f8.png" 
            alt="Student consulting with researcher" 
            className="h-full w-full object-cover object-center"
            loading="eager"
            style={{
              filter: 'brightness(0.85) contrast(1.15) saturate(1.1)',
              objectPosition: '25% center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-blue-600/10 via-blue-600/30 to-blue-600/70"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Connecting students with research experts
            </h1>
            <p className="text-lg mb-8 text-blue-100 leading-relaxed">
              Book one-on-one consultations with research experts across various fields.
              Get personalized guidance for your research projects and accelerate your academic success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg transition-all duration-300 hover:shadow-xl">
                <Link to="/researchers">Find Researchers</Link>
              </Button>
              <Button asChild size="lg" className="bg-green-600 text-white hover:bg-green-700 shadow-lg transition-all duration-300 hover:shadow-xl border-2 border-green-500">
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
