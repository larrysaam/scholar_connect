import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Edit, 
  Trash2, 
  Eye, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Users, 
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Search
} from "lucide-react";
import { useJobManagement, Job, CreateJobData } from "@/hooks/useJobManagement";
import { formatDistanceToNow } from "date-fns";

const JobManagement = () => {
  const { jobs, loading, updateJob, updateJobStatus, deleteJob, updating } = useJobManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<CreateJobData>>({});

  // Filter jobs based on search and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setEditFormData({
      title: job.title,
      description: job.description,
      category: job.category,
      budget: job.budget,
      location: job.location || "",
      duration: job.duration || "",
      skills_required: job.skills_required,
      experience_level: job.experience_level || "",
      urgency: job.urgency,
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ""
    });
  };

  const handleUpdateJob = async () => {
    if (!editingJob || !editFormData.title || !editFormData.description) return;

    const success = await updateJob(editingJob.id, editFormData);
    if (success) {
      setEditingJob(null);
      setEditFormData({});
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: Job['status']) => {
    await updateJobStatus(jobId, newStatus);
  };

  const handleDeleteJob = async (jobId: string) => {
    await deleteJob(jobId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading your jobs...</div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Job Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs by title, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              {jobs.length === 0 
                ? "You haven't posted any jobs yet. Create your first job posting!"
                : "No jobs match your search criteria."
              }
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Job Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.category}</p>
                      </div>
                      <Badge className={getStatusColor(job.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(job.status)}
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </div>
                      </Badge>
                    </div>

                    <p className="text-gray-700 line-clamp-2">{job.description}</p>

                    {/* Job Details */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.budget.toLocaleString()} {job.currency}
                      </div>
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                      )}
                      {job.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.duration}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.applications_count} applications
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                      </div>
                    </div>

                    {/* Skills */}
                    {job.skills_required.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.skills_required.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills_required.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skills_required.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    {job.status !== 'closed' && job.status !== 'completed' && job.status !== 'cancelled' && (
                      <>
                        {/* Status Actions */}
                        <div className="flex gap-1">
                          {job.status === 'active' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(job.id, 'paused')}
                                  className="flex-1"
                                >
                                  <Pause className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Pause Job</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {job.status === 'paused' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(job.id, 'active')}
                                  className="flex-1"
                                >
                                  <Play className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Resume Job</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {(job.status === 'active' || job.status === 'paused') && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(job.id, 'completed')}
                                  className="flex-1"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mark as Completed</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>

                        {/* Edit/Delete Actions */}
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditJob(job)}
                                    className="flex-1"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Job</DialogTitle>
                                <DialogDescription>
                                  Update your job posting details
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="edit-title">Job Title</Label>
                                  <Input
                                    id="edit-title"
                                    value={editFormData.title || ""}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Enter job title"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-category">Category</Label>
                                  <Select
                                    value={editFormData.category || ""}
                                    onValueChange={(value) => setEditFormData(prev => ({ ...prev, category: value }))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="data-analysis">Data Analysis</SelectItem>
                                      <SelectItem value="research-writing">Research Writing</SelectItem>
                                      <SelectItem value="literature-review">Literature Review</SelectItem>
                                      <SelectItem value="statistical-analysis">Statistical Analysis</SelectItem>
                                      <SelectItem value="survey-design">Survey Design</SelectItem>
                                      <SelectItem value="transcription">Transcription</SelectItem>
                                      <SelectItem value="translation">Translation</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="edit-budget">Budget (XAF)</Label>
                                  <Input
                                    id="edit-budget"
                                    type="number"
                                    value={editFormData.budget || ""}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                                    placeholder="Enter budget amount"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    value={editFormData.description || ""}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe your job requirements"
                                    rows={4}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-location">Location</Label>
                                    <Input
                                      id="edit-location"
                                      value={editFormData.location || ""}
                                      onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                                      placeholder="e.g., Remote, Yaoundé"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-duration">Duration</Label>
                                    <Input
                                      id="edit-duration"
                                      value={editFormData.duration || ""}
                                      onChange={(e) => setEditFormData(prev => ({ ...prev, duration: e.target.value }))}
                                      placeholder="e.g., 2 weeks"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="edit-deadline">Deadline</Label>
                                  <Input
                                    id="edit-deadline"
                                    type="date"
                                    value={editFormData.deadline || ""}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, deadline: e.target.value }))}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  onClick={handleUpdateJob}
                                  disabled={updating}
                                >
                                  {updating ? "Updating..." : "Update Job"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Job</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this job? This action cannot be undone.
                                  All applications for this job will also be deleted.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Job
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </TooltipProvider>
  );
};

export default JobManagement;