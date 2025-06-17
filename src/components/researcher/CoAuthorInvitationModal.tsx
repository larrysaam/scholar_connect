
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CoAuthorInvitationModalProps {
  researcher: {
    id: string;
    name: string;
  };
}

const CoAuthorInvitationModal = ({ researcher }: CoAuthorInvitationModalProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    problemStatement: "",
    researchObjectives: "",
    researchHypothesis: "",
    countries: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.problemStatement || !formData.researchObjectives) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Title, Problem Statement, Research Objectives)",
        variant: "destructive"
      });
      return;
    }

    const invitationData = {
      researcherId: researcher.id,
      researcherName: researcher.name,
      ...formData,
      dateSent: new Date().toISOString(),
      status: 'pending'
    };

    console.log("Co-author invitation sent:", invitationData);

    // Store invitation in localStorage for the researcher dashboard to access
    const existingInvitations = JSON.parse(localStorage.getItem('coauthor_invitations') || '[]');
    existingInvitations.push({
      id: Date.now().toString(),
      fromUser: {
        name: "Emmanuel Kenfack", // This would come from user context
        title: "Master's Student",
        institution: "University of Yaoundé I",
        department: "Computer Science",
        researchInterests: ["Machine Learning", "Healthcare Analytics", "Data Science"],
        publications: 2,
        hIndex: 1
      },
      publicationType: "Research Paper",
      researchTopic: formData.title,
      researchProblem: formData.problemStatement,
      objectives: formData.researchObjectives,
      methodology: "Mixed methods approach combining quantitative analysis and qualitative interviews",
      roles: "Looking for co-author collaboration on data analysis and manuscript writing",
      nextSteps: formData.researchHypothesis,
      countries: formData.countries,
      dateSent: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('coauthor_invitations', JSON.stringify(existingInvitations));

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
      countries: ""
    });
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

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!formData.title || !formData.problemStatement || !formData.researchObjectives}
          >
            Send Co-Author Invitation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoAuthorInvitationModal;
