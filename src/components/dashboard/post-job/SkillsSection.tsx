
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface SkillsSectionProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
}

const SkillsSection = ({ skills, onSkillsChange }: SkillsSectionProps) => {
  const [newSkill, setNewSkill] = useState("");

  const handleSkillAdd = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onSkillsChange([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleSkillRemove = (skill: string) => {
    onSkillsChange(skills.filter(s => s !== skill));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Required Skills</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="flex items-center gap-1">
            {skill}
            <X className="h-3 w-3 cursor-pointer" onClick={() => handleSkillRemove(skill)} />
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSkillAdd();
            }
          }}
        />
        <Button onClick={handleSkillAdd} variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SkillsSection;
