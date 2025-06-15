
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLogoHeader from "@/components/auth/AuthLogoHeader";
import { worldCountries, cameroonUniversities } from "@/data/registrationData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const fieldOfStudyOptions = [
  "Computer Science","Mathematics","Physics","Chemistry","Biology","Engineering","Law","Medicine","Psychology","Economics","Social Sciences","Literature", "History","Education","Health Sciences","Natural Sciences","Agriculture","Geography","Other"
];
const studyLevelOptions = ["HND","State Diploma","Bachelors","Master's","PhD","Post Doctorate"];
const sexOptions = ["Male","Female"];
const researchStages = [
  "Still Brainstorming","Writing My Project Proposal","Doing My Main Thesis (Writing Chapters, Data Collection and Analysis etc)","Awaiting Thesis Defense","Publication"
];

const StudentSignUp = () => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    countryCode: "+237",
    institution: "",
    studyField: "",
    studyLevel: "",
    sex: "",
    dob: "",
    researchArea: "",
    researchStage: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  // handlers
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Password Mismatch", description: "Passwords do not match." });
      return;
    }
    if (!formData.agreedToTerms) {
      toast({ variant: "destructive", title: "Required", description: "You must agree to the Terms and Privacy Policy." });
      return;
    }
    setIsLoading(true);
    const result = await signUp(formData.email, formData.password, { fullName: formData.fullName, role: 'student' });

    if (result.success) {
      toast({ title: "Account created!", description: "Check your email for confirmation." });
      navigate("/dashboard");
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
          <h2 className="text-2xl font-bold text-center mb-2">Join ResearchWhao as a Student</h2>
          <p className="text-center text-gray-700 font-semibold">Get the Right Academic Support at Every Step of Your Research Journey</p>
          <p className="text-center text-gray-600 mb-6">Connect with top scholars, get expert assistance, and elevate your thesis or dissertation.</p>
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Personal Details */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Personal Details</h3>
              <Label>Full Name*</Label>
              <Input value={formData.fullName} onChange={e => handleInputChange("fullName", e.target.value)} required />

              <Label className="mt-3">Email Address*</Label>
              <Input type="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} required placeholder="your.email@university.edu" />

              <div className="flex gap-2 mt-3">
                <div>
                  <Label>Country Code</Label>
                  <Select value={formData.countryCode} onValueChange={v => handleInputChange("countryCode", v)}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="+237" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+237">+237</SelectItem>
                      <SelectItem value="+234">+234</SelectItem>
                      <SelectItem value="+233">+233</SelectItem>
                      {/* ...add more as needed */}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label>Phone Number*</Label>
                  <Input value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)} required />
                </div>
              </div>

              <Label className="mt-3">Country of Study*</Label>
              <Select value={formData.country} onValueChange={v => handleInputChange("country", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="max-h-[160px] overflow-y-auto">
                  {worldCountries.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Label className="mt-3">University/Institution*</Label>
              <Select value={formData.institution} onValueChange={v => handleInputChange("institution", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select university/institution" />
                </SelectTrigger>
                <SelectContent className="max-h-[160px] overflow-y-auto">
                  {cameroonUniversities.map(u => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Label className="mt-3">Field of Study*</Label>
              <Select value={formData.studyField} onValueChange={v => handleInputChange("studyField", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field of study" />
                </SelectTrigger>
                <SelectContent className="max-h-[160px] overflow-y-auto">
                  {fieldOfStudyOptions.map(f => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Label className="mt-3">Level of Study*</Label>
              <Select value={formData.studyLevel} onValueChange={v => handleInputChange("studyLevel", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {studyLevelOptions.map(lvl => (
                    <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2 mt-3">
                <div className="flex-1">
                  <Label>Sex*</Label>
                  <Select value={formData.sex} onValueChange={v => handleInputChange("sex", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {sexOptions.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label>Date of Birth*</Label>
                  <Input type="date" value={formData.dob} onChange={e => handleInputChange("dob", e.target.value)} required />
                </div>
              </div>
            </div>

            {/* Academic Interests */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Academic Interest</h3>
              <Label>Research Area*</Label>
              <Input value={formData.researchArea} onChange={e => handleInputChange("researchArea", e.target.value)} required />
              <Label className="mt-3">Stage of Research*</Label>
              <Select value={formData.researchStage} onValueChange={v => handleInputChange("researchStage", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select research stage" />
                </SelectTrigger>
                <SelectContent>
                  {researchStages.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Creation */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Create Your Account</h3>
              <Label>Password*</Label>
              <Input type="password" value={formData.password} onChange={e => handleInputChange("password", e.target.value)} required />
              <Label className="mt-3">Confirm Password*</Label>
              <Input type="password" value={formData.confirmPassword} onChange={e => handleInputChange("confirmPassword", e.target.value)} required />
            </div>

            {/* Agreement */}
            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                checked={formData.agreedToTerms}
                onChange={e => handleInputChange("agreedToTerms", e.target.checked)}
                required
                id="terms"
              />
              <Label htmlFor="terms">I agree to the Terms of Service and Privacy Policy*</Label>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="sm" /> : "Create My Student Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default StudentSignUp;
