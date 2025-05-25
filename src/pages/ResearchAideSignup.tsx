
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SignupHeader from "@/components/signup/SignupHeader";
import BasicInfoFields from "@/components/signup/BasicInfoFields";
import ContactFields from "@/components/signup/ContactFields";
import OrganizationFields from "@/components/signup/OrganizationFields";
import ExperienceField from "@/components/signup/ExperienceField";
import BioField from "@/components/signup/BioField";
import TermsCheckbox from "@/components/signup/TermsCheckbox";
import SignupFooter from "@/components/signup/SignupFooter";

const ResearchAideSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    experience: "",
    bio: "",
    specializations: [] as string[],
    agreedToTerms: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Research Aide signup:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <SignupHeader 
          title="Join as a Research Aide"
          subtitle="Help researchers with their projects and earn income"
        />

        <div className="bg-white p-8 shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <BasicInfoFields 
              formData={formData}
              onInputChange={handleInputChange}
            />

            <ContactFields 
              formData={formData}
              onInputChange={handleInputChange}
            />

            <OrganizationFields 
              formData={formData}
              onInputChange={handleInputChange}
            />

            <ExperienceField 
              formData={formData}
              onInputChange={handleInputChange}
            />

            <BioField 
              formData={formData}
              onInputChange={handleInputChange}
            />

            <TermsCheckbox 
              formData={formData}
              onInputChange={handleInputChange}
            />
            
            <Button type="submit" className="w-full">
              Create Research Aide Account
            </Button>
            
            <SignupFooter />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResearchAideSignup;
