
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const challenges = [
  "Generate a research idea",
  "Proposal writing", 
  "Literature review",
  "Conceptual and theoretical frameworks",
  "Methodology",
  "Report writing",
  "Live document review",
  "General research guidance",
  "Expert knowledge",
  "Interview a researcher",
  "Media visibility"
];

interface ChallengeSelectorProps {
  selectedChallenges: string[];
  onChallengeToggle: (challenge: string) => void;
}

const ChallengeSelector = ({ selectedChallenges, onChallengeToggle }: ChallengeSelectorProps) => {
  return (
    <div>
      <h3 className="mb-3 font-medium">What's your challenge? (Select all that apply)</h3>
      <div className="grid grid-cols-1 gap-3">
        {challenges.map((challenge) => (
          <div key={challenge} className="flex items-center space-x-3">
            <Checkbox
              id={challenge}
              checked={selectedChallenges.includes(challenge)}
              onCheckedChange={() => onChallengeToggle(challenge)}
              className="h-5 w-5"
            />
            <Label htmlFor={challenge} className="cursor-pointer text-sm">
              {challenge}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengeSelector;
