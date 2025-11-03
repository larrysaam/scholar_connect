import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useORCIDValidation } from "@/hooks/useORCIDValidation";

interface ORCIDInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const ORCIDInput = ({
  label,
  value,
  onChange,
  placeholder = "0000-0000-0000-0000",
  disabled = false,
  required = false,
  className = ""
}: ORCIDInputProps) => {
  const { error, handleORCIDChange, clearError } = useORCIDValidation(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = handleORCIDChange(e.target.value);
    onChange(newValue);
  };

  const handleFocus = () => {
    clearError();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="orcid-input">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="space-y-1">
        <Input
          id="orcid-input"
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={19} // 16 digits + 3 dashes
          className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <p className="text-xs text-gray-500">
          Enter 16 digits (dashes will be added automatically)
        </p>
      </div>
    </div>
  );
};

export default ORCIDInput;
