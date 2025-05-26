import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import ProfileImage from "@/components/dashboard/profile/ProfileImage";
import BasicInformation from "@/components/dashboard/profile/BasicInformation";
import ExperienceSection from "@/components/dashboard/profile/ExperienceSection";
import PublicationsSection from "@/components/dashboard/profile/PublicationsSection";
import AwardsSection from "@/components/dashboard/profile/AwardsSection";
import FellowshipsSection from "@/components/dashboard/profile/FellowshipsSection";
import GrantsSection from "@/components/dashboard/profile/GrantsSection";
import MembershipsSection from "@/components/dashboard/profile/MembershipsSection";
import SupervisionSection from "@/components/dashboard/profile/SupervisionSection";

const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Dr. Alex Smith",
    title: "Senior Research Scientist",
    institution: "University of Technology",
    department: "Computer Science Department",
    email: "alex.smith@university.edu",
    phone: "+237 650 123 456",
    bio: "Experienced researcher with over 10 years in artificial intelligence and machine learning. Passionate about advancing the field of computer vision and natural language processing.",
    specialties: ["Artificial Intelligence", "Machine Learning", "Computer Vision"],
    hourlyRate: "15000",
    languages: ["English", "French"],
    experience: [
      { position: "Senior Research Scientist", institution: "University of Technology", period: "2020-Present" }
    ],
    publications: [
      { title: "AI in Modern Computing", journal: "Tech Journal", year: "2023" , link: ""}
    ],
    awards: [
      { title: "Best Researcher Award", year: "2022" }
    ],
    fellowships: [
      { title: "AI Research Fellowship", period: "2021-2022" }
    ],
    grants: [
      { title: "Research Innovation Grant", amount: "500,000 XAF", period: "2022-2024" }
    ],
    memberships: ["International AI Association", "Computer Science Society"],
    supervision: {
      hnd: "2",
      undergraduate: "5",
      masters: "3",
      phd: "1",
      postdoc: "0"
    }
  });

  const handleSave = () => {
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
  };

  const handleImageUpload = () => {
    console.log("Opening image upload dialog");
  };

  const handleBasicInfoUpdate = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleExperienceAdd = () => {
    setProfileData(prev => ({
      ...prev,
      experience: [...prev.experience, { position: '', institution: '', period: '' }]
    }));
  };

  const handleExperienceRemove = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleExperienceUpdate = (index: number, field: 'position' | 'institution' | 'period', value: string) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handlePublicationAdd = () => {
    setProfileData(prev => ({
      ...prev,
      publications: [...prev.publications, { title: '', journal: '', year: '', link: '' }]
    }));
  };

  const handlePublicationRemove = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      publications: prev.publications.filter((_, i) => i !== index)
    }));
  };

  const handlePublicationUpdate = (index: number, field: 'title' | 'journal' | 'year' | 'link', value: string) => {
    setProfileData(prev => ({
      ...prev,
      publications: prev.publications.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAwardAdd = () => {
    setProfileData(prev => ({
      ...prev,
      awards: [...prev.awards, { title: '', year: '' }]
    }));
  };

  const handleAwardRemove = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  const handleAwardUpdate = (index: number, field: 'title' | 'year', value: string) => {
    setProfileData(prev => ({
      ...prev,
      awards: prev.awards.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleFellowshipAdd = () => {
    setProfileData(prev => ({
      ...prev,
      fellowships: [...prev.fellowships, { title: '', period: '' }]
    }));
  };

  const handleFellowshipRemove = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      fellowships: prev.fellowships.filter((_, i) => i !== index)
    }));
  };

  const handleFellowshipUpdate = (index: number, field: 'title' | 'period', value: string) => {
    setProfileData(prev => ({
      ...prev,
      fellowships: prev.fellowships.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleGrantAdd = () => {
    setProfileData(prev => ({
      ...prev,
      grants: [...prev.grants, { title: '', amount: '', period: '' }]
    }));
  };

  const handleGrantRemove = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      grants: prev.grants.filter((_, i) => i !== index)
    }));
  };

  const handleGrantUpdate = (index: number, field: 'title' | 'amount' | 'period', value: string) => {
    setProfileData(prev => ({
      ...prev,
      grants: prev.grants.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleMembershipAdd = () => {
    setProfileData(prev => ({
      ...prev,
      memberships: [...prev.memberships, '']
    }));
  };

  const handleMembershipRemove = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      memberships: prev.memberships.filter((_, i) => i !== index)
    }));
  };

  const handleMembershipUpdate = (index: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      memberships: prev.memberships.map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const handleSupervisionUpdate = (field: 'hnd' | 'undergraduate' | 'masters' | 'phd' | 'postdoc', value: string) => {
    setProfileData(prev => ({
      ...prev,
      supervision: { ...prev.supervision, [field]: value }
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Image */}
        <div className="md:col-span-1">
          <ProfileImage
            name={profileData.name}
            title={profileData.title}
            isEditing={isEditing}
            onImageUpload={handleImageUpload}
          />
        </div>

        {/* Profile Details */}
        <div className="md:col-span-2 space-y-6">
          <BasicInformation
            profileData={profileData}
            isEditing={isEditing}
            onUpdate={handleBasicInfoUpdate}
          />

          <ExperienceSection
            experience={profileData.experience}
            isEditing={isEditing}
            onAdd={handleExperienceAdd}
            onRemove={handleExperienceRemove}
            onUpdate={handleExperienceUpdate}
          />

          <PublicationsSection
            publications={profileData.publications}
            isEditing={isEditing}
            onAdd={handlePublicationAdd}
            onRemove={handlePublicationRemove}
            onUpdate={handlePublicationUpdate}
          />

          <AwardsSection
            awards={profileData.awards}
            isEditing={isEditing}
            onAdd={handleAwardAdd}
            onRemove={handleAwardRemove}
            onUpdate={handleAwardUpdate}
          />

          <FellowshipsSection
            fellowships={profileData.fellowships}
            isEditing={isEditing}
            onAdd={handleFellowshipAdd}
            onRemove={handleFellowshipRemove}
            onUpdate={handleFellowshipUpdate}
          />

          <GrantsSection
            grants={profileData.grants}
            isEditing={isEditing}
            onAdd={handleGrantAdd}
            onRemove={handleGrantRemove}
            onUpdate={handleGrantUpdate}
          />

          <MembershipsSection
            memberships={profileData.memberships}
            isEditing={isEditing}
            onAdd={handleMembershipAdd}
            onRemove={handleMembershipRemove}
            onUpdate={handleMembershipUpdate}
          />

          <SupervisionSection
            supervision={profileData.supervision}
            isEditing={isEditing}
            onUpdate={handleSupervisionUpdate}
          />

          {isEditing && (
            <div className="flex justify-end">
              <Button onClick={handleSave} className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
