import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Star, 
  Edit, 
  Camera, 
  Award,
  TrendingUp,
  Users,
  Calendar,
  Plus,
  Trash2,
  BookOpen,
  Briefcase,
  Trophy,
  FileText,
  GraduationCap,
  Network
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsProfileRatings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    title: "Dr.",
    name: "Neba Emmanuel",
    jobTitle: "Academic Editor & Statistician",
    bio: "Experienced academic editor with over 8 years in statistical analysis and research methodology. Specialized in SPSS, R, and academic writing support.",
    location: "Yaoundé, Cameroon",
    languages: ["English", "French"],
    expertise: ["Statistical Analysis", "Academic Writing", "Research Methodology", "Data Visualization", "SPSS", "R Programming"],
    rating: 4.9,
    totalReviews: 47,
    completedJobs: 47,
    responseTime: "< 2 hours",
    successRate: 98,
    education: [
      {
        degree: "PhD in Statistics",
        institution: "University of Yaoundé I",
        year: "2015",
        field: "Applied Statistics"
      },
      {
        degree: "MSc in Mathematics",
        institution: "University of Buea",
        year: "2010",
        field: "Statistical Methods"
      }
    ],
    experience: [
      {
        position: "Senior Research Analyst",
        organization: "Statistical Research Institute",
        duration: "2018 - Present",
        description: "Leading statistical analysis projects and mentoring junior researchers"
      },
      {
        position: "Academic Editor",
        organization: "Journal of Applied Statistics",
        duration: "2016 - Present",
        description: "Editorial review and statistical consultation for academic publications"
      }
    ],
    awards: [
      {
        title: "Excellence in Statistical Research",
        organization: "Cameroon Statistical Society",
        year: "2020"
      },
      {
        title: "Best Academic Editor",
        organization: "African Journal Network",
        year: "2019"
      }
    ],
    publications: [
      {
        title: "Advanced Statistical Methods in African Research",
        journal: "Journal of African Statistics",
        year: "2021",
        type: "Peer-reviewed Article"
      },
      {
        title: "Data Analysis Techniques for Educational Research",
        journal: "Educational Statistics Quarterly",
        year: "2020",
        type: "Research Paper"
      }
    ],
    scholarships: [
      {
        title: "African Excellence Scholarship",
        organization: "African Development Bank",
        year: "2012-2015",
        amount: "Full Tuition"
      }
    ],
    affiliations: [
      {
        organization: "International Statistical Institute",
        position: "Member",
        since: "2016"
      },
      {
        organization: "Cameroon Statistical Society",
        position: "Board Member",
        since: "2018"
      }
    ]
  });

  const ratingBreakdown = [
    { stars: 5, count: 42, percentage: 89 },
    { stars: 4, count: 4, percentage: 9 },
    { stars: 3, count: 1, percentage: 2 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 }
  ];

  const reviews = [
    {
      id: 1,
      client: "Dr. Sarah Johnson",
      rating: 5,
      date: "2024-01-25",
      project: "Statistical Analysis Project",
      comment: "Excellent work on the statistical analysis. Dr. Neba provided comprehensive insights and delivered ahead of schedule. Highly recommended!"
    },
    {
      id: 2,
      client: "Prof. Michael Chen",
      rating: 5,
      date: "2024-01-20",
      project: "Literature Review",
      comment: "Outstanding literature review with thorough analysis. The writing quality was exceptional and met all academic standards."
    },
    {
      id: 3,
      client: "Dr. Marie Dubois",
      rating: 4,
      date: "2024-01-18",
      project: "Data Collection Protocol",
      comment: "Very professional and knowledgeable. The methodology was well-structured and practical for field implementation."
    }
  ];

  const achievements = [
    { title: "Top Rated Expert", description: "Maintained 4.9+ rating for 6 months", icon: Award },
    { title: "Fast Responder", description: "Responds within 2 hours", icon: TrendingUp },
    { title: "Trusted Professional", description: "50+ successful projects", icon: Users }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully"
    });
    setIsEditing(false);
  };

  const handleUpdateField = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddEducation = (education: any) => {
    setProfileData(prev => ({
      ...prev,
      education: [...prev.education, education]
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Profile & Ratings</h2>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === "profile" ? "default" : "outline"} 
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </Button>
          <Button 
            variant={activeTab === "ratings" ? "default" : "outline"} 
            onClick={() => setActiveTab("ratings")}
          >
            Ratings & Reviews
          </Button>
        </div>
      </div>

      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={profileData.name} />
                    <AvatarFallback className="text-lg">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      {isEditing ? (
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <Input
                              value={profileData.title}
                              onChange={(e) => handleUpdateField('title', e.target.value)}
                              placeholder="Title"
                              className="w-20"
                            />
                            <Input
                              value={profileData.name}
                              onChange={(e) => handleUpdateField('name', e.target.value)}
                              placeholder="Full Name"
                              className="flex-1"
                            />
                          </div>
                          <Input
                            value={profileData.jobTitle}
                            onChange={(e) => handleUpdateField('jobTitle', e.target.value)}
                            placeholder="Job Title"
                          />
                          <Input
                            value={profileData.location}
                            onChange={(e) => handleUpdateField('location', e.target.value)}
                            placeholder="Location"
                          />
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-2xl font-bold">{profileData.title} {profileData.name}</h3>
                          <p className="text-lg text-gray-600">{profileData.jobTitle}</p>
                          <p className="text-sm text-gray-500">{profileData.location}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <Button onClick={handleSaveProfile}>Save Changes</Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </>
                      ) : (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        {renderStars(5)}
                        <span className="ml-1 font-semibold">{profileData.rating}</span>
                      </div>
                      <p className="text-sm text-gray-600">{profileData.totalReviews} reviews</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{profileData.completedJobs}</p>
                      <p className="text-sm text-gray-600">Jobs Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{profileData.successRate}%</p>
                      <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold">{profileData.responseTime}</p>
                      <p className="text-sm text-gray-600">Response Time</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio Section */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => handleUpdateField('bio', e.target.value)}
                  placeholder="Write about your experience and expertise..."
                  rows={4}
                />
              ) : (
                <p className="text-gray-700">{profileData.bio}</p>
              )}
            </CardContent>
          </Card>

          {/* Educational Background */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Educational Background
                </CardTitle>
                {isEditing && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Education
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Education</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Degree</Label>
                          <Input placeholder="e.g., PhD in Statistics" />
                        </div>
                        <div>
                          <Label>Institution</Label>
                          <Input placeholder="University name" />
                        </div>
                        <div>
                          <Label>Year</Label>
                          <Input placeholder="Graduation year" />
                        </div>
                        <div>
                          <Label>Field of Study</Label>
                          <Input placeholder="Area of specialization" />
                        </div>
                        <Button className="w-full">Add Education</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.year} • {edu.field}</p>
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEducation(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Work Experience
                </CardTitle>
                {isEditing && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Experience
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{exp.position}</h4>
                        <p className="text-gray-600">{exp.organization}</p>
                        <p className="text-sm text-gray-500">{exp.duration}</p>
                        <p className="text-sm mt-1">{exp.description}</p>
                      </div>
                      {isEditing && (
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Awards and Recognition */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Awards & Recognition
                </CardTitle>
                {isEditing && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Award
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profileData.awards.map((award, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{award.title}</h4>
                      <p className="text-sm text-gray-600">{award.organization} • {award.year}</p>
                    </div>
                    {isEditing && (
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Publications */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Publications
                </CardTitle>
                {isEditing && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Publication
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.publications.map((pub, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{pub.title}</h4>
                        <p className="text-gray-600">{pub.journal}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{pub.type}</Badge>
                          <span className="text-sm text-gray-500">{pub.year}</span>
                        </div>
                      </div>
                      {isEditing && (
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scholarships and Fellowships */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Scholarships & Fellowships
                </CardTitle>
                {isEditing && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Scholarship
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profileData.scholarships.map((scholarship, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{scholarship.title}</h4>
                      <p className="text-sm text-gray-600">{scholarship.organization}</p>
                      <p className="text-sm text-gray-500">{scholarship.year} • {scholarship.amount}</p>
                    </div>
                    {isEditing && (
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Professional Affiliations */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Network className="h-5 w-5 mr-2" />
                  Professional Affiliations
                </CardTitle>
                {isEditing && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Affiliation
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profileData.affiliations.map((affiliation, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{affiliation.organization}</h4>
                      <p className="text-sm text-gray-600">{affiliation.position}</p>
                      <p className="text-sm text-gray-500">Since {affiliation.since}</p>
                    </div>
                    {isEditing && (
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expertise & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData.expertise.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
                {isEditing && (
                  <Button variant="outline" className="mt-4">
                    Add Skills
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profileData.languages.map((language, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{language}</span>
                      <Badge variant="outline">Fluent</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Icon className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "ratings" && (
        <div className="space-y-6">
          {/* Rating Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {renderStars(5)}
                    <span className="text-3xl font-bold">{profileData.rating}</span>
                  </div>
                  <p className="text-gray-600">{profileData.totalReviews} total reviews</p>
                </div>
                
                <div className="space-y-2">
                  {ratingBreakdown.map((rating) => (
                    <div key={rating.stars} className="flex items-center space-x-2">
                      <span className="text-sm w-8">{rating.stars}★</span>
                      <Progress value={rating.percentage} className="flex-1" />
                      <span className="text-sm text-gray-600 w-8">{rating.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-avatar.jpg" alt={review.client} />
                          <AvatarFallback>{review.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.client}</p>
                          <p className="text-sm text-gray-600">{review.project}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResearchAidsProfileRatings;
