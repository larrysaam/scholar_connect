import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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

  // Fetch user profile and subtitle from researcher_profiles
  const fetchUserProfile = async () => {
    if (!user) return;
    setProfileLoading(true);
    try {
      // Fetch user base profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      // Fetch researcher profile for subtitle
      const { data: researcherProfile, error: researcherError } = await supabase
        .from('researcher_profiles')
        .select('subtitle')
        .eq('user_id', user.id)
        .single();
      if (userError) {
        console.error('Error fetching user profile:', userError);
        toast({ title: 'Error', description: 'Failed to load user profile', variant: 'destructive' });
        return;
      }
      if (researcherError && researcherError.code !== 'PGRST116') {
        // PGRST116 = no rows found, ignore if not a researcher
        console.error('Error fetching researcher profile:', researcherError);
      }
      setUserProfile({ ...userData, subtitle: researcherProfile?.subtitle ?? '' });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  // Update both users and researcher_profiles tables
  const handleProfileUpdate = async () => {
    if (!user || !userProfile) return;
    try {
      // Update users table (without subtitle)
      const { subtitle, ...userFields } = userProfile;
      const { error: userError } = await supabase
        .from('users')
        .update({
          ...userFields,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      // Update researcher_profiles subtitle if present
      if ('subtitle' in userProfile) {
        await supabase
          .from('researcher_profiles')
          .update({ subtitle: userProfile.subtitle })
          .eq('user_id', user.id);
      }
      if (userError) {
        console.error('Error updating profile:', userError);
        toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
        return;
      }
      setIsEditingProfile(false);
      toast({ title: 'Profile Updated', description: 'Your profile has been updated successfully' });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred', variant: 'destructive' });
    }
  };

  const handleProfileFieldChange = (field: keyof UserProfile, value: any) => {
    if (!userProfile) return;
    setUserProfile({ ...userProfile, [field]: value });
  };

  const addArrayItem = (field: 'expertise' | 'languages' | 'research_areas', value: string) => {
    if (!userProfile || !value.trim()) return;
    
    const currentArray = userProfile[field] as string[] || [];
    if (!currentArray.includes(value.trim())) {
      handleProfileFieldChange(field, [...currentArray, value.trim()]);
    }
    
    // Clear the input
    if (field === 'expertise') setNewExpertise("");
    if (field === 'languages') setNewLanguage("");
    if (field === 'research_areas') setNewResearchArea("");
  };

  const removeArrayItem = (field: 'expertise' | 'languages' | 'research_areas', index: number) => {
    if (!userProfile) return;
    
    const currentArray = userProfile[field] as string[] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    handleProfileFieldChange(field, newArray);
  };

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
                    fetchUserProfile(); // Reset changes
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
        </CardHeader>        <CardContent className="pb-2">
          {user && <ProfileImage userId={user.id} />}
        </CardContent>        <CardContent className="pt-2">
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
                  <Label htmlFor="subtitle">Subtitle (e.g., Dr., Prof.)</Label>
                  <Select
                    value={userProfile.subtitle || ""}
                    onValueChange={(value) => handleProfileFieldChange('subtitle', value)}
                    disabled={!isEditingProfile}
                  >
                    <SelectTrigger id="subtitle">
                      <SelectValue placeholder="Select your title (Dr. or Prof.)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr.">Dr.</SelectItem>
                      <SelectItem value="Prof.">Prof.</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={userProfile.country || ""}
                    onChange={(e) => handleProfileFieldChange('country', e.target.value)}
                    disabled={!isEditingProfile}
                    placeholder="Enter your country"
                  />
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={userProfile.date_of_birth || ""}
                    onChange={(e) => handleProfileFieldChange('date_of_birth', e.target.value)}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div>
                  <Label htmlFor="sex">Gender</Label>
                  <Select
                    value={userProfile.sex || ""}
                    onValueChange={(value) => handleProfileFieldChange('sex', value)}
                    disabled={!isEditingProfile}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-4 sm:p-6 rounded-xl border border-blue-100/50">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  Academic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={userProfile.institution || ""}
                      onChange={(e) => handleProfileFieldChange('institution', e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="Enter your institution"
                    />
                  </div>
                  <div>
                    <Label htmlFor="faculty">Faculty/Department</Label>
                    <Input
                      id="faculty"
                      value={userProfile.faculty || ""}
                      onChange={(e) => handleProfileFieldChange('faculty', e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="Enter your faculty or department"
                    />
                  </div>
                  <div>
                    <Label htmlFor="study_level">Study Level</Label>
                    <Select
                      value={userProfile.study_level || ""}
                      onValueChange={(value) => handleProfileFieldChange('study_level', value)}
                      disabled={!isEditingProfile}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select study level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="masters">Masters</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="postdoc">Post-doctorate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={userProfile.role}
                      onValueChange={(value) => handleProfileFieldChange('role', value as UserRole)}
                      disabled={!isEditingProfile}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                        <SelectItem value="aid">Research Aid</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>                  </div>
                </div>
              </div>

              {/* Research Information */}
              <div className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 p-4 sm:p-6 rounded-xl border border-emerald-100/50">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                  Research Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="topic_title">Research Topic/Title</Label>
                    <Input
                      id="topic_title"
                      value={userProfile.topic_title || ""}
                      onChange={(e) => handleProfileFieldChange('topic_title', e.target.value)}
                      disabled={!isEditingProfile}
                      placeholder="Enter your research topic"
                    />
                  </div>
                  <div>
                    <Label htmlFor="research_stage">Research Stage</Label>
                    <Select
                      value={userProfile.research_stage || ""}
                      onValueChange={(value) => handleProfileFieldChange('research_stage', value)}
                      disabled={!isEditingProfile}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select research stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="data_collection">Data Collection</SelectItem>
                        <SelectItem value="analysis">Analysis</SelectItem>
                        <SelectItem value="writing">Writing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Research Areas */}
                <div>
                  <Label>Research Areas</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(userProfile.research_areas || []).map((area, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {area}
                        {isEditingProfile && (
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeArrayItem('research_areas', index)}
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
                            e.preventDefault();
                            addArrayItem('research_areas', newResearchArea);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addArrayItem('research_areas', newResearchArea)}
                        disabled={!newResearchArea.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gradient-to-r from-orange-50/50 to-red-50/50 p-4 sm:p-6 rounded-xl border border-orange-100/50">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  Professional Information
                </h4>
                <div className="space-y-4">
                
                {/* Experience */}
                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Textarea
                    id="experience"
                    value={userProfile.experience || ""}
                    onChange={(e) => handleProfileFieldChange('experience', e.target.value)}
                    disabled={!isEditingProfile}
                    placeholder="Describe your professional experience"
                    rows={3}
                  />
                </div>

                {/* Expertise */}
                <div>
                  <Label>Areas of Expertise</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(userProfile.expertise || []).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        {isEditingProfile && (
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeArrayItem('expertise', index)}
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
                            e.preventDefault();
                            addArrayItem('expertise', newExpertise);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addArrayItem('expertise', newExpertise)}
                        disabled={!newExpertise.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Other Expertise */}
                <div>
                  <Label htmlFor="other_expertise">Other Expertise</Label>
                  <Textarea
                    id="other_expertise"
                    value={userProfile.other_expertise || ""}
                    onChange={(e) => handleProfileFieldChange('other_expertise', e.target.value)}
                    disabled={!isEditingProfile}
                    placeholder="Describe any other areas of expertise"
                    rows={2}
                  />
                </div>

                {/* Languages */}
                <div>
                  <Label>Languages</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(userProfile.languages || []).map((language, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {language}
                        {isEditingProfile && (
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeArrayItem('languages', index)}
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
                            e.preventDefault();
                            addArrayItem('languages', newLanguage);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addArrayItem('languages', newLanguage)}
                        disabled={!newLanguage.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>                {/* LinkedIn URL */}
                <div>
                  <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                  <Input
                    id="linkedin_url"
                    value={userProfile.linkedin_url || ""}
                    onChange={(e) => handleProfileFieldChange('linkedin_url', e.target.value)}
                    disabled={!isEditingProfile}
                    placeholder="https://linkedin.com/in/yourprofile"
                    type="url"
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gradient-to-r from-teal-50/50 to-cyan-50/50 p-4 sm:p-6 rounded-xl border border-teal-100/50">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                  Payment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferred_payout_method">Preferred Payout Method</Label>
                    <Select
                      value={userProfile.preferred_payout_method || ""}
                      onValueChange={(value) => handleProfileFieldChange('preferred_payout_method', value as PayoutMethod)}
                      disabled={!isEditingProfile}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payout method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="wallet_balance">Wallet Balance</Label>
                    <Input
                      id="wallet_balance"
                      value={userProfile.wallet_balance?.toString() || "0"}
                      disabled={true}
                      placeholder="0.00"
                      type="number"
                    />
                    <p className="text-xs text-gray-500 mt-1">Wallet balance is read-only</p>                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditingProfile && (
                <div className="flex justify-end pt-4">
                  <Button onClick={handleProfileUpdate} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Profile Changes
                  </Button>
                </div>              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No profile data found. Please try refreshing the page.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50 backdrop-blur-sm">
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
              <span className="text-lg">🔔</span>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Notification Preferences
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
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
      </Card>      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/30 hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100/50 backdrop-blur-sm">
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <div className="p-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg">
              <span className="text-lg">🔒</span>
            </div>
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Privacy Settings
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50/50 to-green-50/50 rounded-lg border border-emerald-100/50">
            <div>
              <Label htmlFor="profile-visible" className="font-medium">Make my profile visible to others</Label>
              <p className="text-sm text-gray-600 mt-1">Allow students to find and contact you</p>
            </div>
            <Switch
              id="profile-visible"
              checked={profileVisible}
              onCheckedChange={setProfileVisible}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/30 hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100/50 backdrop-blur-sm">
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <div className="p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
              <span className="text-lg">🔑</span>
            </div>
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Change Password
            </span>
          </CardTitle>
        </CardHeader>        <CardContent className="space-y-6 p-6">
          <div className="space-y-4 p-4 bg-gradient-to-r from-orange-50/50 to-red-50/50 rounded-lg border border-orange-100/50">
            <div>
              <Label htmlFor="current-password" className="font-medium">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-password" className="font-medium">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="font-medium">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="mt-1"
              />
            </div>
          </div>
          <Button 
            onClick={handlePasswordChange}
            disabled={!currentPassword || !newPassword || !confirmPassword}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
          >
            Change Password
          </Button>
        </CardContent>
      </Card>      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleSaveSettings} 
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
        
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-red-50/30 hover:shadow-xl transition-all duration-300 border-l-4 border-l-red-500">
        <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100/50 backdrop-blur-sm">
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <div className="p-2 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Danger Zone
            </span>
          </CardTitle>
        </CardHeader>        <CardContent className="p-6">
          <div className="p-4 bg-gradient-to-r from-red-50/50 to-pink-50/50 rounded-lg border border-red-100/50 mb-6">
            <p className="text-sm text-gray-700 font-medium mb-2">
              ⚠️ Account Deletion Warning
            </p>
            <p className="text-sm text-gray-600">
              Once you delete your account, there is no going back. This will permanently remove all your data, consultations, and profile information from our servers.
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full sm:w-auto flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 border-0 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account Permanently
              </Button>
            </DialogTrigger>            <DialogContent className="border-0 shadow-2xl">
              <DialogHeader className="text-center pb-4">
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
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
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
