
import { Card, CardContent } from "@/components/ui/card";

interface OnboardingCardProps {
  onComplete: () => void;
}

const OnboardingCard = ({ onComplete }: OnboardingCardProps) => {
  return (
    <div className="mb-8">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Welcome to ResearchTandem!</h3>
          <p className="text-gray-600 mb-4">Complete your profile to start receiving research assistance requests.</p>
          <button 
            onClick={onComplete}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Get Started
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingCard;
