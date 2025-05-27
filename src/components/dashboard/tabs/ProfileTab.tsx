
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

const ProfileTab = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "Dr.",
    name: "John Researcher",
    email: "john.researcher@university.cm",
    phone: "+237 6XX XXX XXX",
    location: "Yaoundé, Cameroon",
    bio: "Specialized in artificial intelligence and machine learning with over 10 years of research experience in healthcare applications.",
    educationalBackground: [
      { degree: "PhD in Computer Science", institution: "University of Yaoundé I", year: "2015" },
      { degree: "MSc in Information Systems", institution: "University of Buea", year: "2010" }
    ],
    workExperience: [
      { position: "Associate Professor", company: "University of Yaoundé I", period: "2018-Present" },
      { position: "Assistant Professor", company: "University of Buea", period: "2015-2018" }
    ],
    awards: [
      { title: "Best Research Paper Award", organization: "IEEE Conference", year: "2023" },
      { title: "Excellence in Teaching Award", organization: "University of Yaoundé I", year: "2022" }
    ],
    publications: [
      { title: "AI in Healthcare: A Comprehensive Review", journal: "Nature AI", year: "2023" },
      { title: "Machine Learning Applications in Medical Diagnosis", journal: "IEEE Transactions", year: "2022" }
    ],
    scholarships: [
      { title: "Government Research Fellowship", organization: "Ministry of Higher Education", period: "2020-2023" },
      { title: "UNESCO Research Grant", organization: "UNESCO", period: "2019-2020" }
    ],
    affiliations: [
      "IEEE Computer Society",
      "Association for Computing Machinery",
      "Cameroon Computer Science Association"
    ],
    languages: ["English", "French", "Spanish"],
    supervision: [
      { level: "PhD", count: 5 },
      { level: "Master's", count: 12 },
      { level: "Undergraduate", count: 25 },
      { level: "Higher National Diploma", count: 8 }
    ],
    supervisionDetails: [
      { name: "Marie Dupont", level: "PhD", thesisTitle: "Machine Learning Applications in Agricultural Prediction", year: "2023" },
      { name: "Paul Ngozi", level: "Master's", thesisTitle: "Data Mining Techniques for Healthcare Analytics", year: "2023" },
      { name: "Sarah Mballa", level: "PhD", thesisTitle: "AI-Driven Climate Change Modeling", year: "2022" }
    ]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
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

    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully"
    });
    
    setIsEditing(false);
    console.log("Saving profile data:", formData);
  };

  const handleBioGenerated = (newBio: string) => {
    setFormData(prev => ({ ...prev, bio: newBio }));
  };

  // Educational Background handlers
  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      educationalBackground: [...prev.educationalBackground, { degree: "", institution: "", year: "" }]
    }));
  };

  const handleUpdateEducation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      educationalBackground: prev.educationalBackground.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educationalBackground: prev.educationalBackground.filter((_, i) => i !== index)
    }));
  };

  // Work Experience handlers
  const handleAddWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, { position: "", company: "", period: "" }]
    }));
  };

  const handleUpdateWorkExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleRemoveWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  // Awards handlers
  const handleAddAward = () => {
    setFormData(prev => ({
      ...prev,
      awards: [...prev.awards, { title: "", organization: "", year: "" }]
    }));
  };

  const handleUpdateAward = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.map((award, i) =>
        i === index ? { ...award, [field]: value } : award
      )
    }));
  };

  const handleRemoveAward = (index: number) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  // Publications handlers
  const handleAddPublication = () => {
    setFormData(prev => ({
      ...prev,
      publications: [...prev.publications, { title: "", journal: "", year: "" }]
    }));
  };

  const handleUpdatePublication = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      publications: prev.publications.map((pub, i) =>
        i === index ? { ...pub, [field]: value } : pub
      )
    }));
  };

  const handleRemovePublication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      publications: prev.publications.filter((_, i) => i !== index)
    }));
  };

  // Scholarships handlers
  const handleAddScholarship = () => {
    setFormData(prev => ({
      ...prev,
      scholarships: [...prev.scholarships, { title: "", organization: "", period: "" }]
    }));
  };

  const handleUpdateScholarship = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      scholarships: prev.scholarships.map((scholarship, i) =>
        i === index ? { ...scholarship, [field]: value } : scholarship
      )
    }));
  };

  const handleRemoveScholarship = (index: number) => {
    setFormData(prev => ({
      ...prev,
      scholarships: prev.scholarships.filter((_, i) => i !== index)
    }));
  };

  // Affiliations handlers
  const handleAddAffiliation = () => {
    setFormData(prev => ({
      ...prev,
      affiliations: [...prev.affiliations, ""]
    }));
  };

  const handleUpdateAffiliation = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      affiliations: prev.affiliations.map((aff, i) =>
        i === index ? value : aff
      )
    }));
  };

  const handleRemoveAffiliation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      affiliations: prev.affiliations.filter((_, i) => i !== index)
    }));
  };

  // Languages handlers
  const handleAddLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, ""]
    }));
  };

  const handleUpdateLanguage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) =>
        i === index ? value : lang
      )
    }));
  };

  const handleRemoveLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // Supervision handlers
  const handleAddSupervision = () => {
    setFormData(prev => ({
      ...prev,
      supervision: [...prev.supervision, { level: "", count: 0 }]
    }));
  };

  const handleUpdateSupervision = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      supervision: prev.supervision.map((sup, i) =>
        i === index ? { ...sup, [field]: value } : sup
      )
    }));
  };

  const handleRemoveSupervision = (index: number) => {
    setFormData(prev => ({
      ...prev,
      supervision: prev.supervision.filter((_, i) => i !== index)
    }));
  };

  // Supervision Details handlers
  const handleAddSupervisionDetail = () => {
    setFormData(prev => ({
      ...prev,
      supervisionDetails: [...prev.supervisionDetails, { name: "", level: "", thesisTitle: "", year: "" }]
    }));
  };

  const handleUpdateSupervisionDetail = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      supervisionDetails: prev.supervisionDetails.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail
      )
    }));
  };

  const handleRemoveSupervisionDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      supervisionDetails: prev.supervisionDetails.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profile Information</h2>
        <Button 
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <PersonalInformationSection
        formData={formData}
        isEditing={isEditing}
        onInputChange={handleInputChange}
      />

      <ProfessionalBioSection
        bio={formData.bio}
        isEditing={isEditing}
        profileData={formData}
        onInputChange={handleInputChange}
        onBioGenerated={handleBioGenerated}
      />

      <EducationalBackgroundSection
        education={formData.educationalBackground}
        isEditing={isEditing}
        onAdd={handleAddEducation}
        onUpdate={handleUpdateEducation}
        onRemove={handleRemoveEducation}
      />

      <WorkExperienceSection
        workExperience={formData.workExperience}
        isEditing={isEditing}
        onAdd={handleAddWorkExperience}
        onUpdate={handleUpdateWorkExperience}
        onRemove={handleRemoveWorkExperience}
      />

      <AwardsRecognitionsSection
        awards={formData.awards}
        isEditing={isEditing}
        onAdd={handleAddAward}
        onUpdate={handleUpdateAward}
        onRemove={handleRemoveAward}
      />

      <PublicationsSectionProfile
        publications={formData.publications}
        isEditing={isEditing}
        onAdd={handleAddPublication}
        onUpdate={handleUpdatePublication}
        onRemove={handleRemovePublication}
      />

      <ScholarshipsFellowshipsSection
        scholarships={formData.scholarships}
        isEditing={isEditing}
        onAdd={handleAddScholarship}
        onUpdate={handleUpdateScholarship}
        onRemove={handleRemoveScholarship}
      />

      <ProfessionalAffiliationsSection
        affiliations={formData.affiliations}
        isEditing={isEditing}
        onAdd={handleAddAffiliation}
        onUpdate={handleUpdateAffiliation}
        onRemove={handleRemoveAffiliation}
      />

      <LanguagesSection
        languages={formData.languages}
        isEditing={isEditing}
        onAdd={handleAddLanguage}
        onUpdate={handleUpdateLanguage}
        onRemove={handleRemoveLanguage}
      />

      <StudentSupervisionSummary
        supervision={formData.supervision}
        isEditing={isEditing}
        onAdd={handleAddSupervision}
        onUpdate={handleUpdateSupervision}
        onRemove={handleRemoveSupervision}
      />

      <StudentSupervisionDetails
        supervisionDetails={formData.supervisionDetails}
        isEditing={isEditing}
        onAdd={handleAddSupervisionDetail}
        onUpdate={handleUpdateSupervisionDetail}
        onRemove={handleRemoveSupervisionDetail}
      />

      <AccountStatisticsSection />
    </div>
  );
};

export default ProfileTab;
