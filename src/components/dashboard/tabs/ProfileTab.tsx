import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProfileTabHeader from "@/components/dashboard/profile/ProfileTabHeader";
import PersonalInformationSection from "@/components/dashboard/profile/PersonalInformationSection";
import ProfessionalBioSection from "@/components/dashboard/profile/ProfessionalBioSection";
import EducationalBackgroundSection from "@/components/dashboard/profile/EducationalBackgroundSection";
import WorkExperienceSection from "@/components/dashboard/profile/WorkExperienceSection";
import AwardsRecognitionsSection from "@/components/dashboard/profile/AwardsRecognitionsSection";
import PublicationsSectionProfile from "@/components/dashboard/profile/PublicationsSectionProfile";
import ScholarshipsFellowshipsSection from "@/components/dashboard/profile/ScholarshipsFellowshipsSection";
import ProfessionalAffiliationsSection from "@/components/dashboard/profile/ProfessionalAffiliationsSection";
import LanguagesSection from "@/components/dashboard/profile/LanguagesSection";
import StudentSupervisionSummary from "@/components/dashboard/profile/StudentSupervisionSummary";
import StudentSupervisionDetails from "@/components/dashboard/profile/StudentSupervisionDetails";
import AccountStatisticsSection from "@/components/dashboard/profile/AccountStatisticsSection";
import { ProfileFormData, defaultProfileFormData } from "@/components/dashboard/profile/ProfileFormData";
import { createProfileFormHandlers } from "@/components/dashboard/profile/ProfileFormHandlers";

const ProfileTab = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(defaultProfileFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handlers = createProfileFormHandlers(formData, setFormData);

  // Fetch real profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const user = supabase.auth.user?.();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) setFormData({ ...defaultProfileFormData, ...data });
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required fields",
        variant: "destructive"
      });
      return;
    }
    if (formData.email && !formData.email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    setSaving(true);
    const user = supabase.auth.user?.();
    if (!user) {
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from('profiles')
      .upsert({ ...formData, user_id: user.id });
    setSaving(false);
    if (!error) {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully"
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to save profile information",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <ProfileTabHeader
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(true)}
        onSave={handleSaveProfile}
        saving={saving}
      />

      <PersonalInformationSection
        formData={formData}
        isEditing={isEditing}
        onInputChange={handlers.handleInputChange}
      />

      <ProfessionalBioSection
        bio={formData.bio}
        isEditing={isEditing}
        profileData={formData}
        onInputChange={handlers.handleInputChange}
        onBioGenerated={handlers.handleBioGenerated}
      />

      <EducationalBackgroundSection
        education={formData.educationalBackground}
        isEditing={isEditing}
        onAdd={handlers.handleAddEducation}
        onUpdate={handlers.handleUpdateEducation}
        onRemove={handlers.handleRemoveEducation}
      />

      <WorkExperienceSection
        workExperience={formData.workExperience}
        isEditing={isEditing}
        onAdd={handlers.handleAddWorkExperience}
        onUpdate={handlers.handleUpdateWorkExperience}
        onRemove={handlers.handleRemoveWorkExperience}
      />

      <AwardsRecognitionsSection
        awards={formData.awards}
        isEditing={isEditing}
        onAdd={handlers.handleAddAward}
        onUpdate={handlers.handleUpdateAward}
        onRemove={handlers.handleRemoveAward}
      />

      <PublicationsSectionProfile
        publications={formData.publications}
        isEditing={isEditing}
        onAdd={handlers.handleAddPublication}
        onUpdate={handlers.handleUpdatePublication}
        onRemove={handlers.handleRemovePublication}
      />

      <ScholarshipsFellowshipsSection
        scholarships={formData.scholarships}
        isEditing={isEditing}
        onAdd={handlers.handleAddScholarship}
        onUpdate={handlers.handleUpdateScholarship}
        onRemove={handlers.handleRemoveScholarship}
      />

      <ProfessionalAffiliationsSection
        affiliations={formData.affiliations}
        isEditing={isEditing}
        onAdd={handlers.handleAddAffiliation}
        onUpdate={handlers.handleUpdateAffiliation}
        onRemove={handlers.handleRemoveAffiliation}
      />

      <LanguagesSection
        languages={formData.languages}
        isEditing={isEditing}
        onAdd={handlers.handleAddLanguage}
        onUpdate={handlers.handleUpdateLanguage}
        onRemove={handlers.handleRemoveLanguage}
      />

      <StudentSupervisionSummary
        supervision={formData.supervision}
        isEditing={isEditing}
        onAdd={handlers.handleAddSupervision}
        onUpdate={handlers.handleUpdateSupervision}
        onRemove={handlers.handleRemoveSupervision}
      />

      <StudentSupervisionDetails
        supervisionDetails={formData.supervisionDetails}
        isEditing={isEditing}
        onAdd={handlers.handleAddSupervisionDetail}
        onUpdate={handlers.handleUpdateSupervisionDetail}
        onRemove={handlers.handleRemoveSupervisionDetail}
      />

      <AccountStatisticsSection />
    </div>
  );
};

export default ProfileTab;
