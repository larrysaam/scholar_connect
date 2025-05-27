
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import AIBioGenerator from "./AIBioGenerator";

interface ProfessionalBioSectionProps {
  bio: string;
  isEditing: boolean;
  profileData: any;
  onInputChange: (field: string, value: string) => void;
  onBioGenerated: (newBio: string) => void;
}

const ProfessionalBioSection = ({ 
  bio, 
  isEditing, 
  profileData, 
  onInputChange, 
  onBioGenerated 
}: ProfessionalBioSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Professional Bio</span>
          {isEditing && (
            <AIBioGenerator 
              currentBio={bio}
              profileData={profileData}
              onBioGenerated={onBioGenerated}
              userType="researcher"
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={bio}
          onChange={(e) => onInputChange("bio", e.target.value)}
          disabled={!isEditing}
          rows={4}
          placeholder="Your professional bio will be displayed here..."
        />
      </CardContent>
    </Card>
  );
};

export default ProfessionalBioSection;
