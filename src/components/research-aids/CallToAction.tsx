
import { Button } from "@/components/ui/button";

interface CallToActionProps {
  onBrowseAids: () => void;
  onBecomeResearchAid: () => void;
}

const CallToAction = ({ onBrowseAids, onBecomeResearchAid }: CallToActionProps) => {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Expert Help?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of researchers who trust ScholarConnect for their academic support needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-50 px-8 py-3"
              onClick={onBrowseAids}
            >
              Browse Research Aids
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-3"
              onClick={onBecomeResearchAid}
            >
              Become a Research Aid
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
