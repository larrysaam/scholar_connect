
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero-gradient text-white py-20 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Connect with Leading Researchers
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Book one-on-one consultations with academic experts across various fields.
            Get personalized guidance for your research projects.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to="/researchers">Find Researchers</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-blue-700">
              <Link to="/register">Join as a Researcher</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
