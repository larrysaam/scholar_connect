
import { Button } from "@/components/ui/button";

const ProfileTab = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <p className="text-gray-600">Edit your profile information and preferences.</p>
      
      <div className="mt-6">
        <Button>Edit Profile</Button>
      </div>
    </div>
  );
};

export default ProfileTab;
