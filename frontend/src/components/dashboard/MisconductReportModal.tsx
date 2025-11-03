
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";

const MisconductReportModal = () => {
  const [open, setOpen] = useState(false);
  const [reportData, setReportData] = useState({
    incidentType: "",
    description: "",
    involvedParty: "",
    dateOfIncident: "",
    evidence: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting misconduct report:", reportData);
    // In a real app, this would send the report to the backend
    alert("Your report has been submitted successfully. We will investigate this matter promptly.");
    setOpen(false);
    setReportData({
      incidentType: "",
      description: "",
      involvedParty: "",
      dateOfIncident: "",
      evidence: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Report Misconduct
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Report Misconduct or Incident
          </DialogTitle>
          <DialogDescription>
            Please provide detailed information about the incident. All reports are treated confidentially and investigated promptly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="incidentType">Type of Incident</Label>
            <Select value={reportData.incidentType} onValueChange={(value) => setReportData(prev => ({ ...prev, incidentType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="discrimination">Discrimination</SelectItem>
                <SelectItem value="unprofessional-conduct">Unprofessional Conduct</SelectItem>
                <SelectItem value="academic-misconduct">Academic Misconduct</SelectItem>
                <SelectItem value="inappropriate-content">Inappropriate Content</SelectItem>
                <SelectItem value="fraud">Fraud or Misrepresentation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="involvedParty">Person(s) Involved</Label>
            <Input
              id="involvedParty"
              value={reportData.involvedParty}
              onChange={(e) => setReportData(prev => ({ ...prev, involvedParty: e.target.value }))}
              placeholder="Name or username of the person involved"
              required
            />
          </div>

          <div>
            <Label htmlFor="dateOfIncident">Date of Incident</Label>
            <Input
              id="dateOfIncident"
              type="date"
              value={reportData.dateOfIncident}
              onChange={(e) => setReportData(prev => ({ ...prev, dateOfIncident: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              value={reportData.description}
              onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Please provide a detailed description of what happened..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="evidence">Evidence or Additional Information</Label>
            <Textarea
              id="evidence"
              value={reportData.evidence}
              onChange={(e) => setReportData(prev => ({ ...prev, evidence: e.target.value }))}
              placeholder="Any additional evidence, screenshots, or relevant information..."
              rows={3}
            />
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> False reports or misuse of this system may result in account suspension. 
              All reports are logged and investigated thoroughly.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Submit Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MisconductReportModal;
