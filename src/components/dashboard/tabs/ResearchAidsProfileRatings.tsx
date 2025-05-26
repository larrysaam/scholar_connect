
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Edit, Save, X, Plus, FileText, Award, TrendingUp } from "lucide-react";

interface Review {
  id: string;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  comment: string;
  projectTitle: string;
  date: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    studentName: "Kome Divine",
    rating: 5,
    comment: "Excellent data cleaning work! Dr. Neba was thorough and explained every step clearly. Highly recommend!",
    projectTitle: "Urban Mobility Analysis",
    date: "2024-01-20"
  },
  {
    id: "2",
    studentName: "Sama Njoya",
    rating: 5,
    comment: "Outstanding editing services. The thesis chapter was polished to perfection with great attention to APA formatting.",
    projectTitle: "Climate Change Research",
    date: "2024-01-18"
  },
  {
    id: "3",
    studentName: "Paul Biya Jr.",
    rating: 4,
    comment: "Great GIS mapping work. Very professional and delivered on time. Would work with again.",
    projectTitle: "Land Use Mapping",
    date: "2024-01-15"
  }
];

const ResearchAidsProfileRatings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("Experienced academic editor and statistician with over 10 years in research support. Specialized in SPSS analysis, QGIS mapping, and APA formatting for academic publications.");
  const [services, setServices] = useState(["SPSS Analysis", "QGIS Mapping", "APA Formatting", "Academic Editing", "Data Cleaning"]);
  const [hourlyRate, setHourlyRate] = useState("2500");
  const [newService, setNewService] = useState("");

  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;
  const totalReviews = mockReviews.length;

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService("");
    }
  };

  const removeService = (service: string) => {
    setServices(services.filter(s => s !== service));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Profile & Ratings</h2>
        <p className="text-gray-600">Manage your professional profile and view feedback from students</p>
      </div>

      {/* Profile Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Dr. Neba" />
                <AvatarFallback>DN</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">Dr. Neba Emmanuel</h3>
                <p className="text-gray-600">Academic Editor & Statistician</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    {renderStars(Math.round(averageRating))}
                    <span className="ml-1 font-medium">{averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-500">({totalReviews} reviews)</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Top Rated GIS Expert</Badge>
                </div>
              </div>
            </CardTitle>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">47</p>
              <p className="text-sm text-gray-600">Jobs Completed</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">98%</p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Bio</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your academic background and expertise..."
                rows={4}
              />
              <Button onClick={() => setIsEditing(false)}>
                <Save className="h-4 w-4 mr-1" />
                Save Changes
              </Button>
            </div>
          ) : (
            <p className="text-gray-700">{bio}</p>
          )}
        </CardContent>
      </Card>

      {/* Services Offered */}
      <Card>
        <CardHeader>
          <CardTitle>Services Offered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {services.map((service, index) => (
                <div key={index} className="flex items-center">
                  <Badge variant="secondary" className="pr-1">
                    {service}
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => removeService(service)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                </div>
              ))}
            </div>
            
            {isEditing && (
              <div className="flex space-x-2">
                <Input
                  placeholder="Add new service..."
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addService()}
                />
                <Button onClick={addService}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rate Per Hour */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Rate</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-32"
              />
              <span>XAF per hour</span>
            </div>
          ) : (
            <p className="text-2xl font-bold">{parseInt(hourlyRate).toLocaleString()} XAF <span className="text-base font-normal text-gray-600">per hour</span></p>
          )}
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>Student Reviews & Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockReviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.studentAvatar} alt={review.studentName} />
                    <AvatarFallback>
                      {review.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{review.studentName}</h4>
                        <p className="text-sm text-gray-600">{review.projectTitle}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAidsProfileRatings;
