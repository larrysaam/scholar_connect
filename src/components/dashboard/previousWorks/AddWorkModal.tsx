
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { NewWork } from "@/types/previousWorks";

interface AddWorkModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newWork: NewWork;
  onNewWorkChange: (work: NewWork) => void;
  onAddWork: () => void;
}

const AddWorkModal = ({ isOpen, onOpenChange, newWork, onNewWorkChange, onAddWork }: AddWorkModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Include Previous Work
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Previous Work</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="projectType">Project Type *</Label>
            <Select value={newWork.projectType} onValueChange={(value) => onNewWorkChange({ ...newWork, projectType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="platform">Platform Project</SelectItem>
                <SelectItem value="previous">Previous Experience</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={newWork.title}
                onChange={(e) => onNewWorkChange({ ...newWork, title: e.target.value })}
                placeholder="Enter project title"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newWork.category}
                onChange={(e) => onNewWorkChange({ ...newWork, category: e.target.value })}
                placeholder="e.g., Research, Analysis"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={newWork.description}
              onChange={(e) => onNewWorkChange({ ...newWork, description: e.target.value })}
              placeholder="Describe the project and your role"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="institution">Institution/Client</Label>
              <Input
                id="institution"
                value={newWork.institution}
                onChange={(e) => onNewWorkChange({ ...newWork, institution: e.target.value })}
                placeholder="Organization name"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={newWork.duration}
                onChange={(e) => onNewWorkChange({ ...newWork, duration: e.target.value })}
                placeholder="e.g., 3 months"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="outcomes">Key Outcomes</Label>
            <Textarea
              id="outcomes"
              value={newWork.outcomes}
              onChange={(e) => onNewWorkChange({ ...newWork, outcomes: e.target.value })}
              placeholder="List key achievements or deliverables"
              rows={2}
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={onAddWork} className="flex-1">
              Add Work
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkModal;
