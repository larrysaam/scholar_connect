
import { Button } from "@/components/ui/button";

interface ProfileTabHeaderProps {
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => void;
}

const ProfileTabHeader = ({ isEditing, onEditToggle, onSave }: ProfileTabHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Profile Information</h2>
      <Button 
        onClick={isEditing ? onSave : onEditToggle}
        variant={isEditing ? "default" : "outline"}
      >
        {isEditing ? "Save Changes" : "Edit Profile"}
      </Button>
    </div>
  );
};

export default ProfileTabHeader;
