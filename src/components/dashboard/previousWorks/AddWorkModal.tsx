
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
        <Button className="w-full sm:w-auto text-xs sm:text-sm px-3 sm:px-4">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Include Previous Work</span>
          <span className="sm:hidden">Add Work</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-w-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm sm:text-base">Add Previous Work</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 sm:space-y-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="title" className="text-sm">Project Title *</Label>
              <Input
                id="title"
                value={newWork.title}
                onChange={(e) => onNewWorkChange({ ...newWork, title: e.target.value })}
                placeholder="Enter project title"
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-sm">Category</Label>
              <Input
                id="category"
                value={newWork.category}
                onChange={(e) => onNewWorkChange({ ...newWork, category: e.target.value })}
                placeholder="e.g., Research, Analysis"
                className="text-sm"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description" className="text-sm">Description *</Label>
            <Textarea
              id="description"
              value={newWork.description}
              onChange={(e) => onNewWorkChange({ ...newWork, description: e.target.value })}
              placeholder="Describe the project and your role"
              rows={3}
              className="text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="institution" className="text-sm">Institution/Client</Label>
              <Input
                id="institution"
                value={newWork.institution}
                onChange={(e) => onNewWorkChange({ ...newWork, institution: e.target.value })}
                placeholder="Organization name"
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="duration" className="text-sm">Duration</Label>
              <Input
                id="duration"
                value={newWork.duration}
                onChange={(e) => onNewWorkChange({ ...newWork, duration: e.target.value })}
                placeholder="e.g., 3 months"
                className="text-sm"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="outcomes" className="text-sm">Key Outcomes</Label>
            <Textarea
              id="outcomes"
              value={newWork.outcomes}
              onChange={(e) => onNewWorkChange({ ...newWork, outcomes: e.target.value })}
              placeholder="List key achievements or deliverables"
              rows={2}
              className="text-sm resize-none"
            />
          </div>
          <div>
            <Label htmlFor="file" className="text-sm">Upload File (Optional)</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => onNewWorkChange({ ...newWork, file: e.target.files ? e.target.files[0] : null })}
              className="text-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 pt-2">
            <Button onClick={onAddWork} className="w-full sm:flex-1 text-sm">
              Add Work
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:flex-1 text-sm">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkModal;
