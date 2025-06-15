
import { useState } from "react";
import AuthLogoHeader from "@/components/auth/AuthLogoHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sanitizeInput, validateEmail } from "@/utils/security";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const academicRanks = [
  "PhD Holder",
  "Assistant Lecturer",
  "Lecturer",
  "Senior Lecturer",
  "Associate Professor",
  "Full Professor",
  "Professor Emeritus/Emerita",
  "Retired Researcher",
  "Research Director",
  "Senior Research Officer",
  "Research Lead",
  "Research Officer",
  "Assistant Research Officer",
  "Other"
];
const studyLevelOptions = ["HND","State Diploma","Bachelors","Master's","PhD","Post Doctorate"];
const sexOptions = ["Male","Female"];
const languageOptions = ["English", "French", "Spanish", "Arabic", "Portuguese", "Other"];

const ExpertSignUp = () => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    institution: "",
    fieldOfExpertise: "",
    academicRank: "",
    educationLevel: "",
    sex: "",
    dob: "",
    linkedin: "",
    researchgate: "",
    academia: "",
    orcid: "",
    preferredLanguage: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = sanitizeInput(formData.email);
    if (!validateEmail(email)) {
      toast({ variant: "destructive", title: "Invalid email address", description: "Please provide a valid email." });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Password Mismatch", description: "Passwords do not match." });
      return;
    }
    if (!formData.agreedToTerms) {
      toast({ variant: "destructive", title: "Required", description: "You must agree to the Terms and Privacy Policy." });
      return;
    }
    setIsLoading(true);
    const result = await signUp(email, formData.password, { fullName: formData.fullName, role: 'expert' });

    if (result.success) {
      toast({ title: "Account created!", description: "Check your email for confirmation." });
      // You can redirect to a dashboard or show a success message here
    } else {
      toast({ variant: "destructive", title: "Sign up Failed", description: result.error });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        <AuthLogoHeader />
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-center mb-2">
            Join ResearchWhao as a Research Expert
          </h2>
          <p className="text-center text-gray-700 font-semibold">
            Give Students the Right Academic Support at Every Step of their Research Journey
          </p>
          <p className="text-center text-gray-600 mb-6">
            Connect with students at all academic levels, give expert assistance, and elevate their thesis or dissertation.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off" aria-label="Research Expert Sign Up">
            <div>
              <Label>Full Name*</Label>
              <Input value={formData.fullName} onChange={e => handleInputChange("fullName", e.target.value)} required />
            </div>
            <div>
              <Label>Email Address*</Label>
              <Input type="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} required />
            </div>
            <div>
              <Label>Phone Number*</Label>
              <Input value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)} required />
            </div>
            <div>
              <Label>Country*</Label>
              <Input value={formData.country} onChange={e => handleInputChange("country", e.target.value)} required />
            </div>
            <div>
              <Label>University/Institution/Research Organisation*</Label>
              <Input value={formData.institution} onChange={e => handleInputChange("institution", e.target.value)} required />
            </div>
            <div>
              <Label>Field of Expertise*</Label>
              <Input value={formData.fieldOfExpertise} onChange={e => handleInputChange("fieldOfExpertise", e.target.value)} required />
            </div>
            <div>
              <Label>Academic Rank*</Label>
              <select
                className="w-full border rounded px-2 py-1"
                value={formData.academicRank}
                onChange={e => handleInputChange("academicRank", e.target.value)}
                required
                style={{ backgroundColor: "#fff", zIndex: 10 }}
              >
                <option value="">Select</option>
                {academicRanks.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Highest Level of Education*</Label>
              <select
                className="w-full border rounded px-2 py-1"
                value={formData.educationLevel}
                onChange={e => handleInputChange("educationLevel", e.target.value)}
                required
                style={{ backgroundColor: "#fff", zIndex: 10 }}
              >
                <option value="">Select</option>
                {studyLevelOptions.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Sex*</Label>
              <select
                className="w-full border rounded px-2 py-1"
                value={formData.sex}
                onChange={e => handleInputChange("sex", e.target.value)}
                required
                style={{ backgroundColor: "#fff", zIndex: 10 }}
              >
                <option value="">Select</option>
                {sexOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Date of Birth*</Label>
              <Input type="date" value={formData.dob} onChange={e => handleInputChange("dob", e.target.value)} required />
            </div>
            <div>
              <Label>LinkedIn Account</Label>
              <Input value={formData.linkedin} onChange={e => handleInputChange("linkedin", e.target.value)} />
            </div>
            <div>
              <Label>ResearchGate</Label>
              <Input value={formData.researchgate} onChange={e => handleInputChange("researchgate", e.target.value)} />
            </div>
            <div>
              <Label>Academic Edu</Label>
              <Input value={formData.academia} onChange={e => handleInputChange("academia", e.target.value)} />
            </div>
            <div>
              <Label>ORCID ID</Label>
              <Input value={formData.orcid} onChange={e => handleInputChange("orcid", e.target.value)} />
            </div>
            <div>
              <Label>Preferred Language*</Label>
              <select
                className="w-full border rounded px-2 py-1"
                value={formData.preferredLanguage}
                onChange={e => handleInputChange("preferredLanguage", e.target.value)}
                required
                style={{ backgroundColor: "#fff", zIndex: 10 }}
              >
                <option value="">Select</option>
                {languageOptions.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Password*</Label>
              <Input type="password" value={formData.password} onChange={e => handleInputChange("password", e.target.value)} required />
            </div>
            <div>
              <Label>Confirm Password*</Label>
              <Input type="password" value={formData.confirmPassword} onChange={e => handleInputChange("confirmPassword", e.target.value)} required />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.agreedToTerms}
                onChange={e => handleInputChange("agreedToTerms", e.target.checked)}
                required
                id="terms-expert"
                aria-checked={formData.agreedToTerms}
                aria-required="true"
              />
              <Label htmlFor="terms-expert">I agree to the Terms of Service and Privacy Policy*</Label>
            </div>
            <Button type="submit" className="w-full mt-2" disabled={isLoading || !formData.agreedToTerms} aria-busy={isLoading}>
              {isLoading ? <LoadingSpinner size="sm" /> : "Create My Researcher Account"}
            </Button>
            <p className="text-xs text-gray-600 text-center">
              Upon clicking, you'll receive email confirmation and be taken to your dashboard.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpertSignUp;
