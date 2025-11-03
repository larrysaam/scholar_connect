import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, CreditCard, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAidSettings } from "@/hooks/useAidSettings";
import { supabase } from "@/integrations/supabase/client";

const ResearchAidsSettings = () => {
  const {
    settings,
    loading,
    error,
    updateSettings,
    changePassword,
    fetchPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
  } = useAidSettings();

  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  // Load payment methods from DB
  useEffect(() => {
    fetchPaymentMethods().then(setPaymentMethods);
  }, [fetchPaymentMethods]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletionReason, setDeletionReason] = useState("");
  const [finalConfirmation, setFinalConfirmation] = useState(false);
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [showFinalDialog, setShowFinalDialog] = useState(false);
  const { toast } = useToast();

  const [provider, setProvider] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const deletionReasons = [
    "Found better opportunities elsewhere",
    "Not enough job opportunities",
    "Payment issues",
    "Technical difficulties with platform",
    "Poor client communication",
    "Time constraints",
    "Privacy concerns",
    "Other"
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

    changePassword(currentPassword, newPassword).then(() => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully"
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }).catch((err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    });
  };

  const handleSaveSettings = () => {
    updateSettings(settings).then(() => {
      toast({
        title: "Settings Saved",
        description: "Your account settings have been updated"
      });
    }).catch((err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    });
  };

  const handleReasonSubmit = () => {
    if (!deletionReason) {
      toast({
        title: "Error",
        description: "Please select a reason for account deletion",
        variant: "destructive"
      });
      return;
    }

    setShowReasonDialog(false);
    setShowFinalDialog(true);
  };

  const handleFinalDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE" || !finalConfirmation) {
      toast({
        title: "Error",
        description: "Please type 'DELETE' and confirm your decision",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast({
          title: "Error",
          description: "You must be logged in to delete your account",
          variant: "destructive"
        });
        return;
      }

      const response = await supabase.functions.invoke('delete-account', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted. You will be redirected shortly.",
        variant: "destructive"
      });

      // Clear local storage and redirect after a delay
      setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
      }, 3000);

    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleteConfirmation("");
      setDeletionReason("");
      setFinalConfirmation(false);
      setShowFinalDialog(false);
    }
  };

  const handleAddPaymentMethod = (method: any) => {
    // Compose the correct structure for payment_methods table
    const paymentMethodPayload = {
      type: method.type, // 'mobile_money' or 'bank_account'
      name: method.type === 'mobile_money' ? `${method.provider} Mobile Money` : 'Bank Account',
      details: { provider: method.provider, number: method.number },
      user_id: settings?.id, // or user.id if available
    };
    addPaymentMethod(paymentMethodPayload).then(fetchPaymentMethods).then(setPaymentMethods);
    toast({
      title: "Payment Method",
      description: "Payment method added successfully"
    });
  };

  const handleRemovePaymentMethod = (methodId: number, providerName: string) => {
    removePaymentMethod(methodId).then(fetchPaymentMethods).then(setPaymentMethods);
    toast({
      title: "Payment Method Removed",
      description: `${providerName} has been removed from your payment methods`
    });
  };

  if (loading) {
    return <div className="text-center py-10">Loading settings...</div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-2xl font-bold">Account Settings</h2>
      
      

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
              checked={settings.emailNotifications}
              onCheckedChange={(value) => updateSettings({ ...settings, emailNotifications: value })}
            />
          </div>
          
        </CardContent>
      </Card>

      {/* <Card>
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
              checked={settings.profileVisible}
              onCheckedChange={(value) => updateSettings({ ...settings, profileVisible: value })}
            />
          </div>
        </CardContent>
      </Card> */}

      

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

      {/* Danger Zone with Enhanced Delete Process */}
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
              
              <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete My Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-red-600">Why are you leaving?</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Help us understand why you want to delete your account. Your feedback will help us improve ResearchTandem.
                    </p>
                    
                    <div>
                      <Label>Reason for leaving</Label>
                      <Select value={deletionReason} onValueChange={setDeletionReason}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {deletionReasons.map((reason) => (
                            <SelectItem key={reason} value={reason}>
                              {reason}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Additional feedback (optional)</Label>
                      <Textarea
                        placeholder="Tell us more about your experience or how we could improve..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button onClick={handleReasonSubmit} variant="destructive" className="flex-1">
                        Continue with Deletion
                      </Button>
                      <Button variant="outline" onClick={() => setShowReasonDialog(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showFinalDialog} onOpenChange={setShowFinalDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-red-600">Final Confirmation</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-800">
                        <strong>Warning:</strong> This action is irreversible. All your data will be permanently deleted:
                      </p>
                      <ul className="list-disc list-inside text-sm text-red-800 mt-2">
                        <li>Profile information and work history</li>
                        <li>All project communications</li>
                        <li>Earnings and payment history</li>
                        <li>Ratings and reviews</li>
                        <li>Portfolio and uploaded documents</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="delete-confirmation">
                          Type "DELETE" to confirm (case sensitive)
                        </Label>
                        <Input
                          id="delete-confirmation"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Type DELETE to confirm"
                          className={deleteConfirmation === "DELETE" ? "border-red-500 bg-red-50" : ""}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="final-confirmation"
                          checked={finalConfirmation}
                          onChange={(e) => setFinalConfirmation(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="final-confirmation" className="text-sm">
                          I understand that this action cannot be undone and all my data will be permanently deleted
                        </Label>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="destructive" 
                        onClick={handleFinalDeleteAccount}
                        className="flex-1"
                        disabled={deleteConfirmation !== "DELETE" || !finalConfirmation}
                      >
                        Permanently Delete Account
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowFinalDialog(false);
                          setDeleteConfirmation("");
                          setFinalConfirmation(false);
                        }} 
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
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
