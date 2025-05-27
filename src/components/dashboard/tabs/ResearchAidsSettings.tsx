
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, CreditCard, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const { toast } = useToast();

  const paymentMethods = [
    {
      id: 1,
      type: "mobile_money",
      provider: "MTN Mobile Money",
      number: "**** **** 1234",
      isDefault: true
    },
    {
      id: 2,
      type: "bank_account",
      provider: "Afriland First Bank",
      number: "**** **** 5678",
      isDefault: false
    }
  ];

  const handlePasswordChange = () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
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

    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully"
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your account settings have been updated"
    });
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
      description: "Your account deletion request has been submitted. This process may take 24-48 hours.",
      variant: "destructive"
    });
    setDeleteConfirmation("");
  };

  const handleAddPaymentMethod = () => {
    toast({
      title: "Payment Method",
      description: "Add payment method functionality will be implemented"
    });
  };

  const handleRemovePaymentMethod = (methodId: number, provider: string) => {
    toast({
      title: "Payment Method Removed",
      description: `${provider} has been removed from your payment methods`
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-2xl font-bold">Account Settings</h2>
      
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" defaultValue="Neba" />
            </div>
            <div>
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" defaultValue="Emmanuel" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="neba.emmanuel@example.com" />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" defaultValue="+237 123 456 789" />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive updates about jobs, messages, and payments via email</p>
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
              <p className="text-sm text-gray-600">Receive urgent updates via SMS</p>
            </div>
            <Switch
              id="sms-notifications"
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-visible">Make my profile visible to clients</Label>
              <p className="text-sm text-gray-600">Allow potential clients to find and contact you</p>
            </div>
            <Switch
              id="profile-visible"
              checked={profileVisible}
              onCheckedChange={setProfileVisible}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Payment Methods</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Payment Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        <SelectItem value="bank_account">Bank Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="provider">Provider</Label>
                    <Input id="provider" placeholder="Enter provider name" />
                  </div>
                  <div>
                    <Label htmlFor="account">Account Number</Label>
                    <Input id="account" placeholder="Enter account number" />
                  </div>
                  <Button onClick={handleAddPaymentMethod} className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{method.provider}</p>
                    <p className="text-sm text-gray-600">{method.number}</p>
                    {method.isDefault && (
                      <span className="text-xs text-blue-600">Default</span>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemovePaymentMethod(method.id, method.provider)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
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
          <Button onClick={handlePasswordChange}>
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-red-600">Delete Account</h4>
              <p className="text-sm text-gray-600 mb-3">
                Once you delete your account, there is no going back. This action cannot be undone.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete My Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-red-600">Delete Account</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-800">
                        <strong>Warning:</strong> This action is irreversible. All your data, including:
                      </p>
                      <ul className="list-disc list-inside text-sm text-red-800 mt-2">
                        <li>Profile information</li>
                        <li>Project history</li>
                        <li>Messages and communications</li>
                        <li>Earnings history</li>
                      </ul>
                      <p className="text-sm text-red-800 mt-2">will be permanently deleted.</p>
                    </div>
                    <div>
                      <Label htmlFor="delete-confirmation">
                        Type "DELETE" to confirm account deletion
                      </Label>
                      <Input
                        id="delete-confirmation"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="Type DELETE to confirm"
                      />
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="w-full"
                      disabled={deleteConfirmation !== "DELETE"}
                    >
                      I understand, delete my account permanently
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} size="lg">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ResearchAidsSettings;
