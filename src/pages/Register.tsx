
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PersonalDetailsSection from "@/components/register/PersonalDetailsSection";
import AcademicInterestsSection from "@/components/register/AcademicInterestsSection";
import AccountCreationSection from "@/components/register/AccountCreationSection";
import AgreementSection from "@/components/register/AgreementSection";
import StudentThankYouMessage from "@/components/register/StudentThankYouMessage";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    country: "",
    institution: "",
    faculty: "",
    studyLevel: "",
    sex: "",
    dateOfBirth: "",
    researchAreas: [] as string[],
    topicTitle: "",
    researchStage: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false
  });

  const [showThankYou, setShowThankYou] = useState(false);

  const researchAreaOptions = [
    "Education", "Health Sciences", "Engineering", "Social Sciences", "Natural Sciences",
    "Agriculture", "Economics", "Geography", "Psychology", "Computer Science",
    "Mathematics", "Physics", "Chemistry", "Biology", "Literature", "History"
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleResearchArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      researchAreas: prev.researchAreas.includes(area)
        ? prev.researchAreas.filter(a => a !== area)
        : [...prev.researchAreas, area]
    }));
  };

  const removeResearchArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      researchAreas: prev.researchAreas.filter(a => a !== area)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Student signup:", formData);
    setShowThankYou(true);
  };

  if (showThankYou) {
    return <StudentThankYouMessage />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center mb-6">
                  <Link to="/" className="inline-flex items-center space-x-2 mb-4">
                    <img 
                      src="/lovable-uploads/a2f6a2f6-b795-4e93-914c-2b58648099ff.png" 
                      alt="ScholarConnect" 
                      className="w-8 h-8"
                    />
                    <span className="text-2xl font-bold text-blue-600">ScholarConnect</span>
                  </Link>
                  <CardTitle className="text-2xl text-center font-bold">
                    Join ScholarConnect as a Student
                  </CardTitle>
                  <p className="text-lg text-center font-semibold text-gray-700 mb-2">
                    Get the Right Academic Support at Every Step of Your Research Journey
                  </p>
                  <p className="text-gray-600 text-center">
                    Connect with top scholars, get expert assistance, and elevate your thesis or dissertation.
                  </p>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <PersonalDetailsSection
                    formData={formData}
                    onInputChange={handleInputChange}
                  />

                  <AcademicInterestsSection
                    formData={formData}
                    researchAreaOptions={researchAreaOptions}
                    onInputChange={handleInputChange}
                    onToggleResearchArea={toggleResearchArea}
                    onRemoveResearchArea={removeResearchArea}
                  />

                  <AccountCreationSection
                    formData={formData}
                    onInputChange={handleInputChange}
                  />

                  <AgreementSection
                    agreedToTerms={formData.agreedToTerms}
                    onInputChange={handleInputChange}
                  />
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
