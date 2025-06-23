
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";

interface BasicInfoSectionProps {
  title: string;
  category: string;
  budget: string;
  onTitleChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
}

const BasicInfoSection = ({
  title,
  category,
  budget,
  onTitleChange,
  onCategoryChange,
  onBudgetChange
}: BasicInfoSectionProps) => {
  const categories = [
    "Statistics & Data Analysis",
    "GIS Specialists", 
    "Academic Editing",
    "Research Assistants",
    "Transcription Services",
    "Publishing Support",
    "Survey Tools & Design",
    "Design & Visualization",
    "Translation Services",
    "Literature Review",
    "Data Collection",
    "Report Writing"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-2">Job Title *</label>
        <Input
          placeholder="e.g., Statistical Analysis of Survey Data"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Category *</label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Budget (FCFA) *</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="e.g., 25,000"
            value={budget}
            onChange={(e) => onBudgetChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
