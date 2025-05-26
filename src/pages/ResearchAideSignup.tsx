
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
import { X, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ResearchAideSignup = () => {
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    sex: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    country: "",
    qualification: "",
    academicRank: "",
    fieldsOfExpertise: [] as string[],
    institution: "",
    experience: "",
    orcidUrl: "",
    researchGateUrl: "",
    linkedInUrl: "",
    agreedToTerms: false
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const fieldOptions = [
    "Education", "Health Sciences", "Engineering", "Social Sciences", "Natural Sciences",
    "Agriculture", "Economics", "Geography", "Psychology", "Computer Science",
    "Mathematics", "Physics", "Chemistry", "Biology", "Literature", "History"
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleField = (field: string) => {
    setFormData(prev => ({
      ...prev,
      fieldsOfExpertise: prev.fieldsOfExpertise.includes(field)
        ? prev.fieldsOfExpertise.filter(f => f !== field)
        : [...prev.fieldsOfExpertise, field]
    }));
  };

  const removeField = (field: string) => {
    setFormData(prev => ({
      ...prev,
      fieldsOfExpertise: prev.fieldsOfExpertise.filter(f => f !== field)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Researcher signup:", formData);
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
              <h1 className="text-2xl font-bold mb-4">
                Thank you, {formData.title} {formData.fullName}!
              </h1>
              <p className="text-gray-600 mb-6">
                Your application has been received. Our team will review your profile within 2–3 business days. 
                You'll receive an email once approved.
              </p>
              <Button asChild>
                <Link to="/">Return to Home</Link>
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
                  <CardTitle className="text-2xl text-center">Join as a Researcher</CardTitle>
                  <p className="text-gray-600 text-center">
                    Share your expertise and connect with students seeking academic guidance
                  </p>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Section 1: Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">🔐 Personal Information</h3>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
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
                            <SelectItem value="ms">Ms</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input 
                          id="fullName" 
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          placeholder="As shown on academic documents"
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
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
                      
                      <div>
                        <Label>Date of Birth *</Label>
                        <Input 
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          required 
                        />
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
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your.email@university.edu"
                          required 
                        />
                        <p className="text-xs text-gray-500 mt-1">Verification sent after sign-up</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="phoneNumber">Phone Number *</Label>
                        <Input 
                          id="phoneNumber" 
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                          placeholder="+237 6XX XXX XXX"
                          required 
                        />
                        <p className="text-xs text-gray-500 mt-1">For internal use only</p>
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
                  </div>

                  {/* Section 2: Academic & Professional Background */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">🎓 Academic & Professional Background</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Highest Qualification *</Label>
                        <Select onValueChange={(value) => handleInputChange("qualification", value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select qualification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="phd">PhD</SelectItem>
                            <SelectItem value="doctorate">Doctorate</SelectItem>
                            <SelectItem value="masters">Master's Degree</SelectItem>
                            <SelectItem value="postdoc">Post-Doctoral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="academicRank">Academic Rank</Label>
                        <Input 
                          id="academicRank"
                          value={formData.academicRank}
                          onChange={(e) => handleInputChange("academicRank", e.target.value)}
                          placeholder="e.g., Associate Professor, Senior Lecturer"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Field of Expertise * (Select multiple)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 border rounded-lg max-h-48 overflow-y-auto">
                        {fieldOptions.map((field) => (
                          <div key={field} className="flex items-center space-x-2">
                            <Checkbox
                              id={field}
                              checked={formData.fieldsOfExpertise.includes(field)}
                              onCheckedChange={() => toggleField(field)}
                            />
                            <Label htmlFor={field} className="text-sm">
                              {field}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      {formData.fieldsOfExpertise.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.fieldsOfExpertise.map((field) => (
                            <Badge key={field} variant="secondary" className="flex items-center space-x-1">
                              <span>{field}</span>
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeField(field)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="institution">Current Institution or Affiliation</Label>
                        <Input 
                          id="institution"
                          value={formData.institution}
                          onChange={(e) => handleInputChange("institution", e.target.value)}
                          placeholder="University/Organization (Optional)"
                        />
                      </div>
                      
                      <div>
                        <Label>Years of Experience *</Label>
                        <Select onValueChange={(value) => handleInputChange("experience", value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-3">1–3 years</SelectItem>
                            <SelectItem value="4-6">4–6 years</SelectItem>
                            <SelectItem value="7-10">7–10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cv">Upload CV *</Label>
                      <div className="mt-2">
                        <Input 
                          id="cv" 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">PDF or DOC format</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Professional URLs (One or more allowed)</Label>
                      <div className="space-y-2">
                        <Input 
                          placeholder="ORCID URL"
                          value={formData.orcidUrl}
                          onChange={(e) => handleInputChange("orcidUrl", e.target.value)}
                        />
                        <Input 
                          placeholder="ResearchGate URL"
                          value={formData.researchGateUrl}
                          onChange={(e) => handleInputChange("researchGateUrl", e.target.value)}
                        />
                        <Input 
                          placeholder="LinkedIn URL"
                          value={formData.linkedInUrl}
                          onChange={(e) => handleInputChange("linkedInUrl", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Agreement Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={formData.agreedToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked)}
                        required 
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to ScholarConnect's Terms of Use and Privacy Policy *
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
