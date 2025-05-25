import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar,
  Clock,
  User,
  FileText,
  Settings,
  CheckCircle,
  Clock3,
  XCircle,
  Wallet,
  BookOpen,
  Users,
  MessageSquare,
  BarChart,
  Shield,
  Award
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import QualityAssurance from "@/components/quality/QualityAssurance";
import VerificationManager from "@/components/verification/VerificationManager";

// Mock data for upcoming consultations
const upcomingConsultations = [
  {
    id: "1",
    student: {
      id: "1",
      name: "Alex Smith",
      field: "Computer Science",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    date: "May 24, 2025",
    time: "10:00 AM - 11:00 AM",
    topic: "Machine Learning Project Review",
    status: "confirmed"
  },
  {
    id: "2",
    student: {
      id: "2",
      name: "Jamie Wilson",
      field: "Physics",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    date: "May 28, 2025",
    time: "1:00 PM - 2:00 PM",
    topic: "Quantum Computing Research Questions",
    status: "pending"
  }
];

// Mock data for past consultations
const pastConsultations = [
  {
    id: "3",
    student: {
      id: "3",
      name: "Taylor Johnson",
      field: "Biology",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80"
    },
    date: "May 10, 2025",
    time: "3:00 PM - 4:00 PM",
    topic: "Genetics Research Methodology",
    status: "completed",
    notes: "Provided guidance on experimental design for gene editing project. Recommended several key papers on CRISPR techniques and ethical considerations. Student showed good understanding of basic concepts."
  },
  {
    id: "4",
    student: {
      id: "4",
      name: "Sam Lee",
      field: "Economics",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    date: "May 5, 2025",
    time: "11:00 AM - 12:00 PM",
    topic: "Economic Policy Analysis",
    status: "completed",
    notes: "Reviewed data analysis approach for economic policy research. Suggested alternative statistical methods and provided example code for implementation. Recommended follow-up session to review results."
  }
];

// Mock data for earnings history
const earningsHistory = [
  {
    id: "p1",
    date: "May 10, 2025",
    student: "Taylor Johnson",
    amount: 135,
    status: "completed"
  },
  {
    id: "p2",
    date: "May 5, 2025",
    student: "Sam Lee",
    amount: 160,
    status: "completed"
  },
  {
    id: "p3",
    date: "April 28, 2025",
    student: "Riley Adams",
    amount: 125,
    status: "completed"
  }
];

// Mock data for monthly earnings
const monthlyEarnings = [
  { month: "Jan", amount: 1250 },
  { month: "Feb", amount: 1450 },
  { month: "Mar", amount: 1380 },
  { month: "Apr", amount: 1620 },
  { month: "May", amount: 1120 },
];

// Analytics data
const analyticsData = {
  totalEarnings: 5820,
  totalSessions: 42,
  averageRating: 4.8,
  completionRate: 98,
  newRequests: 5
};

const ResearcherDashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Researcher Dashboard</h1>
              <p className="text-gray-600">Manage your consultations and track your earnings</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1 text-sm">Verified Expert</Badge>
          </div>
          
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Earnings</CardDescription>
                <CardTitle className="text-2xl">${analyticsData.totalEarnings}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-emerald-600">
                  <BarChart className="h-3 w-3 mr-1" />
                  <span>+12% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Sessions</CardDescription>
                <CardTitle className="text-2xl">{analyticsData.totalSessions}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-emerald-600">
                  <Users className="h-3 w-3 mr-1" />
                  <span>8 this month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Average Rating</CardDescription>
                <CardTitle className="text-2xl">{analyticsData.averageRating}/5.0</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Completion Rate</CardDescription>
                <CardTitle className="text-2xl">{analyticsData.completionRate}%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-emerald-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>Excellent performance</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>New Requests</CardDescription>
                <CardTitle className="text-2xl">{analyticsData.newRequests}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-emerald-600">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  <span>Awaiting response</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">Dr. Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Computer Science</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("upcoming")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Upcoming Sessions
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("past")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Past Sessions
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("earnings")}>
                    <Wallet className="mr-2 h-4 w-4" />
                    Earnings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("quality")}>
                    <Shield className="mr-2 h-4 w-4" />
                    Quality Assurance
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("verification")}>
                    <Award className="mr-2 h-4 w-4" />
                    Verification
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("availability")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Availability
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("resources")}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Resources
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="upcoming" className="mt-0">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
                    
                    {upcomingConsultations.length > 0 ? (
                      <div className="space-y-6">
                        {upcomingConsultations.map((consultation) => (
                          <Card key={consultation.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-4">
                                  <div className="h-10 w-10 rounded-full overflow-hidden">
                                    <img 
                                      src={consultation.student.imageUrl} 
                                      alt={consultation.student.name}
                                      className="h-full w-full object-cover" 
                                    />
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg">{consultation.student.name}</CardTitle>
                                    <CardDescription>{consultation.student.field}</CardDescription>
                                  </div>
                                </div>
                                <Badge 
                                  className={
                                    consultation.status === "confirmed" 
                                      ? "bg-green-100 text-green-800 border-green-200" 
                                      : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  }
                                >
                                  {consultation.status === "confirmed" ? "Confirmed" : "Pending"}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center text-gray-700">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                  <span>{consultation.date}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                  <span>{consultation.time}</span>
                                </div>
                              </div>
                              <div className="mt-4">
                                <p className="font-medium">Topic:</p>
                                <p className="text-gray-700">{consultation.topic}</p>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t pt-4">
                              <Button variant="outline" size="sm">Reschedule</Button>
                              <Button size="sm">Join Session</Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No upcoming sessions.</p>
                        <Button className="mt-4">Update Availability</Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="past" className="mt-0">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Past Sessions</h2>
                    
                    {pastConsultations.map((consultation) => (
                      <Card key={consultation.id} className="mb-6 last:mb-0">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-full overflow-hidden">
                                <img 
                                  src={consultation.student.imageUrl} 
                                  alt={consultation.student.name}
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{consultation.student.name}</CardTitle>
                                <CardDescription>{consultation.student.field}</CardDescription>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              Completed
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center text-gray-700">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{consultation.date}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{consultation.time}</span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="font-medium">Topic:</p>
                            <p className="text-gray-700">{consultation.topic}</p>
                          </div>
                          <div className="mt-4 bg-gray-50 p-3 rounded-md">
                            <p className="font-medium">Your Notes:</p>
                            <p className="text-gray-700 text-sm">{consultation.notes}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <Button variant="outline" size="sm">Edit Notes</Button>
                          <Button size="sm">Contact Student</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="earnings" className="mt-0">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Earnings</h2>
                      <Button variant="outline" size="sm">Download Report</Button>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="font-medium text-gray-600 mb-2">Monthly Overview</h3>
                      <div className="h-32 bg-gray-50 rounded-md flex items-end justify-between p-4">
                        {monthlyEarnings.map((item, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              className="w-12 bg-emerald-500 rounded-t-sm" 
                              style={{ 
                                height: `${(item.amount / Math.max(...monthlyEarnings.map(e => e.amount))) * 80}px` 
                              }}
                            ></div>
                            <span className="text-xs mt-1">{item.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-600 mb-3">Transaction History</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {earningsHistory.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{payment.date}</TableCell>
                              <TableCell>{payment.student}</TableCell>
                              <TableCell>${payment.amount}</TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  {payment.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="quality" className="mt-0">
                  <QualityAssurance />
                </TabsContent>
                
                <TabsContent value="verification" className="mt-0">
                  <VerificationManager />
                </TabsContent>
                
                <TabsContent value="availability" className="mt-0">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Manage Availability</h2>
                    <p className="text-gray-600 mb-6">Set your available hours for student consultations.</p>
                    
                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                      <h3 className="font-medium mb-3">Weekly Schedule</h3>
                      <div className="space-y-3">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                          <div key={day} className="flex items-center justify-between">
                            <span className="w-24">{day}</span>
                            <div className="bg-white border rounded-md px-3 py-2 w-full max-w-xs text-sm">
                              9:00 AM - 5:00 PM
                            </div>
                            <Button size="sm" variant="outline" className="ml-2">Edit</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Blocked Dates</h3>
                      <div className="flex items-center space-x-2">
                        <div className="bg-white border rounded-md px-3 py-2 w-full max-w-xs text-sm">
                          June 15 - June 22, 2025
                        </div>
                        <Button size="sm" variant="outline">Add</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="resources" className="mt-0">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Resources</h2>
                    <p className="text-gray-600 mb-6">Manage and share resources with your students.</p>
                    
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Research Methodology Guide</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-600">A comprehensive guide to research methods shared with 5 students.</p>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                          <p className="text-xs text-gray-500">Updated 2 weeks ago</p>
                          <Button size="sm" variant="outline">Manage</Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Statistical Analysis Templates</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-600">Excel and R templates for common statistical tests shared with 8 students.</p>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                          <p className="text-xs text-gray-500">Updated 1 month ago</p>
                          <Button size="sm" variant="outline">Manage</Button>
                        </CardFooter>
                      </Card>
                      
                      <Button className="w-full">Upload New Resource</Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="profile" className="mt-0">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Profile</h2>
                    <p className="text-gray-600 mb-6">Manage your public profile information.</p>
                    
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                          <User className="h-10 w-10 text-emerald-600" />
                        </div>
                        <div>
                          <Button variant="outline" size="sm">Change Photo</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-1">Bio</h3>
                          <p className="text-sm text-gray-600">
                            Professor of Computer Science with over 15 years of experience. Specializing in machine learning, 
                            algorithms, and computational theory. Published author with 40+ papers in leading journals.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-1">Areas of Expertise</h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-gray-100 text-gray-800">Machine Learning</Badge>
                            <Badge className="bg-gray-100 text-gray-800">Artificial Intelligence</Badge>
                            <Badge className="bg-gray-100 text-gray-800">Algorithms</Badge>
                            <Badge className="bg-gray-100 text-gray-800">Data Structures</Badge>
                            <Badge className="bg-gray-100 text-gray-800">Neural Networks</Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-1">Education</h3>
                          <p className="text-sm text-gray-600">
                            Ph.D. in Computer Science, Stanford University<br />
                            M.S. in Computer Science, MIT<br />
                            B.S. in Computer Engineering, UC Berkeley
                          </p>
                        </div>
                      </div>
                      
                      <Button>Edit Profile</Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-0">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Settings</h2>
                    <p className="text-gray-600">Manage your account settings and preferences.</p>
                    
                    <div className="mt-6 space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Notification Preferences</h3>
                        <div className="flex items-center justify-between">
                          <span>Email notifications for new booking requests</span>
                          <Button size="sm" variant="outline">Enabled</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>SMS reminders for upcoming sessions</span>
                          <Button size="sm" variant="outline">Disabled</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-medium">Payment Information</h3>
                        <Button>Update Payment Details</Button>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-medium">Account Security</h3>
                        <Button>Change Password</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearcherDashboard;
