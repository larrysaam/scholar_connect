
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-2xl font-bold mb-4">Welcome to ScholarConnect!</h1>
              <p className="text-gray-600 mb-6">
                Your student account has been created successfully. You can now access your personalized dashboard 
                to browse expert support, track progress, and request consultations or mentorship.
              </p>
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
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
                  {/* Section 1: Personal Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">🔸 Personal Details</h3>
                    
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input 
                        id="fullName" 
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
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
                          placeholder="your.email@university.edu"
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
                        <p className="text-xs text-gray-500 mt-1">Optional but encouraged for ease</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Country of Study *</Label>
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
                        <Label htmlFor="institution">Institution Name *</Label>
                        <Input 
                          id="institution"
                          value={formData.institution}
                          onChange={(e) => handleInputChange("institution", e.target.value)}
                          placeholder="University of..."
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Typeahead or free input</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="faculty">Faculty / Department</Label>
                        <Input 
                          id="faculty"
                          value={formData.faculty}
                          onChange={(e) => handleInputChange("faculty", e.target.value)}
                          placeholder="e.g., Faculty of Science"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional</p>
                      </div>
                      
                      <div>
                        <Label>Level of Study *</Label>
                        <Select onValueChange={(value) => handleInputChange("studyLevel", value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bachelors">Bachelors</SelectItem>
                            <SelectItem value="masters">Masters</SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                            <SelectItem value="postdoc">Post-Doctoral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Sex</Label>
                        <Select onValueChange={(value) => handleInputChange("sex", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Date of Birth</Label>
                        <Input 
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional, but useful for analytics</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Academic Interests */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">🔸 Academic Interests</h3>
                    
                    <div>
                      <Label>Research Area(s) (Select multiple)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 border rounded-lg max-h-48 overflow-y-auto">
                        {researchAreaOptions.map((area) => (
                          <div key={area} className="flex items-center space-x-2">
                            <Checkbox
                              id={area}
                              checked={formData.researchAreas.includes(area)}
                              onCheckedChange={() => toggleResearchArea(area)}
                            />
                            <Label htmlFor={area} className="text-sm">
                              {area}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      {formData.researchAreas.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.researchAreas.map((area) => (
                            <Badge key={area} variant="secondary" className="flex items-center space-x-1">
                              <span>{area}</span>
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeResearchArea(area)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="topicTitle">Topic or Working Title</Label>
                      <Textarea 
                        id="topicTitle"
                        value={formData.topicTitle}
                        onChange={(e) => handleInputChange("topicTitle", e.target.value)}
                        placeholder="Describe your research topic or working title..."
                        className="min-h-[80px]"
                      />
                      <p className="text-xs text-gray-500 mt-1">Optional, helps personalize offers</p>
                    </div>

                    <div>
                      <Label>Stage of Research</Label>
                      <Select onValueChange={(value) => handleInputChange("researchStage", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select research stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="just-starting">Just starting</SelectItem>
                          <SelectItem value="proposal">Proposal</SelectItem>
                          <SelectItem value="data-collection">Data collection</SelectItem>
                          <SelectItem value="analysis">Analysis</SelectItem>
                          <SelectItem value="writing">Writing</SelectItem>
                          <SelectItem value="revision">Revision</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Create Your Account */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Create Your Account</h3>
                    
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

                  {/* Agreement Section */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
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
                      Create My Student Account
                    </Button>
                    
                    <p className="text-sm text-gray-600 text-center">
                      Once signed up, you'll be taken to a personalized dashboard where you can browse expert support, 
                      track progress, and request consultations or mentorship.
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

export default Register;
