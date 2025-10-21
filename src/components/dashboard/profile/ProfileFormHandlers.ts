import { ProfileFormData, EducationEntry, WorkExperienceEntry, AwardEntry, PublicationEntry, FellowshipEntry, SupervisionEntry, SupervisionDetailEntry } from "./ProfileFormData";

export interface ProfileFormHandlers {
  handleInputChange: (field: string, value: string) => void;
  handleBioGenerated: (newBio: string) => void;
  
  // Education handlers
  handleAddEducation: () => void;
  handleUpdateEducation: (index: number, field: string, value: string) => void;
  handleRemoveEducation: (index: number) => void;
  
  // Work Experience handlers
  handleAddWorkExperience: () => void;
  handleUpdateWorkExperience: (index: number, field: string, value: string) => void;
  handleRemoveWorkExperience: (index: number) => void;
  
  // Awards handlers
  handleAddAward: () => void;
  handleUpdateAward: (index: number, field: string, value: string) => void;
  handleRemoveAward: (index: number) => void;
  
  // Publications handlers
  handleAddPublication: () => void;
  handleUpdatePublication: (index: number, field: string, value: string) => void;
  handleRemovePublication: (index: number) => void;
  
  // Fellowships handlers
  handleAddScholarship: () => void;
  handleUpdateScholarship: (index: number, field: string, value: string) => void;
  handleRemoveScholarship: (index: number) => void;
  
  // Affiliations handlers
  handleAddAffiliation: () => void;
  handleUpdateAffiliation: (index: number, value: string) => void;
  handleRemoveAffiliation: (index: number) => void;
  
  // Languages handlers
  handleAddLanguage: () => void;
  handleUpdateLanguage: (index: number, value: string) => void;
  handleRemoveLanguage: (index: number) => void;
  
  // Supervision handlers
  handleAddSupervision: () => void;
  handleUpdateSupervision: (index: number, field: string, value: string | number) => void;
  handleRemoveSupervision: (index: number) => void;
  
  // Supervision Details handlers
  handleAddSupervisionDetail: () => void;
  handleUpdateSupervisionDetail: (index: number, field: string, value: string) => void;
  handleRemoveSupervisionDetail: (index: number) => void;
}

export const createProfileFormHandlers = (
  formData: ProfileFormData,
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>
): ProfileFormHandlers => {
  return {
    handleInputChange: (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },

    handleBioGenerated: (newBio: string) => {
      setFormData(prev => ({ ...prev, bio: newBio }));
    },

    // Educational Background handlers
    handleAddEducation: () => {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { degree: "", institution: "", year: "" }]
      }));
    },

    handleUpdateEducation: (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        education: prev.education.map((edu, i) =>
          i === index ? { ...edu, [field]: value } : edu
        )
      }));
    },

    handleRemoveEducation: (index: number) => {
      setFormData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    },

    // Work Experience handlers
    handleAddWorkExperience: () => {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, { position: "", company: "", period: "" }]
      }));
    },

    handleUpdateWorkExperience: (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        experience: prev.experience.map((exp, i) =>
          i === index ? { ...exp, [field]: value } : exp
        )
      }));
    },

    handleRemoveWorkExperience: (index: number) => {
      setFormData(prev => ({
        ...prev,
        experience: prev.experience.filter((_, i) => i !== index)
      }));
    },

    // Awards handlers
    handleAddAward: () => {
      setFormData(prev => ({
        ...prev,
        awards: [...prev.awards, { title: "", organization: "", year: "" }]
      }));
    },

    handleUpdateAward: (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        awards: prev.awards.map((award, i) =>
          i === index ? { ...award, [field]: value } : award
        )
      }));
    },

    handleRemoveAward: (index: number) => {
      setFormData(prev => ({
        ...prev,
        awards: prev.awards.filter((_, i) => i !== index)
      }));
    },

    // Publications handlers
    handleAddPublication: () => {
      setFormData(prev => ({
        ...prev,
        publications: [...prev.publications, { title: "", journal: "", year: "" }]
      }));
    },

    handleUpdatePublication: (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        publications: prev.publications.map((pub, i) =>
          i === index ? { ...pub, [field]: value } : pub
        )
      }));
    },

    handleRemovePublication: (index: number) => {
      setFormData(prev => ({
        ...prev,
        publications: prev.publications.filter((_, i) => i !== index)
      }));
    },

    // Fellowships handlers
    handleAddScholarship: () => {
      setFormData(prev => ({
        ...prev,
        fellowships: [...prev.fellowships, { title: "", organization: "", period: "" }]
      }));
    },

    handleUpdateScholarship: (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        fellowships: prev.fellowships.map((fellowship, i) =>
          i === index ? { ...fellowship, [field]: value } : fellowship
        )
      }));
    },

    handleRemoveScholarship: (index: number) => {
      setFormData(prev => ({
        ...prev,
        fellowships: prev.fellowships.filter((_, i) => i !== index)
      }));
    },

    // Affiliations handlers
    handleAddAffiliation: () => {
      setFormData(prev => ({
        ...prev,
        memberships: [...prev.memberships, ""]
      }));
    },

    handleUpdateAffiliation: (index: number, value: string) => {
      setFormData(prev => ({
        ...prev,
        memberships: prev.memberships.map((aff, i) =>
          i === index ? value : aff
        )
      }));
    },

    handleRemoveAffiliation: (index: number) => {
      setFormData(prev => ({
        ...prev,
        memberships: prev.memberships.filter((_, i) => i !== index)
      }));
    },

    // Languages handlers
    handleAddLanguage: () => {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, ""]
      }));
    },

    handleUpdateLanguage: (index: number, value: string) => {
      setFormData(prev => ({
        ...prev,
        languages: prev.languages.map((lang, i) =>
          i === index ? value : lang
        )
      }));
    },

    handleRemoveLanguage: (index: number) => {
      setFormData(prev => ({
        ...prev,
        languages: prev.languages.filter((_, i) => i !== index)
      }));
    },

    // Supervision handlers
    handleAddSupervision: () => {
      setFormData(prev => ({
        ...prev,
        supervision: [...prev.supervision, { level: "", count: 0 }]
      }));
    },

    handleUpdateSupervision: (index: number, field: string, value: string | number) => {
      setFormData(prev => ({
        ...prev,
        supervision: prev.supervision.map((sup, i) =>
          i === index ? { ...sup, [field]: value } : sup
        )
      }));
    },

    handleRemoveSupervision: (index: number) => {
      setFormData(prev => ({
        ...prev,
        supervision: prev.supervision.filter((_, i) => i !== index)
      }));
    },

    // Supervision Details handlers
    handleAddSupervisionDetail: () => {
      setFormData(prev => ({
        ...prev,
        supervisionDetails: [...prev.supervisionDetails, { name: "", level: "", thesisTitle: "", year: "" }]
      }));
    },

    handleUpdateSupervisionDetail: (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        supervisionDetails: prev.supervisionDetails.map((detail, i) =>
          i === index ? { ...detail, [field]: value } : detail
        )
      }));
    },

    handleRemoveSupervisionDetail: (index: number) => {
      setFormData(prev => ({
        ...prev,
        supervisionDetails: prev.supervisionDetails.filter((_, i) => i !== index)
      }));
    }
  };
};
