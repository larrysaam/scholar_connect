
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onBrowseAids: () => void;
  onPostTask: () => void;
}

const HeroSection = ({ onBrowseAids, onPostTask }: HeroSectionProps) => {
  return (
    <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Find Specialized Assistance For Your Research Projects, When You Need It Most
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4">
            On-demand academic support from trusted specialists — from statisticians to editors.
          </p>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-4xl mx-auto">
            Find and hire verified research professionals to help you with data analysis, GIS mapping, transcription, publishing, editing, and more — all in one platform built for serious students and researchers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-50 px-8 py-3 text-lg"
              onClick={onBrowseAids}
            >
              Browse Research Aids
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg"
              onClick={onPostTask}
            >
              Post a Task
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
