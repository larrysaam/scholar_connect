
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CoAuthorModalProps {
  researcher: {
    name: string;
  };
}

const CoAuthorModal = ({ researcher }: CoAuthorModalProps) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [formData, setFormData] = useState({
    researchTopic: "",
    researchProblem: "",
    objectives: "",
    methodology: "",
    roles: "",
    nextSteps: ""
  });

  const publicationTypes = ["Article", "Conference Paper", "Policy Paper", "Book", "Book Chapter"];

  const handleSubmit = () => {
    console.log("Co-author invitation submitted:", { selectedType, formData });
    // In a real app, this would send the invitation
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50">
          Invitation to Co-author
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite {researcher.name} to Co-author</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="text-base font-semibold">Publication Type</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {publicationTypes.map((type) => (
                <Badge
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="researchTopic" className="text-base font-semibold">Research Topic</Label>
            <p className="text-sm text-gray-600 mb-2">A quick summary of what the research is about.</p>
            <Textarea
              id="researchTopic"
              placeholder="Briefly describe your research topic..."
              value={formData.researchTopic}
              onChange={(e) => setFormData({...formData, researchTopic: e.target.value})}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="researchProblem" className="text-base font-semibold">Research Problem / Gap (brief)</Label>
            <p className="text-sm text-gray-600 mb-2">What specific issue or question the research will address.</p>
            <Textarea
              id="researchProblem"
              placeholder="Describe the research problem or gap..."
              value={formData.researchProblem}
              onChange={(e) => setFormData({...formData, researchProblem: e.target.value})}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="objectives" className="text-base font-semibold">Objectives (brief)</Label>
            <p className="text-sm text-gray-600 mb-2">What you want to achieve with the research.</p>
            <Textarea
              id="objectives"
              placeholder="List your research objectives..."
              value={formData.objectives}
              onChange={(e) => setFormData({...formData, objectives: e.target.value})}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="methodology" className="text-base font-semibold">Methodology (brief)</Label>
            <p className="text-sm text-gray-600 mb-2">How you plan to carry out the research (e.g., interviews, surveys, data analysis).</p>
            <Textarea
              id="methodology"
              placeholder="Describe your research methodology..."
              value={formData.methodology}
              onChange={(e) => setFormData({...formData, methodology: e.target.value})}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="roles" className="text-base font-semibold">Roles</Label>
            <p className="text-sm text-gray-600 mb-2">How you think you both could contribute.</p>
            <Textarea
              id="roles"
              placeholder="Describe the roles and contributions for both parties..."
              value={formData.roles}
              onChange={(e) => setFormData({...formData, roles: e.target.value})}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="nextSteps" className="text-base font-semibold">Next Steps</Label>
            <p className="text-sm text-gray-600 mb-2">Suggest a quick chat or meeting to discuss details.</p>
            <Textarea
              id="nextSteps"
              placeholder="Suggest next steps for collaboration..."
              value={formData.nextSteps}
              onChange={(e) => setFormData({...formData, nextSteps: e.target.value})}
              className="mt-1"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Send Co-author Invitation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoAuthorModal;
