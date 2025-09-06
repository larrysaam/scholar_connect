import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Edit2, MapPin, Calendar, Award, BookOpen, Users, CheckCircle, Plus, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useResearcherProfile, ResearcherProfileData } from "@/hooks/useResearcherProfile";
import LoadingSpinner from "@/components/LoadingSpinner"; // Corrected import path
import { supabase } from '@/integrations/supabase/client';

const ResearchAidsProfileRatings = () => {
  const { user, loading: authLoading } = useAuth();
  const researcherId = user?.id;

  const {
    researcher,
    loading: profileLoading,
    error: profileError,
    updateProfile,
    refetch: refetchProfile
  } = useResearcherProfile(researcherId || "");

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editableProfileData, setEditableProfileData] = useState<ResearcherProfileData | null>(null);

  const { toast } = useToast();

  // Profile picture upload state
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);

  // Handle file select for profile image
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImageFile(file);
    if (file) {
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
      setProfileImagePreview(null);
    }
  };

  // Upload profile image to lovable-uploads bucket and update profile
  const handleUploadProfileImage = async () => {
    if (!profileImageFile || !user) return;
    setIsUploadingProfileImage(true);
    try {
      const fileExt = profileImageFile.name.split('.').pop();
      const filePath = `${user.id}_${Date.now()}.${fileExt}`;
      const uploadResult = await supabase.storage.from('lovable-uploads').upload(filePath, profileImageFile, { upsert: true });
      if (uploadResult.error) throw uploadResult.error;
      const publicUrlData = supabase.storage.from('lovable-uploads').getPublicUrl(filePath).data;
      const publicUrl = publicUrlData.publicUrl;
      // Save to users.avatar_url and also update profile imageUrl for UI
      const { error: userUpdateError } = await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', user.id);
      if (userUpdateError) throw userUpdateError;
      await updateProfile({ imageUrl: publicUrl });
      toast({ title: 'Profile Picture Updated', description: 'Your profile picture has been updated.' });
      setProfileImageFile(null);
      setProfileImagePreview(null);
      refetchProfile();
    } catch (err: any) {
      toast({ title: 'Upload Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsUploadingProfileImage(false);
    }
  };

  // Delete profile image
  const handleDeleteProfileImage = async () => {
    if (!user || !researcher.imageUrl) return;
    try {
      // Extract file name from URL
      const urlParts = researcher.imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      await import('@/integrations/supabase/client').then(({ supabase }) =>
        supabase.storage.from('lovable-uploads').remove([fileName])
      );
      await updateProfile({ imageUrl: '' });
      toast({ title: 'Profile Picture Removed', description: 'Your profile picture has been removed.' });
      refetchProfile();
    } catch (err: any) {
      toast({ title: 'Delete Failed', description: err.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (researcher) {
      setEditableProfileData({
        ...researcher,
      });
    }
  }, [researcher]);

  if (authLoading || profileLoading) {
    return <LoadingSpinner />;
  }

  if (profileError) {
    return <div className="text-red-500">Error: {profileError}</div>;
  }

  if (!researcher || !editableProfileData) {
    return <div className="text-gray-500">No researcher profile found.</div>;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleProfileUpdate = async () => {
    if (!editableProfileData) return;

    const updates: any = {
      title: editableProfileData.title,
      job_title: editableProfileData.job_title,
      bio: editableProfileData.bio,
      location: editableProfileData.location,
      years_experience: editableProfileData.years_experience,
      educational_background: editableProfileData.educational_background,
      work_experience: editableProfileData.work_experience,
      awards: editableProfileData.awards,
      publications: editableProfileData.publications,
      scholarships: editableProfileData.scholarships,
      affiliations: editableProfileData.affiliations,
      skills: editableProfileData.skills,
      hourly_rate: editableProfileData.hourly_rate, // Ensure hourly_rate is included
    };

    const success = await updateProfile(updates);
    if (success) {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated"
      });
      setIsEditProfileOpen(false);
      refetchProfile();
    } else {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddEducation = () => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      educational_background: [
        ...prev.educational_background,
        { degree: '', institution: '', year: '' }
      ]
    }) : null);
  };

  const handleUpdateEducation = (index: number, field: string, value: string) => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      educational_background: prev.educational_background.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }) : null);
  };

  const handleRemoveEducation = (index: number) => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      educational_background: prev.educational_background.filter((_, i) => i !== index)
    }) : null);
  };

  const handleAddWorkExperience = () => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      work_experience: [
        ...prev.work_experience,
        { position: '', institution: '', period: '' }
      ]
    }) : null);
  };

  const handleUpdateWorkExperience = (index: number, field: string, value: string) => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      work_experience: prev.work_experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }) : null);
  };

  const handleRemoveWorkExperience = (index: number) => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index)
    }) : null);
  };

  const handleAddAward = () => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      awards: [
        ...prev.awards,
        { title: '', year: '' }
      ]
    }) : null);
  };

  const handleUpdateAward = (index: number, field: string, value: string) => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      awards: prev.awards.map((award, i) =>
        i === index ? { ...award, [field]: value } : award
      )
    }) : null);
  };

  const handleRemoveAward = (index: number) => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }) : null);
  };

  const handleAddPublication = () => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      publications: [
        ...prev.publications,
        { title: '', journal: '', year: '', citations: 0 }
      ]
    }) : null);
  };

  const handleUpdatePublication = (index: number, field: string, value: string) => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      publications: prev.publications.map((pub, i) =>
        i === index ? { ...pub, [field]: value } : pub
      )
    }) : null);
  };

  const handleRemovePublication = (index: number) => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      publications: prev.publications.filter((_, i) => i !== index)
    }) : null);
  };

  const handleAddScholarship = () => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      scholarships: [
        ...prev.scholarships,
        { title: '', period: '' }
      ]
    }) : null);
  };

  const handleUpdateScholarship = (index: number, field: string, value: string) => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      scholarships: prev.scholarships.map((scholarship, i) =>
        i === index ? { ...scholarship, [field]: value } : scholarship
      )
    }) : null);
  };

  const handleRemoveScholarship = (index: number) => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      scholarships: prev.scholarships.filter((_, i) => i !== index)
    }) : null);
  };

  const handleAddAffiliation = () => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      affiliations: [...prev.affiliations, '']
    }) : null);
  };

  const handleUpdateAffiliation = (index: number, value: string) => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      affiliations: prev.affiliations.map((aff, i) =>
        i === index ? value : aff
      )
    }) : null);
  };

  const handleRemoveAffiliation = (index: number) => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      affiliations: prev.affiliations.filter((_, i) => i !== index)
    }) : null);
  };

  const handleAddSkill = () => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      skills: [...(prev.skills || []), '']
    }) : null);
  };

  const handleUpdateSkill = (index: number, value: string) => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? value : skill
      )
    }) : null);
  };

  const handleRemoveSkill = (index: number) => {
    setEditableProfileData(prev => prev ? ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }) : null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Profile & Ratings</h2>
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogTrigger asChild>
            <Button>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" aria-describedby="edit-profile-description">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div id="edit-profile-description" className="sr-only">Edit your profile information, including your profile picture, bio, and professional details.</div>
            <div className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileImagePreview || editableProfileData.imageUrl || '/placeholder-avatar.jpg'} alt="Profile" />
                  <AvatarFallback>{editableProfileData.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <input type="file" accept="image/*" onChange={handleProfileImageChange} />
                  {profileImageFile && (
                    <Button size="sm" onClick={handleUploadProfileImage} disabled={isUploadingProfileImage}>
                      {isUploadingProfileImage ? 'Uploading...' : 'Save Picture'}
                    </Button>
                  )}
                  {editableProfileData.imageUrl && (
                    <Button size="sm" variant="outline" onClick={handleDeleteProfileImage}>
                      Remove Picture
                    </Button>
                  )}
                </div>
              </div>
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Select
                      value={editableProfileData.title}
                      onValueChange={(value) => setEditableProfileData(prev => prev ? ({ ...prev, title: value }) : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Mrs.">Mrs.</SelectItem>
                        <SelectItem value="Ms.">Ms.</SelectItem>
                        <SelectItem value="Dr.">Dr.</SelectItem>
                        <SelectItem value="Prof.">Prof.</SelectItem>
                        <SelectItem value="Eng.">Eng.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editableProfileData.name}
                      onChange={(e) => setEditableProfileData(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="jobTitle">Professional Title</Label>
                  <Input
                    id="jobTitle"
                    value={editableProfileData.job_title}
                    onChange={(e) => setEditableProfileData(prev => prev ? ({ ...prev, job_title: e.target.value }) : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={editableProfileData.bio}
                    onChange={(e) => setEditableProfileData(prev => prev ? ({ ...prev, bio: e.target.value }) : null)}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editableProfileData.location}
                    onChange={(e) => setEditableProfileData(prev => prev ? ({ ...prev, location: e.target.value }) : null)}
                  />
                </div>
                {/* Hourly Rate */}
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate (XAF/hr)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min={0}
                    step={100}
                    value={editableProfileData.hourly_rate ?? ''}
                    onChange={e => setEditableProfileData(prev => prev ? ({ ...prev, hourly_rate: Number(e.target.value) }) : null)}
                    placeholder="Enter your hourly rate for appointments"
                  />
                </div>
              </div>

              {/* Educational Background */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Educational Background</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddEducation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>
                {(Array.isArray(editableProfileData.educational_background) ? editableProfileData.educational_background : []).map((edu, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                        placeholder="e.g., PhD in Computer Science"
                      />
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(index, 'institution', e.target.value)}
                        placeholder="University name"
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) => handleUpdateEducation(index, 'year', e.target.value)}
                        placeholder="2023"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveEducation(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Work Experience</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddWorkExperience}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
                {(Array.isArray(editableProfileData.work_experience) ? editableProfileData.work_experience : []).map((exp, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => handleUpdateWorkExperience(index, 'position', e.target.value)}
                        placeholder="Job title"
                      />
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={exp.institution}
                        onChange={(e) => handleUpdateWorkExperience(index, 'institution', e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <Label>Period</Label>
                      <Input
                        value={exp.period}
                        onChange={(e) => handleUpdateWorkExperience(index, 'period', e.target.value)}
                        placeholder="2020-2023"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveWorkExperience(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Awards and Recognitions */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Awards and Recognitions</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddAward}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Award
                  </Button>
                </div>
                {(Array.isArray(editableProfileData.awards) ? editableProfileData.awards : []).map((award, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Award Title</Label>
                      <Input
                        value={award.title}
                        onChange={(e) => handleUpdateAward(index, 'title', e.target.value)}
                        placeholder="Award name"
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={award.year}
                        onChange={(e) => handleUpdateAward(index, 'year', e.target.value)}
                        placeholder="2023"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveAward(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Publications */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Publications</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddPublication}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Publication
                  </Button>
                </div>
                {(Array.isArray(editableProfileData.publications) ? editableProfileData.publications : []).map((pub, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={pub.title}
                        onChange={(e) => handleUpdatePublication(index, 'title', e.target.value)}
                        placeholder="Publication title"
                      />
                    </div>
                    <div>
                      <Label>Journal</Label>
                      <Input
                        value={pub.journal}
                        onChange={(e) => handleUpdatePublication(index, 'journal', e.target.value)}
                        placeholder="Journal name"
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={pub.year}
                        onChange={(e) => handleUpdatePublication(index, 'year', e.target.value)}
                        placeholder="2023"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemovePublication(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scholarships and Fellowships */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Scholarships and Fellowships</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddScholarship}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Scholarship
                  </Button>
                </div>
                {(Array.isArray(editableProfileData.scholarships) ? editableProfileData.scholarships : []).map((scholarship, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={scholarship.title}
                        onChange={(e) => handleUpdateScholarship(index, 'title', e.target.value)}
                        placeholder="Scholarship/Fellowship title"
                      />
                    </div>
                    <div>
                      <Label>Period</Label>
                      <Input
                        value={scholarship.period}
                        onChange={(e) => handleUpdateScholarship(index, 'period', e.target.value)}
                        placeholder="2020-2023"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveScholarship(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Professional Affiliations */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Professional Affiliations</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddAffiliation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Affiliation
                  </Button>
                </div>
                {(Array.isArray(editableProfileData.affiliations) ? editableProfileData.affiliations : []).map((affiliation, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={affiliation}
                      onChange={(e) => handleUpdateAffiliation(index, e.target.value)}
                      placeholder="Professional organization"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveAffiliation(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddSkill}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
                {(Array.isArray(editableProfileData.skills) ? editableProfileData.skills : []).map((skill, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={skill}
                      onChange={(e) => handleUpdateSkill(index, e.target.value)}
                      placeholder="Skill"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveSkill(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleProfileUpdate} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditProfileOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={researcher.imageUrl || "/placeholder-avatar.jpg"} alt={`${researcher.title} ${researcher.name}`} />
              <AvatarFallback className="text-lg">
                {researcher.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-bold">{researcher.title} {researcher.name}</h3>
                <Badge className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              
              <p className="text-gray-600 font-medium mb-3">{researcher.job_title}</p>
              <p className="text-gray-700 mb-4">{researcher.bio}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{researcher.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{typeof researcher.total_consultations_completed === 'number' ? researcher.total_consultations_completed : 0} jobs completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span>{typeof researcher.hourly_rate === 'number' ? researcher.hourly_rate : 0} XAF/hr</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                {renderStars(Math.floor(researcher.rating))}
              </div>
              <p className="text-lg font-bold">{researcher.rating}/5.0</p>
              <p className="text-sm text-gray-600">{typeof researcher.total_consultations_completed === 'number' ? researcher.total_consultations_completed : 0} jobs completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Completed Jobs</p>
                <p className="text-2xl font-bold">{researcher.total_consultations_completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Hourly Rate</p>
                <p className="text-2xl font-bold">{researcher.hourly_rate} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Response Time</p>
                <p className="text-2xl font-bold">{researcher.response_time}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Educational Background */}
        <Card>
          <CardHeader>
            <CardTitle>Educational Background</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(Array.isArray(researcher.educational_background) ? researcher.educational_background : []).map((edu, index) => (
                <div key={index} className="border-l-2 border-blue-600 pl-4 py-2">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(Array.isArray(researcher.work_experience) ? researcher.work_experience : []).map((exp, index) => (
                <div key={index} className="border-l-2 border-green-600 pl-4 py-2">
                  <h4 className="font-medium">{exp.position}</h4>
                  <p className="text-sm text-gray-600">{exp.institution}</p>
                  <p className="text-xs text-gray-500">{exp.period}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Awards and Recognitions */}
        <Card>
          <CardHeader>
            <CardTitle>Awards and Recognitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(Array.isArray(researcher.awards) ? researcher.awards : []).map((award, index) => (
                <div key={index} className="border-l-2 border-yellow-500 pl-4 py-2">
                  <h4 className="font-medium">{award.title}</h4>
                  <p className="text-xs text-gray-500">{award.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Publications */}
        <Card>
          <CardHeader>
            <CardTitle>Publications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(Array.isArray(researcher.publications) ? researcher.publications : []).map((pub, index) => (
                <div key={index} className="border-l-2 border-purple-600 pl-4 py-2">
                  <h4 className="font-medium">{pub.title}</h4>
                  <p className="text-sm text-gray-600">{pub.journal}</p>
                  <p className="text-xs text-gray-500">{pub.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scholarships and Fellowships */}
        <Card>
          <CardHeader>
            <CardTitle>Scholarships and Fellowships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(Array.isArray(researcher.scholarships) ? researcher.scholarships : []).map((scholarship, index) => (
                <div key={index} className="border-l-2 border-indigo-600 pl-4 py-2">
                  <h4 className="font-medium">{scholarship.title}</h4>
                  <p className="text-xs text-gray-500">{scholarship.period}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Professional Affiliations */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Affiliations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(researcher.affiliations) ? researcher.affiliations : []).map((affiliation, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {affiliation}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Skills & Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(researcher.skills) ? researcher.skills : []).map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Client Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(Array.isArray(researcher.reviews) ? researcher.reviews : []).map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{review.reviewer_name}</p>
                    <p className="text-sm text-gray-600">{review.service_type || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAidsProfileRatings;