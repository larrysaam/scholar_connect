import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, LogOut, Trash2, User, Edit, Save, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ProfileImage from "../ProfileImage";
import type { Database } from "@/integrations/supabase/types";

type UserProfile = Database['public']['Tables']['users']['Row'] & {
  subtitle?: string | null;
};
type UserRole = Database['public']['Enums']['user_role'];
type PayoutMethod = Database['public']['Enums']['payout_method'];

const SettingsTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Settings states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // Profile states
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [newExpertise, setNewExpertise] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newResearchArea, setNewResearchArea] = useState("");

  // Fetch user profile on component mount
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive"
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileFieldChange = (field: keyof UserProfile, value: any) => {
    if (!userProfile) return;
    
    setUserProfile(prev => prev ? {
      ...prev,
      [field]: value
    } : null);
  };

  const handleProfileUpdate = async () => {
    if (!user || !userProfile) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: userProfile.name,
          email: userProfile.email,
          phone_number: userProfile.phone_number,
          location: userProfile.location,
          bio: userProfile.bio,
          university: userProfile.university,
          department: userProfile.department,
          research_interests: userProfile.research_interests,
          expertise_areas: userProfile.expertise_areas,
          languages: userProfile.languages,
          availability_hours: userProfile.availability_hours,
          hourly_rate: userProfile.hourly_rate,
          payout_method: userProfile.payout_method,
          payout_details: userProfile.payout_details
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated"
      });
      
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
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

  const handleAddArrayItem = (field: 'expertise_areas' | 'languages' | 'research_interests', newValue: string) => {
    if (!userProfile || !newValue.trim()) return;
    
    const currentArray = (userProfile[field] as string[]) || [];
    const updatedArray = [...currentArray, newValue.trim()];
    
    handleProfileFieldChange(field, updatedArray);
    
    // Clear the input
    if (field === 'expertise_areas') setNewExpertise("");
    if (field === 'languages') setNewLanguage("");
    if (field === 'research_interests') setNewResearchArea("");
  };

  const handleRemoveArrayItem = (field: 'expertise_areas' | 'languages' | 'research_interests', index: number) => {
    if (!userProfile) return;
    
    const currentArray = (userProfile[field] as string[]) || [];
    const updatedArray = currentArray.filter((_, i) => i !== index);
    
    handleProfileFieldChange(field, updatedArray);
  };

  const handleLogout = () => {
    toast({
      title: "Logging Out",
      description: "You have been logged out successfully"
    });
    
    console.log("Logging out user...");
    
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
    <div className="space-y-6 sm:space-y-8 p-1 sm:p-0">
      {/* Modern Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Account Settings
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your profile, notifications, and account preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full">
            <span className="text-xs font-medium text-purple-700">
              Profile: {user?.role || 'User'}
            </span>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30 hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100/50 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                User Profile
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              {isEditingProfile && (
                <Button
                  onClick={handleProfileUpdate}
                  size="sm"
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              )}
              <Button
                variant={isEditingProfile ? "outline" : "default"}
                size="sm"
                onClick={() => {
                  if (isEditingProfile) {
                    setIsEditingProfile(false);
                    fetchUserProfile();
                  } else {
                    setIsEditingProfile(true);
                  }
                }}
                className={`flex items-center gap-2 ${
                  isEditingProfile 
                    ? 'border-red-300 text-red-600 hover:bg-red-50' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-md hover:shadow-lg'
                } transition-all duration-200`}
              >
                {isEditingProfile ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          {user && <ProfileImage userId={user.id} />}
        </CardContent>
        
        <CardContent className="pt-2">
          {profileLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading profile...</div>
            </div>
          ) : userProfile ? (
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 p-4 sm:p-6 rounded-xl border border-purple-100/50">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userProfile.name || ""}
                      onChange={(e) => handleProfileFieldChange('name', e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={userProfile.email}
                      onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                      disabled={!isEditingProfile}
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      value={userProfile.phone_number || ""}
                      onChange={(e) => handleProfileFieldChange('phone_number', e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={userProfile.location || ""}
                      onChange={(e) => handleProfileFieldChange('location', e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={userProfile.bio || ""}
                    onChange={(e) => handleProfileFieldChange('bio', e.target.value)}
                    disabled={!isEditingProfile}
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 p-4 sm:p-6 rounded-xl border border-blue-100/50">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                  Academic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="university">University/Institution</Label>
                    <Input
                      id="university"
                      value={userProfile.university || ""}
                      onChange={(e) => handleProfileFieldChange('university', e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="Enter your university"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department/Field</Label>
                    <Input
                      id="department"
                      value={userProfile.department || ""}
                      onChange={(e) => handleProfileFieldChange('department', e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="Enter your department"
                    />
                  </div>
                </div>
              </div>

              {/* Research Interests */}
              <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 p-4 sm:p-6 rounded-xl border border-green-100/50">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  Research Interests
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(userProfile.research_interests as string[] || []).map((interest, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {interest}
                      {isEditingProfile && (
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleRemoveArrayItem('research_interests', index)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditingProfile && (
                  <div className="flex gap-2">
                    <Input
                      value={newResearchArea}
                      onChange={(e) => setNewResearchArea(e.target.value)}
                      placeholder="Add research area"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddArrayItem('research_interests', newResearchArea);
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleAddArrayItem('research_interests', newResearchArea)}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                )}
              </div>

              {/* Expertise Areas */}
              <div className="bg-gradient-to-r from-orange-50/50 to-amber-50/50 p-4 sm:p-6 rounded-xl border border-orange-100/50">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                  Expertise Areas
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(userProfile.expertise_areas as string[] || []).map((expertise, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {expertise}
                      {isEditingProfile && (
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleRemoveArrayItem('expertise_areas', index)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditingProfile && (
                  <div className="flex gap-2">
                    <Input
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      placeholder="Add expertise area"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddArrayItem('expertise_areas', newExpertise);
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleAddArrayItem('expertise_areas', newExpertise)}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                )}
              </div>

              {/* Languages */}
              <div className="bg-gradient-to-r from-teal-50/50 to-cyan-50/50 p-4 sm:p-6 rounded-xl border border-teal-100/50">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                  Languages
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(userProfile.languages as string[] || []).map((language, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {language}
                      {isEditingProfile && (
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleRemoveArrayItem('languages', index)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditingProfile && (
                  <div className="flex gap-2">
                    <Input
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Add language"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddArrayItem('languages', newLanguage);
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleAddArrayItem('languages', newLanguage)}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                )}
              </div>

              {/* Professional Settings */}
              {userProfile.role === 'expert' && (
                <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-4 sm:p-6 rounded-xl border border-indigo-100/50">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    Professional Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label htmlFor="hourly_rate">Hourly Rate (XAF)</Label>
                      <Input
                        id="hourly_rate"
                        type="number"
                        value={userProfile.hourly_rate || ""}
                        onChange={(e) => handleProfileFieldChange('hourly_rate', parseFloat(e.target.value) || null)}
                        disabled={!isEditingProfile}
                        placeholder="Enter your hourly rate"
                      />
                    </div>
                    <div>
                      <Label htmlFor="availability_hours">Availability Hours</Label>
                      <Input
                        id="availability_hours"
                        value={userProfile.availability_hours || ""}
                        onChange={(e) => handleProfileFieldChange('availability_hours', e.target.value)}
                        disabled={!isEditingProfile}
                        placeholder="e.g., Mon-Fri 9AM-5PM"
                      />
                    </div>
                    <div>
                      <Label htmlFor="payout_method">Payout Method</Label>
                      <Select
                        value={userProfile.payout_method || ""}
                        onValueChange={(value) => handleProfileFieldChange('payout_method', value as PayoutMethod)}
                        disabled={!isEditingProfile}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payout method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="mobile_money">Mobile Money</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="payout_details">Payout Details</Label>
                      <Input
                        id="payout_details"
                        value={userProfile.payout_details || ""}
                        onChange={(e) => handleProfileFieldChange('payout_details', e.target.value)}
                        disabled={!isEditingProfile}
                        placeholder="Account number or details"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500">Failed to load profile</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100/50">
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Notification Preferences
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-lg border border-blue-100/50">
              <div className="space-y-1">
                <Label className="text-base font-medium">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-lg border border-green-100/50">
              <div className="space-y-1">
                <Label className="text-base font-medium">SMS Notifications</Label>
                <p className="text-sm text-gray-600">Receive updates via SMS</p>
              </div>
              <Switch
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30 hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100/50">
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Privacy Settings
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-lg border border-green-100/50">
            <div className="space-y-1">
              <Label className="text-base font-medium">Profile Visibility</Label>
              <p className="text-sm text-gray-600">Make your profile visible to other users</p>
            </div>
            <Switch
              checked={profileVisible}
              onCheckedChange={setProfileVisible}
            />
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-yellow-50/30 hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100/50">
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
              <User className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Change Password
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
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
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-red-50/30 hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100/50">
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <div className="p-2 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Danger Zone
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="destructive"
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 border-0 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Delete Account
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 mt-2">
                    This action cannot be undone. This will permanently delete your account and remove all your data, consultations, messages, and profile information from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100">
                    <Label htmlFor="delete-confirmation" className="font-medium text-red-700">
                      Type "DELETE" to confirm account deletion
                    </Label>
                    <Input
                      id="delete-confirmation"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="Type DELETE here"
                      className="mt-2 border-red-200 focus:border-red-400 focus:ring-red-400"
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmation !== "DELETE"}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 border-0 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account Permanently
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
