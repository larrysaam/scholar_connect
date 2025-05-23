
import { Badge } from "@/components/ui/badge";

interface AboutTabProps {
  bio: string;
  specialties: string[];
}

const AboutTab = ({ bio, specialties }: AboutTabProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Biography</h2>
      <p className="text-gray-700 mb-6">{bio}</p>
      
      <h3 className="text-lg font-semibold mb-3">Areas of Expertise</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {specialties.map((specialty, index) => (
          <Badge key={index} variant="secondary" className="text-sm">
            {specialty}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default AboutTab;
