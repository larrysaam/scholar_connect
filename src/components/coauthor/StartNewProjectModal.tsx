
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Mail } from "lucide-react";

interface StartNewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole: string;
}

const StartNewProjectModal = ({ open, onOpenChange, userRole }: StartNewProjectModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    visibility: false, // false = Private, true = Public
  });
  
  const [coAuthors, setCoAuthors] = useState<string[]>([]);
  const [newCoAuthor, setNewCoAuthor] = useState("");

  const researchTypes = [
    "Thesis",
    "Journal Article", 
    "Policy Brief",
    "Proposal",
    "Conference Paper",
    "Book Chapter"
  ];

  const handleAddCoAuthor = () => {
    if (newCoAuthor.trim() && !coAuthors.includes(newCoAuthor.trim())) {
      setCoAuthors([...coAuthors, newCoAuthor.trim()]);
      setNewCoAuthor("");
    }
  };

  const handleRemoveCoAuthor = (email: string) => {
    setCoAuthors(coAuthors.filter(author => author !== email));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate project ID
    const projectId = `proj_${Date.now()}`;
    
    // In real app, this would create the project in the database
    console.log("Creating project:", {
      ...formData,
      coAuthors,
      projectId
    });
    
    // Redirect to the new workspace
    window.location.href = `/workspace/${projectId}`;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      description: "",
      visibility: false,
    });
    setCoAuthors([]);
    setNewCoAuthor("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Start a New Co-Author Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter your research project title"
              required
            />
          </div>

          {/* Research Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Research Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select research type" />
              </SelectTrigger>
              <SelectContent>
                {researchTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Provide a brief description of your research project"
              rows={4}
            />
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="visibility">Project Visibility</Label>
              <p className="text-sm text-gray-600">
                {formData.visibility ? "Public - Anyone can discover and request to join" : "Private - Only invited collaborators can access"}
              </p>
            </div>
            <Switch
              id="visibility"
              checked={formData.visibility}
              onCheckedChange={(checked) => setFormData({...formData, visibility: checked})}
            />
          </div>

          {/* Add Co-Authors */}
          <div className="space-y-4">
            <Label>Add Initial Co-Authors (Optional)</Label>
            
            <div className="flex gap-2">
              <Input
                value={newCoAuthor}
                onChange={(e) => setNewCoAuthor(e.target.value)}
                placeholder="Enter email or search by name"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCoAuthor())}
              />
              <Button 
                type="button" 
                onClick={handleAddCoAuthor}
                disabled={!newCoAuthor.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Co-Authors List */}
            {coAuthors.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Co-Authors to invite:</Label>
                <div className="flex flex-wrap gap-2">
                  {coAuthors.map((author) => (
                    <Badge key={author} variant="secondary" className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {author}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveCoAuthor(author)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.title || !formData.type}
            >
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StartNewProjectModal;
