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

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Join as a Research Aid</CardTitle>
                <p className="text-gray-600 text-center">
                  Share your expertise and help students with specialized research support
                </p>
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
                      <Input id="phone" placeholder="+237 6XX XXX XXX" />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="City, Country" />
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
