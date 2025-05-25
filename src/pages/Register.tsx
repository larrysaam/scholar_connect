
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AccountTypeSelector from "@/components/register/AccountTypeSelector";
import ProfileImageUpload from "@/components/register/ProfileImageUpload";
import PersonalInfoFields from "@/components/register/PersonalInfoFields";
import LanguageSelector from "@/components/register/LanguageSelector";
import AcademicFields from "@/components/register/AcademicFields";
import LocationFields from "@/components/register/LocationFields";
import OTPVerification from "@/components/register/OTPVerification";
import { 
  countryCodes, 
  availableLanguages, 
  cameroonUniversities, 
  worldCountries, 
  cameroonCities 
} from "@/data/registrationData";

const Register = () => {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [showOtherCountry, setShowOtherCountry] = useState(false);
  const [showOtherCity, setShowOtherCity] = useState(false);
  const [showOtherDepartment, setShowOtherDepartment] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    sex: "",
    email: "",
    password: "",
    countryCode: "",
    contact: "",
    university: "",
    faculty: "",
    department: "",
    customDepartment: "",
    company: "",
    country: "",
    customCountry: "",
    city: "",
    customCity: "",
    academicLevel: "",
    preferredLanguages: [] as string[]
  });

  const handleLanguageToggle = (language: string) => {
    const updatedLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter(lang => lang !== language)
      : [...selectedLanguages, language];
    
    setSelectedLanguages(updatedLanguages);
    setFormData(prev => ({ ...prev, preferredLanguages: updatedLanguages }));
  };

  const removeLanguage = (language: string) => {
    const updatedLanguages = selectedLanguages.filter(lang => lang !== language);
    setSelectedLanguages(updatedLanguages);
    setFormData(prev => ({ ...prev, preferredLanguages: updatedLanguages }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === "country" && value === "Other") {
      setShowOtherCountry(true);
    } else if (field === "country" && value !== "Other") {
      setShowOtherCountry(false);
    }
    
    if (field === "city" && value === "Other") {
      setShowOtherCity(true);
    } else if (field === "city" && value !== "Other") {
      setShowOtherCity(false);
    }
    
    if (field === "department" && value === "other") {
      setShowOtherDepartment(true);
    } else if (field === "department" && value !== "other") {
      setShowOtherDepartment(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFirstStep = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      console.log("Sending OTP to:", formData.email);
      setStep(2);
      setIsLoading(false);
    }, 1500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      console.log("Verifying OTP:", otpCode);
      console.log("Registering user:", formData);
      setIsLoading(false);
    }, 1500);
  };

  const resendOTP = () => {
    console.log("Resending OTP to:", formData.email);
  };

  if (step === 2) {
    return (
      <OTPVerification
        formData={formData}
        otpCode={otpCode}
        setOtpCode={setOtpCode}
        isLoading={isLoading}
        onVerifyOTP={handleVerifyOTP}
        onResendOTP={resendOTP}
        onBackToRegistration={() => setStep(1)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 overflow-hidden">
              <img src="/lovable-uploads/3e478490-867e-47d2-9e44-aaef66cf715c.png" alt="ScholarConnect" className="w-full h-full object-contain"/>
            </div>
            <span className="text-2xl font-bold text-blue-600">ScholarConnect</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-gray-600">
            Join our platform to connect with researchers
          </p>
        </div>

        <div className="bg-white p-8 shadow rounded-lg">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="institution">Institution SSO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleFirstStep} className="space-y-6">
                <div className="space-y-4">
                  <AccountTypeSelector 
                    accountType={accountType}
                    onAccountTypeChange={setAccountType}
                  />

                  {accountType === "student" && (
                    <ProfileImageUpload 
                      profileImage={profileImage}
                      onImageUpload={handleImageUpload}
                    />
                  )}

                  <PersonalInfoFields 
                    formData={formData}
                    onInputChange={handleInputChange}
                    countryCodes={countryCodes}
                  />

                  <LanguageSelector 
                    availableLanguages={availableLanguages}
                    selectedLanguages={selectedLanguages}
                    onLanguageToggle={handleLanguageToggle}
                    onRemoveLanguage={removeLanguage}
                  />

                  <AcademicFields 
                    accountType={accountType}
                    formData={formData}
                    onInputChange={handleInputChange}
                    cameroonUniversities={cameroonUniversities}
                    showOtherDepartment={showOtherDepartment}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@example.com" 
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required 
                      />
                      <p className="text-xs text-gray-500">
                        Must be at least 8 characters with at least 1 number and 1 special character.
                      </p>
                    </div>
                  </div>

                  <LocationFields 
                    formData={formData}
                    onInputChange={handleInputChange}
                    worldCountries={worldCountries}
                    cameroonCities={cameroonCities}
                    showOtherCountry={showOtherCountry}
                    showOtherCity={showOtherCity}
                  />
                </div>
                
                <div className="flex items-start">
                  <Checkbox id="terms" required />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
                  </label>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending verification code..." : "Continue"}
                </Button>
                
                <div className="text-center text-sm">
                  <span className="text-gray-600">Already have an account? </span>
                  <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign in
                  </Link>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="institution">
              <div className="space-y-6">
                <p className="text-sm text-gray-600">
                  Select your institution to sign up with your institutional credentials.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your institution" />
                    </SelectTrigger>
                    <SelectContent>
                      {cameroonUniversities.slice(0, 20).map((university) => (
                        <SelectItem key={university} value={university.toLowerCase().replace(/\s+/g, '-')}>
                          {university}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full">
                  Continue with Institution
                </Button>
                
                <div className="text-center text-sm">
                  <span className="text-gray-600">Already have an account? </span>
                  <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign in
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
