
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CredentialsSectionProps {
  formData: {
    experience: string;
    linkedInUrl: string;
  };
  onInputChange: (field: string, value: string | boolean) => void;
  onSetCvFile: (file: File | null) => void;
  onSetCertFile: (file: File | null) => void;
}

const CredentialsSection = ({
  formData,
  onInputChange,
  onSetCvFile,
  onSetCertFile
}: CredentialsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">Professional Credentials</h3>
      
      <div>
        <Label htmlFor="cv">Upload CV/Resume *</Label>
        <Input 
          id="cv" 
          type="file" 
          accept=".pdf,.docx"
          onChange={(e) => onSetCvFile(e.target.files?.[0] || null)}
          required
        />
        <p className="text-xs text-gray-500 mt-1">PDF, DOCX only</p>
      </div>

      <div>
        <Label>Years of Experience *</Label>
        <Select onValueChange={(value) => onInputChange("experience", value)} required>
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
          onChange={(e) => onSetCertFile(e.target.files?.[0] || null)}
        />
        <p className="text-xs text-gray-500 mt-1">Optional</p>
      </div>

      <div>
        <Label htmlFor="linkedInUrl">LinkedIn / Personal Website</Label>
        <Input 
          id="linkedInUrl"
          type="url"
          value={formData.linkedInUrl}
          onChange={(e) => onInputChange("linkedInUrl", e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
        />
        <p className="text-xs text-gray-500 mt-1">Optional</p>
      </div>
    </div>
  );
};

export default CredentialsSection;
