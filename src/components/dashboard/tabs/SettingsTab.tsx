
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const SettingsTab = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    console.log("Changing password...");
    // In a real app, this would call an API
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    alert("Password changed successfully");
  };

  const handleSaveSettings = () => {
    console.log("Saving settings...");
    // In a real app, this would save to backend
    alert("Settings saved successfully");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
      
      <div className="space-y-6">
        {/* Notification Settings */}
        <div>
          <h3 className="text-lg font-medium mb-3">Notification Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <Switch
                id="sms-notifications"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Privacy Settings */}
        <div>
          <h3 className="text-lg font-medium mb-3">Privacy Settings</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="profile-visible">Make my profile visible to others</Label>
            <Switch
              id="profile-visible"
              checked={profileVisible}
              onCheckedChange={setProfileVisible}
            />
          </div>
        </div>

        <Separator />

        {/* Password Change */}
        <div>
          <h3 className="text-lg font-medium mb-3">Change Password</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <Button 
              onClick={handlePasswordChange}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              Change Password
            </Button>
          </div>
        </div>

        <Separator />

        <Button onClick={handleSaveSettings} className="w-full md:w-auto">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsTab;
