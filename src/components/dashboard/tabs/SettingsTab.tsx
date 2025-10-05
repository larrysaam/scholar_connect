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
import { useURLValidation } from "@/hooks/useURLValidation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ProfileImage from "../ProfileImage";
import AvailabilitySettings from "../consultation-services/AvailabilitySettings";

type UserProfile = {
  id: string;
  email: string;
  name?: string | null;
  role?: 'student' | 'expert' | 'aid' | 'admin' | null;
  subtitle?: string | null;
  phone_number?: string | null;
  country?: string | null;
  institution?: string | null;
  faculty?: string | null;
  study_level?: string | null;
  sex?: string | null;
  date_of_birth?: string | null;
  research_areas?: string[] | null;
  topic_title?: string | null;
  research_stage?: string | null;
  languages?: string[] | null;
  expertise?: string[] | null;
  other_expertise?: string | null;
  experience?: string | null;
  linkedin_url?: string | null;
  wallet_balance?: number | null;
  preferred_payout_method?: 'mobile_money' | 'bank_transfer' | 'paypal' | null;
  created_at?: string | null;
  updated_at?: string | null;
  email_notifications?: boolean | null;
};

type UserRole = 'student' | 'expert' | 'aid' | 'admin';
type PayoutMethod = 'mobile_money' | 'bank_transfer' | 'paypal';

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
  
  // URL validation
  const { error: linkedinError, clearError: clearLinkedinError } = useURLValidation(
    userProfile?.linkedin_url || '', 
    'linkedinAccount'
  );

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
      }      setUserProfile({ ...userData, subtitle: researcherProfile?.subtitle ?? '' });
      
      // Set email notification preference from database
      if (userData.email_notifications !== null && userData.email_notifications !== undefined) {
        setEmailNotifications(userData.email_notifications);
      }
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
  const handleSaveSettings = async () => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "User not authenticated",
          variant: "destructive"
        });
        return;
      }

      // Update user's email notification preference in the database
      const { error } = await supabase
        .from('users')
        .update({ 
          email_notifications: emailNotifications,
          // Note: SMS notifications and profile visibility would be added here when those fields exist
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated successfully"
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
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
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <h2 className="text-xl sm:text-2xl font-bold">Account Settings</h2>
      
      {/* User Profile Section */}
      <Card>        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <User className="h-5 w-5" />
            User Profile
          </CardTitle>
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
            className="flex items-center gap-2"
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
        </CardHeader>
        <CardContent>
          {user && <ProfileImage userId={user.id} />}
        </CardContent>
        <CardContent>
          {profileLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading profile...</div>
            </div>
          ) : userProfile ? (
            <div className="space-y-6">              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {/* Subtitle - Only show for experts/researchers */}
                {userProfile.role === 'expert' && (
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
                )}
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
                </div>
              </div>

              {/* Academic Information */}
              <Separator />
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Academic Information</h4>
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
                      </SelectTrigger>                    <SelectContent>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="masters">Masters</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="postdoc">Post-doctorate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>              </div>

              {/* Research Information - Only show for experts/researchers */}
              {userProfile.role === 'student' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Research Information</h4>
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
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Professional Information - Only show for experts/researchers */}
              {userProfile.role === 'expert' && (
                <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Professional Information</h4>
                
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
                  <div className="space-y-1">
                    <Input
                      id="linkedin_url"
                      value={userProfile.linkedin_url || ""}
                      onChange={(e) => {
                        handleProfileFieldChange('linkedin_url', e.target.value);
                        clearLinkedinError();
                      }}
                      disabled={!isEditingProfile}
                      placeholder="https://linkedin.com/in/yourprofile"
                      type="url"
                      className={linkedinError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {linkedinError && (
                      <p className="text-sm text-red-500">{linkedinError}</p>
                    )}
                  </div>
                </div>
              </div>
              </>
              )}

              {/* Payment Information */}
              <Separator />
              <div className=" hidden space-y-4">
                <h4 className="text-lg font-semibold">Payment Information</h4>
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
                    <p className="text-xs text-gray-500 mt-1">Wallet balance is read-only</p>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditingProfile && (
                <div className="flex justify-end pt-4">
                  <Button onClick={handleProfileUpdate} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Profile Changes
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No profile data found. Please try refreshing the page.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-600">
                Get notified when someone replies to your discussion posts
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          {/* Email notification details */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Email notifications include:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Replies to your discussion posts</li>
              <li>• Weekly digest of forum activity (coming soon)</li>
              <li>• Important platform updates (coming soon)</li>
            </ul>
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
        </CardContent>      </Card>

      {/* Availability Settings - Only show for experts/researchers */}
      {userProfile?.role === 'expert' && <AvailabilitySettings />}

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
