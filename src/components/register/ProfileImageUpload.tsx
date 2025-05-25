
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface ProfileImageUploadProps {
  profileImage: string;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileImageUpload = ({ profileImage, onImageUpload }: ProfileImageUploadProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="profilePicture">Profile Picture *</Label>
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profileImage} />
          <AvatarFallback>
            <Camera className="h-8 w-8 text-gray-400" />
          </AvatarFallback>
        </Avatar>
        <div>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
            required
          />
          <Label htmlFor="profilePicture" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Upload Photo
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
