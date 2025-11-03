
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera } from "lucide-react";

interface ProfileImageProps {
  name: string;
  title: string;
  isEditing: boolean;
  onImageUpload: () => void;
}

const ProfileImage = ({ name, title, isEditing, onImageUpload }: ProfileImageProps) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="relative inline-block">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200">
            <img 
              src="/lovable-uploads/83e0a07d-3527-4693-8172-d7d181156044.png" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          {isEditing && (
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full p-2"
              onClick={onImageUpload}
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>
        <h3 className="mt-4 font-semibold">{name}</h3>
        <p className="text-gray-600">{title}</p>
      </CardContent>
    </Card>
  );
};

export default ProfileImage;
