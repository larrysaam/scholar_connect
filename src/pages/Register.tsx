
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

const Register = () => {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    sex: "",
    email: "",
    password: "",
    contact: "",
    university: "",
    faculty: "",
    department: "",
    country: "",
    city: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              ResearchConnect
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
            ResearchConnect
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
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student" className="cursor-pointer">Student</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="researcher" id="researcher" />
                        <Label htmlFor="researcher" className="cursor-pointer">Researcher</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Select onValueChange={(value) => handleInputChange("title", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dr">Dr</SelectItem>
                          <SelectItem value="prof">Prof</SelectItem>
                          <SelectItem value="mr">Mr</SelectItem>
                          <SelectItem value="mrs">Mrs</SelectItem>
                          <SelectItem value="miss">Miss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input 
                        id="firstName" 
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
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
                      <Label>Sex</Label>
                      <RadioGroup 
                        className="flex space-x-4 mt-2"
                        onValueChange={(value) => handleInputChange("sex", value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="cursor-pointer">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="cursor-pointer">Female</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact (WhatsApp)</Label>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
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
                      <Label htmlFor="password">Password</Label>
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
                    <Label htmlFor="university">University</Label>
                    <Input 
                      id="university" 
                      placeholder="e.g., University of Yaoundé I" 
                      value={formData.university}
                      onChange={(e) => handleInputChange("university", e.target.value)}
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="faculty">Faculty</Label>
                      <Input 
                        id="faculty" 
                        placeholder="e.g., Faculty of Science" 
                        value={formData.faculty}
                        onChange={(e) => handleInputChange("faculty", e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input 
                        id="department" 
                        placeholder="e.g., Computer Science" 
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        placeholder="e.g., Cameroon" 
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        placeholder="e.g., Yaoundé" 
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        required 
                      />
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
                  <Label htmlFor="institution">Institution</Label>
                  <select 
                    id="institution"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="" disabled selected>Select your institution</option>
                    <option value="stanford">Stanford University</option>
                    <option value="mit">Massachusetts Institute of Technology</option>
                    <option value="harvard">Harvard University</option>
                    <option value="berkeley">UC Berkeley</option>
                    <option value="other">Other (specify)</option>
                  </select>
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
