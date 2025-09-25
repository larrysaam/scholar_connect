import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCoauthors, createProject, inviteCoauthorDirect } from "@/hooks/useCoauthors";

interface CoAuthorInvitationModalProps {
  researcher: {
    id: string;
    name: string;
  };
}

const CoAuthorInvitationModal = ({ researcher }: CoAuthorInvitationModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    problemStatement: "",
    researchObjectives: "",
    researchHypothesis: "",
    countries: "",
    description: "",
    type: "Journal Article",
    visibility: "Private"
  });
  const [loading, setLoading] = useState(false);
  const coauthorHooks = useCoauthors("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.problemStatement || !formData.researchObjectives) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Title, Problem Statement, Research Objectives)",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    // 1. Create project in DB
    const projectRes = await createProject({
      title: formData.title,
      description: formData.problemStatement + '\n' + formData.researchObjectives + (formData.researchHypothesis ? ('\nHypothesis: ' + formData.researchHypothesis) : ''),
      type: formData.type,
      visibility: formData.visibility
    });
    if (projectRes.error || !projectRes.data?.id) {
      setLoading(false);
      toast({ title: "Error", description: projectRes.error?.message || "Failed to create project", variant: "destructive" });
      return;
    }
    const projectId = projectRes.data.id;
    try {
      const message = `Title: ${formData.title}\nProblem: ${formData.problemStatement}\nObjectives: ${formData.researchObjectives}\nHypothesis: ${formData.researchHypothesis}\nCountries: ${formData.countries}`;
      const result = await inviteCoauthorDirect({
        projectId,
        inviterId: user?.id,
        inviteeId: researcher.id,
        message
      });
      setLoading(false);
      if (result.error) {
        toast({ title: "Error", description: result.error.message, variant: "destructive" });
        return;
      }
      toast({
        title: "Invitation Sent!",
        description: `Your co-author invitation has been sent to ${researcher.name}. They will receive a notification with your research details.`,
      });
      setIsOpen(false);
      setFormData({
        title: "",
        problemStatement: "",
        researchObjectives: "",
        researchHypothesis: "",
        countries: "",
        description: "",
        type: "Journal Article",
        visibility: "Private"
      });
    } catch (err: any) {
      setLoading(false);
      toast({ title: "Error", description: err.message || "Failed to send invitation", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Users className="h-4 w-4 mr-2" />
          Invite to Co-Author
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite {researcher.name} to Co-Author</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="title" className="font-medium">Research Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter your research title..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="problemStatement" className="font-medium">Problem Statement *</Label>
            <Textarea
              id="problemStatement"
              value={formData.problemStatement}
              onChange={(e) => handleInputChange('problemStatement', e.target.value)}
              placeholder="Describe the research problem or gap you're addressing..."
              rows={3}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="researchObjectives" className="font-medium">Research Objectives *</Label>
            <Textarea
              id="researchObjectives"
              value={formData.researchObjectives}
              onChange={(e) => handleInputChange('researchObjectives', e.target.value)}
              placeholder="List your main research objectives..."
              rows={3}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="researchHypothesis" className="font-medium">Research Hypothesis</Label>
            <Textarea
              id="researchHypothesis"
              value={formData.researchHypothesis}
              onChange={(e) => handleInputChange('researchHypothesis', e.target.value)}
              placeholder="State your research hypothesis (if applicable)..."
              rows={2}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="countries" className="font-medium">Country(ies) Location(s)</Label>
            <Input
              id="countries"
              value={formData.countries}
              onChange={(e) => handleInputChange('countries', e.target.value)}
              placeholder="e.g., Cameroon, Nigeria, Chad..."
              className="mt-1"
            />
          </div>
          {/* Optionally add project type/visibility fields here if you want to expose them */}
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!formData.title || !formData.problemStatement || !formData.researchObjectives || loading}
          >
            {loading ? 'Sending...' : 'Send Co-Author Invitation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoAuthorInvitationModal;
