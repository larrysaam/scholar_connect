
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Edit2, MapPin, Calendar, Award, BookOpen, Users, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsProfileRatings = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Dr. Neba Emmanuel",
    title: "Academic Editor & Research Consultant",
    bio: "Experienced academic editor and research consultant with expertise in statistical analysis, academic writing, and data interpretation. Specialized in agricultural research and environmental studies.",
    location: "Yaoundé, Cameroon",
    experience: "5+ years",
    education: "PhD in Agricultural Sciences",
    skills: ["Statistical Analysis", "Data Analysis", "Literature Review", "Academic Writing", "SPSS", "Research Design"]
  });
  const { toast } = useToast();

  const profileStats = {
    completedJobs: 24,
    totalEarnings: "245,000 XAF",
    averageRating: 4.8,
    responseTime: "2 hours",
    completionRate: "98%",
    clientRetention: "85%"
  };

  const recentReviews = [
    {
      id: 1,
      client: "Dr. Sarah Johnson",
      project: "Statistical Analysis for Agricultural Study",
      rating: 5,
      review: "Excellent work on the statistical analysis. Very thorough and professional approach to data interpretation.",
      date: "2024-01-15"
    },
    {
      id: 2,
      client: "Prof. Michael Chen",
      project: "Literature Review on Climate Change",
      rating: 4,
      review: "Good quality literature review with comprehensive coverage. Delivered on time with clear documentation.",
      date: "2024-01-08"
    },
    {
      id: 3,
      client: "Dr. Marie Dubois",
      project: "Survey Data Collection",
      rating: 5,
      review: "Outstanding data collection work. Very organized and efficient. Highly recommend for future projects.",
      date: "2023-12-20"
    }
  ];

  const handleProfileUpdate = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated"
    });
    setIsEditProfileOpen(false);
  };

  const handleDeleteReason = () => {
    if (!deleteReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for account deletion",
        variant: "destructive"
      });
      return;
    }
    setShowReasonDialog(false);
    setIsDeleteAccountOpen(true);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Error",
        description: "Please type 'DELETE' to confirm account deletion",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Account Deletion Requested",
      description: "Your account deletion request has been submitted. We'll process it within 24-48 hours."
    });
    setIsDeleteAccountOpen(false);
    setDeleteReason("");
    setDeleteConfirmation("");
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Profile & Ratings</h2>
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogTrigger asChild>
            <Button>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    value={profileData.title}
                    onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    value={profileData.experience}
                    onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={profileData.education}
                  onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleProfileUpdate} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditProfileOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder-avatar.jpg" alt={profileData.name} />
              <AvatarFallback className="text-lg">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-bold">{profileData.name}</h3>
                <Badge className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              
              <p className="text-gray-600 font-medium mb-3">{profileData.title}</p>
              <p className="text-gray-700 mb-4">{profileData.bio}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{profileData.experience} experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span>{profileData.education}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                {renderStars(Math.floor(profileStats.averageRating))}
              </div>
              <p className="text-lg font-bold">{profileStats.averageRating}/5.0</p>
              <p className="text-sm text-gray-600">{profileStats.completedJobs} reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Completed Jobs</p>
                <p className="text-2xl font-bold">{profileStats.completedJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">{profileStats.totalEarnings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{profileStats.completionRate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle>Skills & Expertise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Client Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{review.client}</p>
                    <p className="text-sm text-gray-600">{review.project}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{review.review}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Account Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            If you need to delete your account, please note that this action is irreversible and will remove all your data, including your profile, job history, and earnings records.
          </p>
          
          <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Why are you deleting your account?</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Please tell us why you're leaving. This helps us improve our platform..."
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  rows={4}
                />
                <div className="flex space-x-2">
                  <Button onClick={handleDeleteReason} className="flex-1">
                    Continue
                  </Button>
                  <Button variant="outline" onClick={() => setShowReasonDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">Confirm Account Deletion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <p className="text-red-800 font-medium mb-2">⚠️ This action cannot be undone</p>
                  <p className="text-red-700 text-sm">
                    Deleting your account will permanently remove all your data, including:
                  </p>
                  <ul className="text-red-700 text-sm mt-2 list-disc list-inside">
                    <li>Profile information and portfolio</li>
                    <li>Job history and client reviews</li>
                    <li>Earnings and payment records</li>
                    <li>Messages and communication history</li>
                  </ul>
                </div>
                
                <div>
                  <Label htmlFor="delete-confirmation">
                    Type <strong className="bg-red-100 px-1 rounded">DELETE</strong> to confirm:
                  </Label>
                  <Input
                    id="delete-confirmation"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Type DELETE here"
                    className="mt-1"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmation !== "DELETE"}
                    className="flex-1"
                  >
                    Delete My Account
                  </Button>
                  <Button variant="outline" onClick={() => setIsDeleteAccountOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAidsProfileRatings;
