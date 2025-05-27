
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, LogOut, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsTab = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handlePasswordChange = () => {
    // Validation
    if (!currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password",
        variant: "destructive"
      });
      return;
    }

    if (!newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would call an API to change the password
    console.log("Changing password...");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully"
    });
  };

  const handleSaveSettings = () => {
    const settings = {
      emailNotifications,
      smsNotifications,
      profileVisible
    };
    
    console.log("Saving settings:", settings);
    
    toast({
      title: "Settings Saved",
      description: "Your account settings have been updated successfully"
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logging Out",
      description: "You have been logged out successfully"
    });
    
    // In a real app, this would clear the session and redirect to login
    console.log("Logging out user...");
    
    // Simulate logout by redirecting to home page
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Error",
        description: "Please type 'DELETE' to confirm account deletion",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Account Deletion Requested",
      description: "Your account deletion request has been submitted. You will receive a confirmation email.",
      variant: "destructive"
    });
    
    console.log("Account deletion requested");
    setDeleteConfirmation("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Account Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-gray-600">Receive notifications via SMS</p>
            </div>
            <Switch
              id="sms-notifications"
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-visible">Make my profile visible to others</Label>
              <p className="text-sm text-gray-600">Allow students to find and contact you</p>
            </div>
            <Switch
              id="profile-visible"
              checked={profileVisible}
              onCheckedChange={setProfileVisible}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              placeholder="Enter new password (min 8 characters)"
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
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSaveSettings} className="flex-1">
          Save Settings
        </Button>
        
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Separator />

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-700">Delete Account</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="delete-confirmation">
                    Type "DELETE" to confirm account deletion
                  </Label>
                  <Input
                    id="delete-confirmation"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Type DELETE here"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== "DELETE"}
                >
                  Delete Account Permanently
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
