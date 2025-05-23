
import { Button } from "@/components/ui/button";

const SettingsTab = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <p className="text-gray-600">Manage your account settings and preferences.</p>
      
      <div className="mt-6">
        <Button>Account Settings</Button>
      </div>
    </div>
  );
};

export default SettingsTab;
