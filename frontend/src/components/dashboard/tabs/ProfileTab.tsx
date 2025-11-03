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
import StudentSupervisionSummary from "@/components/dashboard/profile/StudentSupervisionSummary";
import StudentSupervisionDetails from "@/components/dashboard/profile/StudentSupervisionDetails";
import AccountStatisticsSection from "@/components/dashboard/profile/AccountStatisticsSection";
import { ProfileFormData, defaultProfileFormData } from "@/components/dashboard/profile/ProfileFormData";
import { createProfileFormHandlers } from "@/components/dashboard/profile/ProfileFormHandlers";
import { useUserStatistics } from "@/hooks/useUserStatistics";

const ProfileTab = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(defaultProfileFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handlers = createProfileFormHandlers(formData, setFormData);
  const userStatistics = useUserStatistics();

  // Fetch real profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('researcher_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) {
        // Transform the data to match ProfileFormData structure
        const transformedData = {
          ...defaultProfileFormData,
          ...data,
          education: data.education || defaultProfileFormData.education,
          experience: data.experience || defaultProfileFormData.experience,
          publications: data.publications || defaultProfileFormData.publications,
          awards: data.awards || defaultProfileFormData.awards,
          fellowships: data.fellowships || defaultProfileFormData.fellowships,
          memberships: data.memberships || defaultProfileFormData.memberships,
          supervision: data.supervision || defaultProfileFormData.supervision,
          supervisionDetails: data.supervision_details || defaultProfileFormData.supervisionDetails,
        };
        setFormData(transformedData);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }
    
    // Transform formData back to researcher_profiles format
    const profileData = {
      user_id: user.id,
      title: formData.title || null,
      subtitle: formData.subtitle || null,
      department: formData.department || null,
      years_experience: formData.years_experience || 0,
      students_supervised: formData.students_supervised || 0,
      hourly_rate: formData.hourly_rate || 0,
      response_time: formData.response_time || 'Usually responds within 24 hours',
      bio: formData.bio || null,
      research_interests: formData.research_interests || [],
      specialties: formData.specialties || [],
      education: formData.education || [],
      experience: formData.experience || [],
      publications: formData.publications || [],
      awards: formData.awards || [],
      fellowships: formData.fellowships || [],
      memberships: formData.memberships || [],
      supervision: formData.supervision || [],
      updated_at: new Date().toISOString(),
    };

    console.log('Profile data to save:', profileData);

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('researcher_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let error;
    if (existingProfile) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('researcher_profiles')
        .update(profileData)
        .eq('user_id', user.id);
      error = updateError;
    } else {
      // Insert new profile
      const { error: insertError } = await supabase
        .from('researcher_profiles')
        .insert(profileData);
      error = insertError;
    }
    
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
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
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
        education={formData.education}
        isEditing={isEditing}
        onAdd={handlers.handleAddEducation}
        onUpdate={handlers.handleUpdateEducation}
        onRemove={handlers.handleRemoveEducation}
      />

      <WorkExperienceSection
        workExperience={formData.experience}
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
        scholarships={formData.fellowships}
        isEditing={isEditing}
        onAdd={handlers.handleAddScholarship}
        onUpdate={handlers.handleUpdateScholarship}
        onRemove={handlers.handleRemoveScholarship}
      />

      <ProfessionalAffiliationsSection
        affiliations={formData.memberships}
        isEditing={isEditing}
        onAdd={handlers.handleAddAffiliation}
        onUpdate={handlers.handleUpdateAffiliation}
        onRemove={handlers.handleRemoveAffiliation}
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

      <AccountStatisticsSection
        totalConsultations={userStatistics.totalConsultations}
        averageRating={userStatistics.averageRating}
        memberSince={userStatistics.memberSince}
        loading={userStatistics.loading}
      />
    </div>
  );
};

export default ProfileTab;
