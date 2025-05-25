
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AcademicFieldsProps {
  accountType: string;
  formData: any;
  onInputChange: (field: string, value: string) => void;
  cameroonUniversities: string[];
  showOtherDepartment: boolean;
}

const AcademicFields = ({ 
  accountType, 
  formData, 
  onInputChange, 
  cameroonUniversities, 
  showOtherDepartment 
}: AcademicFieldsProps) => {
  if (accountType === "research-aid") {
    return (
      <div className="space-y-2">
        <Label htmlFor="company">Company/Organization *</Label>
        <Input 
          id="company" 
          placeholder="Enter your company or organization"
          value={formData.company}
          onChange={(e) => onInputChange("company", e.target.value)}
          required 
        />
      </div>
    );
  }

  if (accountType === "student" || accountType === "researcher") {
    return (
      <>
        {accountType === "student" && (
          <div className="space-y-2">
            <Label htmlFor="academicLevel">Academic Level *</Label>
            <Select onValueChange={(value) => onInputChange("academicLevel", value)} required>
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

        <div className="space-y-2">
          <Label htmlFor="university">University *</Label>
          <Select onValueChange={(value) => onInputChange("university", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select university" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {cameroonUniversities.map((university) => (
                <SelectItem key={university} value={university}>{university}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="faculty">Faculty *</Label>
            <Select onValueChange={(value) => onInputChange("faculty", value)} required>
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select onValueChange={(value) => onInputChange("department", value)} required>
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
                onChange={(e) => onInputChange("customDepartment", e.target.value)}
                className="mt-2"
                required
              />
            )}
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default AcademicFields;
