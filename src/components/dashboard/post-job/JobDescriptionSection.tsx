
import { Textarea } from "@/components/ui/textarea";

interface JobDescriptionSectionProps {
  description: string;
  onDescriptionChange: (value: string) => void;
}

const JobDescriptionSection = ({
  description,
  onDescriptionChange
}: JobDescriptionSectionProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Job Description *</label>
      <Textarea
        placeholder="Describe your job requirements in detail..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        rows={4}
      />
    </div>
  );
};

export default JobDescriptionSection;
