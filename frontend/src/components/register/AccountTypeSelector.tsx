
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AccountTypeSelectorProps {
  accountType: string;
  onAccountTypeChange: (value: string) => void;
}

const AccountTypeSelector = ({ accountType, onAccountTypeChange }: AccountTypeSelectorProps) => {
  return (
    <div>
      <Label>I am a:</Label>
      <RadioGroup 
        defaultValue="student" 
        className="flex space-x-4 mt-2"
        onValueChange={onAccountTypeChange}
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
  );
};

export default AccountTypeSelector;
