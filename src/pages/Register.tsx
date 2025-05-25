import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Register = () => {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [showOtherUniversity, setShowOtherUniversity] = useState(false);
  const [showOtherFaculty, setShowOtherFaculty] = useState(false);
  const [showOtherDepartment, setShowOtherDepartment] = useState(false);
  const [showOtherCountry, setShowOtherCountry] = useState(false);
  const [showOtherCity, setShowOtherCity] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    sex: "",
    email: "",
    password: "",
    contact: "",
    university: "",
    customUniversity: "",
    faculty: "",
    customFaculty: "",
    department: "",
    customDepartment: "",
    country: "",
    customCountry: "",
    city: "",
    customCity: "",
    academicLevel: "",
    preferredLanguages: [] as string[]
  });

  const availableLanguages = [
    "English",
    "French", 
    "Spanish",
    "German",
    "Mandarin",
    "Dutch",
    "Russian",
    "Others"
  ];

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
    
    // Handle "Other" selections
    if (field === "university" && value === "other") {
      setShowOtherUniversity(true);
    } else if (field === "university" && value !== "other") {
      setShowOtherUniversity(false);
    }
    
    if (field === "faculty" && value === "other") {
      setShowOtherFaculty(true);
    } else if (field === "faculty" && value !== "other") {
      setShowOtherFaculty(false);
    }
    
    if (field === "department" && value === "other") {
      setShowOtherDepartment(true);
    } else if (field === "department" && value !== "other") {
      setShowOtherDepartment(false);
    }
    
    if (field === "country" && value === "other") {
      setShowOtherCountry(true);
    } else if (field === "country" && value !== "other") {
      setShowOtherCountry(false);
    }
    
    if (field === "city" && value === "other") {
      setShowOtherCity(true);
    } else if (field === "city" && value !== "other") {
      setShowOtherCity(false);
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
    
    // Simulate sending OTP
    setTimeout(() => {
      console.log("Sending OTP to:", formData.email);
      setStep(2);
      setIsLoading(false);
    }, 1500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      console.log("Verifying OTP:", otpCode);
      console.log("Registering user:", formData);
      setIsLoading(false);
      // In a real app, would redirect to dashboard or login
    }, 1500);
  };

  const resendOTP = () => {
    console.log("Resending OTP to:", formData.email);
  };

  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              ScholarConnect
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Verify your email
            </h2>
            <p className="mt-2 text-gray-600">
              Enter the 6-digit code sent to {formData.email}
            </p>
          </div>

          <div className="bg-white p-8 shadow rounded-lg">
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={setOtpCode}
                  className="justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || otpCode.length !== 6}>
                {isLoading ? "Verifying..." : "Verify and Create Account"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Didn't receive the code? </span>
                <button
                  type="button"
                  onClick={resendOTP}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Resend
                </button>
              </div>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ← Back to registration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ScholarConnect
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
                  <div>
                    <Label>I am a:</Label>
                    <RadioGroup 
                      defaultValue="student" 
                      className="flex space-x-4 mt-2"
                      onValueChange={setAccountType}
                      required
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student" className="cursor-pointer">Student</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="researcher" id="researcher" />
                        <Label htmlFor="researcher" className="cursor-pointer">Researcher</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="research-aid" id="research-aid" />
                        <Label htmlFor="research-aid" className="cursor-pointer">Research Aid</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {accountType === "student" && (
                    <div className="space-y-2">
                      <Label htmlFor="profilePicture">Profile Picture *</Label>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={profileImage} />
                          <AvatarFallback>
                            <Camera className="h-8 w-8 text-gray-400" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <input
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            required
                          />
                          <Label htmlFor="profilePicture" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Upload Photo
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Select onValueChange={(value) => handleInputChange("title", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dr">Dr</SelectItem>
                          <SelectItem value="prof">Prof</SelectItem>
                          <SelectItem value="mr">Mr</SelectItem>
                          <SelectItem value="mrs">Mrs</SelectItem>
                          <SelectItem value="miss">Miss</SelectItem>
                          <SelectItem value="ms">Ms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name *</Label>
                      <Input 
                        id="firstName" 
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name *</Label>
                      <Input 
                        id="lastName" 
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sex *</Label>
                      <Select onValueChange={(value) => handleInputChange("sex", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact (WhatsApp) *</Label>
                      <Input 
                        id="contact" 
                        type="tel" 
                        placeholder="+237 XXX XXX XXX"
                        value={formData.contact}
                        onChange={(e) => handleInputChange("contact", e.target.value)}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Languages *</Label>
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {availableLanguages.map((language) => (
                          <div key={language} className="flex items-center space-x-2">
                            <Checkbox 
                              id={language}
                              checked={selectedLanguages.includes(language)}
                              onCheckedChange={() => handleLanguageToggle(language)}
                            />
                            <Label htmlFor={language} className="cursor-pointer text-sm">
                              {language}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {selectedLanguages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                          {selectedLanguages.map((language) => (
                            <Badge key={language} variant="secondary" className="flex items-center gap-1">
                              {language}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeLanguage(language)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {accountType === "student" && (
                    <div className="space-y-2">
                      <Label htmlFor="academicLevel">Academic Level *</Label>
                      <Select onValueChange={(value) => handleInputChange("academicLevel", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select academic level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hnd">Higher National Diploma (HND)</SelectItem>
                          <SelectItem value="undergraduate">Undergraduate</SelectItem>
                          <SelectItem value="postgraduate">Postgraduate</SelectItem>
                          <SelectItem value="postdoc">Post Doctorate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
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

                  <div className="space-y-2">
                    <Label htmlFor="university">University *</Label>
                    <Select onValueChange={(value) => handleInputChange("university", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select university" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="university-yaounde-1">University of Yaoundé I</SelectItem>
                        <SelectItem value="university-yaounde-2">University of Yaoundé II</SelectItem>
                        <SelectItem value="university-douala">University of Douala</SelectItem>
                        <SelectItem value="university-buea">University of Buea</SelectItem>
                        <SelectItem value="university-bamenda">University of Bamenda</SelectItem>
                        <SelectItem value="university-dschang">University of Dschang</SelectItem>
                        <SelectItem value="university-ngaoundere">University of Ngaoundéré</SelectItem>
                        <SelectItem value="university-maroua">University of Maroua</SelectItem>
                        <SelectItem value="catholic-university">Catholic University of Central Africa</SelectItem>
                        <SelectItem value="university-institute-gulf-guinea">University Institute of the Gulf of Guinea</SelectItem>
                        <SelectItem value="national-advanced-school-engineering">National Advanced School of Engineering</SelectItem>
                        <SelectItem value="higher-institute-sahel">Higher Institute of the Sahel</SelectItem>
                        <SelectItem value="protestant-university-central-africa">Protestant University of Central Africa</SelectItem>
                        <SelectItem value="catholic-university-cameroon">Catholic University of Cameroon</SelectItem>
                        <SelectItem value="university-mountains">University of the Mountains</SelectItem>
                        <SelectItem value="adventist-university-cosendai">Adventist University of Cosendai</SelectItem>
                        <SelectItem value="higher-institute-commerce-management">Higher Institute of Commerce and Management</SelectItem>
                        <SelectItem value="international-university-central-africa">International University of Central Africa</SelectItem>
                        <SelectItem value="panafricain-institute-development">Pan-African Institute for Development</SelectItem>
                        <SelectItem value="fotso-victor-university-technology">Fotso Victor University of Technology</SelectItem>
                        <SelectItem value="hims">Higher Institute of Management Sciences (HIMS)</SelectItem>
                        <SelectItem value="hibmat">Higher Institute of Business Management and Technology (HIBMAT)</SelectItem>
                        <SelectItem value="hibs">Higher Institute of Business Studies (HIBS)</SelectItem>
                        <SelectItem value="rhims">Regional Higher Institute of Management Sciences (RHIMS)</SelectItem>
                        <SelectItem value="iheps">Institute of Higher Education and Professional Studies (IHEPS)</SelectItem>
                        <SelectItem value="isma">Institute of Management Sciences (ISMA)</SelectItem>
                        <SelectItem value="iuct">International University of Central Africa Technology (IUCT)</SelectItem>
                        <SelectItem value="ista">Institute of Applied Technology (ISTA)</SelectItem>
                        <SelectItem value="isab">Institute of Business Administration (ISAB)</SelectItem>
                        <SelectItem value="istag">Institute of Technology and Applied Management (ISTAG)</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {showOtherUniversity && (
                      <Input 
                        placeholder="Enter university name"
                        value={formData.customUniversity}
                        onChange={(e) => handleInputChange("customUniversity", e.target.value)}
                        required
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="faculty">Faculty *</Label>
                      <Select onValueChange={(value) => handleInputChange("faculty", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="science">Faculty of Science</SelectItem>
                          <SelectItem value="arts">Faculty of Arts</SelectItem>
                          <SelectItem value="medicine">Faculty of Medicine</SelectItem>
                          <SelectItem value="engineering">Faculty of Engineering</SelectItem>
                          <SelectItem value="law">Faculty of Law</SelectItem>
                          <SelectItem value="economics">Faculty of Economics</SelectItem>
                          <SelectItem value="education">Faculty of Education</SelectItem>
                          <SelectItem value="agriculture">Faculty of Agriculture</SelectItem>
                          <SelectItem value="social-sciences">Faculty of Social Sciences</SelectItem>
                          <SelectItem value="business">Faculty of Business</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {showOtherFaculty && (
                        <Input 
                          placeholder="Enter faculty name"
                          value={formData.customFaculty}
                          onChange={(e) => handleInputChange("customFaculty", e.target.value)}
                          required
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select onValueChange={(value) => handleInputChange("department", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="computer-science">Computer Science</SelectItem>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="biology">Biology</SelectItem>
                          <SelectItem value="english">English Language</SelectItem>
                          <SelectItem value="french">French Language</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                          <SelectItem value="philosophy">Philosophy</SelectItem>
                          <SelectItem value="psychology">Psychology</SelectItem>
                          <SelectItem value="sociology">Sociology</SelectItem>
                          <SelectItem value="economics">Economics</SelectItem>
                          <SelectItem value="accounting">Accounting</SelectItem>
                          <SelectItem value="management">Management</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {showOtherDepartment && (
                        <Input 
                          placeholder="Enter department name"
                          value={formData.customDepartment}
                          onChange={(e) => handleInputChange("customDepartment", e.target.value)}
                          required
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Select onValueChange={(value) => handleInputChange("country", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cameroon">Cameroon</SelectItem>
                          <SelectItem value="nigeria">Nigeria</SelectItem>
                          <SelectItem value="ghana">Ghana</SelectItem>
                          <SelectItem value="kenya">Kenya</SelectItem>
                          <SelectItem value="south-africa">South Africa</SelectItem>
                          <SelectItem value="senegal">Senegal</SelectItem>
                          <SelectItem value="ivory-coast">Ivory Coast</SelectItem>
                          <SelectItem value="burkina-faso">Burkina Faso</SelectItem>
                          <SelectItem value="mali">Mali</SelectItem>
                          <SelectItem value="chad">Chad</SelectItem>
                          <SelectItem value="gabon">Gabon</SelectItem>
                          <SelectItem value="equatorial-guinea">Equatorial Guinea</SelectItem>
                          <SelectItem value="central-african-republic">Central African Republic</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {showOtherCountry && (
                        <Input 
                          placeholder="Enter country name"
                          value={formData.customCountry}
                          onChange={(e) => handleInputChange("customCountry", e.target.value)}
                          required
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Select onValueChange={(value) => handleInputChange("city", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yaounde">Yaoundé</SelectItem>
                          <SelectItem value="douala">Douala</SelectItem>
                          <SelectItem value="bamenda">Bamenda</SelectItem>
                          <SelectItem value="bafoussam">Bafoussam</SelectItem>
                          <SelectItem value="garoua">Garoua</SelectItem>
                          <SelectItem value="maroua">Maroua</SelectItem>
                          <SelectItem value="ngaoundere">Ngaoundéré</SelectItem>
                          <SelectItem value="bertoua">Bertoua</SelectItem>
                          <SelectItem value="ebolowa">Ebolowa</SelectItem>
                          <SelectItem value="kumba">Kumba</SelectItem>
                          <SelectItem value="limbe">Limbe</SelectItem>
                          <SelectItem value="buea">Buea</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {showOtherCity && (
                        <Input 
                          placeholder="Enter city name"
                          value={formData.customCity}
                          onChange={(e) => handleInputChange("customCity", e.target.value)}
                          required
                        />
                      )}
                    </div>
                  </div>
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
                      <SelectItem value="stanford">Stanford University</SelectItem>
                      <SelectItem value="mit">Massachusetts Institute of Technology</SelectItem>
                      <SelectItem value="harvard">Harvard University</SelectItem>
                      <SelectItem value="berkeley">UC Berkeley</SelectItem>
                      <SelectItem value="oxford">University of Oxford</SelectItem>
                      <SelectItem value="cambridge">University of Cambridge</SelectItem>
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
