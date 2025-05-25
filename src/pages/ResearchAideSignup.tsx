
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ResearchAideSignup = () => {
  const { t } = useLanguage();
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [countryCode, setCountryCode] = useState("");

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const toggleLanguage = (language: string) => {
    setLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(lang => lang !== language)
        : [...prev, language]
    );
  };

  const specializations = [
    "GIS Specialist",
    "Statistician", 
    "Cartographer",
    "Data Collector",
    "Journal Publishing Aid",
    "Academic Editor",
    "Research Methodology Consultant",
    "Literature Review Specialist"
  ];

  const availableLanguages = [
    "English",
    "French",
    "Spanish",
    "German",
    "Portuguese",
    "Arabic",
    "Chinese",
    "Dutch",
    "Russian",
    "Other"
  ];

  const countryCodes = [
    { code: "+1", country: "US/Canada" },
    { code: "+33", country: "France" },
    { code: "+44", country: "UK" },
    { code: "+49", country: "Germany" },
    { code: "+86", country: "China" },
    { code: "+91", country: "India" },
    { code: "+234", country: "Nigeria" },
    { code: "+237", country: "Cameroon" },
    { code: "+233", country: "Ghana" },
    { code: "+254", country: "Kenya" },
    { code: "+27", country: "South Africa" },
    { code: "+221", country: "Senegal" },
    { code: "+225", country: "Ivory Coast" },
    { code: "+226", country: "Burkina Faso" },
    { code: "+223", country: "Mali" },
    { code: "+235", country: "Chad" },
    { code: "+241", country: "Gabon" },
    { code: "+240", country: "Equatorial Guinea" },
    { code: "+236", country: "Central African Republic" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 mb-4">
                    <img 
                      src="/lovable-uploads/3e478490-867e-47d2-9e44-aaef66cf715c.png" 
                      alt="ScholarConnect" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <CardTitle className="text-2xl text-center">Join as a Research Aid</CardTitle>
                  <p className="text-gray-600 text-center">
                    Share your expertise and help students with specialized research support
                  </p>
                </div>
              </CardHeader>
              
              <CardContent>
                <form className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Enter your first name" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Enter your last name" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex">
                        <Select onValueChange={setCountryCode} className="w-1/3">
                          <SelectTrigger>
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] overflow-y-auto">
                            {countryCodes.map((item) => (
                              <SelectItem key={item.code} value={item.code}>
                                {item.code} {item.country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input 
                          id="phone" 
                          placeholder="XXX XXX XXX" 
                          className="ml-2 flex-1" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="City, Country" />
                    </div>

                    <div>
                      <Label htmlFor="company">Company/Organisation</Label>
                      <Input id="company" placeholder="Enter your company or organisation" />
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Professional Information</h3>
                    
                    <div>
                      <Label htmlFor="specialization">Primary Specialization</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          {specializations.map((spec) => (
                            <SelectItem key={spec} value={spec.toLowerCase().replace(/\s+/g, '-')}>
                              {spec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="education">Highest Education Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                          <SelectItem value="master">Master's Degree</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                          <SelectItem value="postdoc">Post-Doctoral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="hourlyRate">Hourly Rate (XAF)</Label>
                      <Input id="hourlyRate" type="number" placeholder="17500" />
                    </div>
                  </div>

                  {/* Skills and Expertise */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Skills and Expertise</h3>
                    
                    <div>
                      <Label htmlFor="skills">Add Skills</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="skills"
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          placeholder="Enter a skill"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <Button type="button" onClick={addSkill}>Add</Button>
                      </div>
                      
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                              <span>{skill}</span>
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeSkill(skill)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Preferred Languages (you can click more than one)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {availableLanguages.map((language) => (
                          <div key={language} className="flex items-center space-x-2">
                            <Checkbox
                              id={language}
                              checked={languages.includes(language)}
                              onCheckedChange={() => toggleLanguage(language)}
                            />
                            <Label htmlFor={language} className="text-sm">
                              {language}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      {languages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {languages.map((language) => (
                            <Badge key={language} variant="outline">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Describe your expertise, experience, and what makes you unique..."
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>

                  {/* Terms and Submit */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the Terms of Service and Privacy Policy
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="background" />
                      <Label htmlFor="background" className="text-sm">
                        I consent to background verification for platform trust and safety
                      </Label>
                    </div>
                    
                    <Button type="submit" className="w-full" size="lg">
                      Submit Application
                    </Button>
                    
                    <p className="text-sm text-gray-600 text-center">
                      Your application will be reviewed within 2-3 business days
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

export default ResearchAideSignup;
