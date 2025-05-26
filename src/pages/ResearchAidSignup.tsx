
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ResearchAidSignup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    sex: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    country: "",
    languages: [] as string[],
    expertise: [] as string[],
    otherExpertise: "",
    experience: "",
    linkedInUrl: "",
    agreedToTerms: false
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const availableLanguages = [
    "English", "French", "Spanish", "Arabic", "Portuguese", "German", "Swahili", "Other"
  ];

  const expertiseAreas = [
    "Statistician",
    "GIS Specialist", 
    "Academic Editor",
    "Publisher or Journal Consultant",
    "Data Analyst",
    "Field Data Collector",
    "Thesis Formatter / Reference Stylist",
    "Research Assistants",
    "Transcribers",
    "Survey Tool Experts",
    "Design & Visualization",
    "Translators"
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const toggleExpertise = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }));
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const removeExpertise = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(e => e !== expertise)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Research Aid signup:", formData);
    setShowThankYou(true);
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-2xl font-bold mb-4">Welcome to ScholarConnect!</h1>
              <p className="text-gray-600 mb-6">
                Your Research Aid profile has been created. You'll receive email confirmation and 
                can now access your dashboard to complete your profile and begin receiving job requests.
              </p>
              <Button asChild>
                <Link to="/research-aids-dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
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
                    Join Our Network of Expert Research Aids
                  </CardTitle>
                  <p className="text-gray-600 text-center">
                    Support scholars across Africa with your skills in editing, data analysis, publication, and more.
                  </p>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Section 1: Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">🔸 Personal Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input 
                          id="fullName" 
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label>Sex *</Label>
                        <Select onValueChange={(value) => handleInputChange("sex", value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Date of Birth *</Label>
                      <Input 
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        required 
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your.email@example.com"
                          required 
                        />
                        <p className="text-xs text-gray-500 mt-1">Required, with verification</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="phoneNumber">Phone Number (WhatsApp)</Label>
                        <Input 
                          id="phoneNumber" 
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                          placeholder="+237 6XX XXX XXX"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional, but encouraged</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input 
                          id="password" 
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          required 
                        />
                        <p className="text-xs text-gray-500 mt-1">With strength meter</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          required 
                        />
                        <p className="text-xs text-gray-500 mt-1">Must match</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Country of Residence *</Label>
                      <Select onValueChange={(value) => handleInputChange("country", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cameroon">🇨🇲 Cameroon</SelectItem>
                          <SelectItem value="nigeria">🇳🇬 Nigeria</SelectItem>
                          <SelectItem value="ghana">🇬🇭 Ghana</SelectItem>
                          <SelectItem value="kenya">🇰🇪 Kenya</SelectItem>
                          <SelectItem value="south-africa">🇿🇦 South Africa</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Language(s) Spoken (Select multiple)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {availableLanguages.map((language) => (
                          <div key={language} className="flex items-center space-x-2">
                            <Checkbox
                              id={language}
                              checked={formData.languages.includes(language)}
                              onCheckedChange={() => toggleLanguage(language)}
                            />
                            <Label htmlFor={language} className="text-sm">
                              {language}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      {formData.languages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.languages.map((language) => (
                            <Badge key={language} variant="outline" className="flex items-center space-x-1">
                              <span>{language}</span>
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

                  {/* Section 2: Area of Expertise */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">🔸 Area of Expertise</h3>
                    
                    <div>
                      <Label>Select one or more roles:</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {expertiseAreas.map((area) => (
                          <div key={area} className="flex items-center space-x-2">
                            <Checkbox
                              id={area}
                              checked={formData.expertise.includes(area)}
                              onCheckedChange={() => toggleExpertise(area)}
                            />
                            <Label htmlFor={area} className="text-sm">
                              {area}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3">
                        <Label htmlFor="otherExpertise">Other (specify)</Label>
                        <Input 
                          id="otherExpertise"
                          value={formData.otherExpertise}
                          onChange={(e) => handleInputChange("otherExpertise", e.target.value)}
                          placeholder="Describe other expertise areas"
                        />
                      </div>
                      
                      {formData.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.expertise.map((area) => (
                            <Badge key={area} variant="secondary" className="flex items-center space-x-1">
                              <span>{area}</span>
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeExpertise(area)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 3: Professional Credentials */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Professional Credentials</h3>
                    
                    <div>
                      <Label htmlFor="cv">Upload CV/Resume *</Label>
                      <Input 
                        id="cv" 
                        type="file" 
                        accept=".pdf,.docx"
                        onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">PDF, DOCX only</p>
                    </div>

                    <div>
                      <Label>Years of Experience *</Label>
                      <Select onValueChange={(value) => handleInputChange("experience", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 30}, (_, i) => (
                            <SelectItem key={i+1} value={`${i+1}`}>{i+1} year{i !== 0 ? 's' : ''}</SelectItem>
                          ))}
                          <SelectItem value="30+">30+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="certifications">Upload Certifications (if any)</Label>
                      <Input 
                        id="certifications" 
                        type="file" 
                        accept=".pdf,.docx"
                        onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                      />
                      <p className="text-xs text-gray-500 mt-1">Optional</p>
                    </div>

                    <div>
                      <Label htmlFor="linkedInUrl">LinkedIn / Personal Website</Label>
                      <Input 
                        id="linkedInUrl"
                        type="url"
                        value={formData.linkedInUrl}
                        onChange={(e) => handleInputChange("linkedInUrl", e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                      <p className="text-xs text-gray-500 mt-1">Optional</p>
                    </div>
                  </div>

                  {/* Section 5: Verification and Agreement */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Verification and Agreement</h3>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={formData.agreedToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked)}
                        required 
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the Terms & privacy and understand that ScholarConnect does not guarantee work but provides a visibility platform. *
                      </Label>
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="captcha" required />
                        <Label htmlFor="captcha" className="text-sm">
                          I'm not a robot (CAPTCHA) *
                        </Label>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" size="lg">
                      Create My Research Aid Profile
                    </Button>
                    
                    <p className="text-sm text-gray-600 text-center">
                      Upon clicking, you'll receive email confirmation and be taken to a dashboard to complete your profile or begin receiving job requests.
                    </p>
                  </div>
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

export default ResearchAidSignup;
