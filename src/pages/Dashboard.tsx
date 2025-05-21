
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
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for upcoming consultations
const upcomingConsultations = [
  {
    id: "1",
    researcher: {
      id: "1",
      name: "Dr. Sarah Johnson",
      field: "Computer Science",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80"
    },
    date: "May 24, 2025",
    time: "10:00 AM - 11:00 AM",
    topic: "Machine Learning Project Review",
    status: "confirmed"
  },
  {
    id: "2",
    researcher: {
      id: "2",
      name: "Dr. Michael Chen",
      field: "Physics",
      imageUrl: "https://images.unsplash.com/photo-1601582589907-f92af5ed9db8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80"
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
    researcher: {
      id: "3",
      name: "Dr. Emily Rodriguez",
      field: "Biology",
      imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    date: "May 10, 2025",
    time: "3:00 PM - 4:00 PM",
    topic: "Genetics Research Methodology",
    status: "completed",
    notes: "Discussed research methodology for gene editing project. Dr. Rodriguez provided valuable insights on experimental design and recommended several key papers to review."
  },
  {
    id: "4",
    researcher: {
      id: "4",
      name: "Dr. James Wilson",
      field: "Economics",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    date: "May 5, 2025",
    time: "11:00 AM - 12:00 PM",
    topic: "Economic Policy Analysis",
    status: "completed",
    notes: "Reviewed data analysis approach for economic policy research. Dr. Wilson suggested alternative statistical methods and provided example code for implementation."
  }
];

// Mock data for payment history
const paymentHistory = [
  {
    id: "p1",
    date: "May 10, 2025",
    researcher: "Dr. Emily Rodriguez",
    amount: 135,
    status: "completed"
  },
  {
    id: "p2",
    date: "May 5, 2025",
    researcher: "Dr. James Wilson",
    amount: 160,
    status: "completed"
  },
  {
    id: "p3",
    date: "April 28, 2025",
    researcher: "Dr. Amira Khan",
    amount: 125,
    status: "completed"
  }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage your consultations and account</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Alex Smith</p>
                    <p className="text-sm text-gray-500">Student</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("upcoming")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Upcoming
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("past")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Past Consultations
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("payments")}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Payments
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("documents")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
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
                    <h2 className="text-xl font-semibold mb-4">Upcoming Consultations</h2>
                    
                    {upcomingConsultations.length > 0 ? (
                      <div className="space-y-6">
                        {upcomingConsultations.map((consultation) => (
                          <Card key={consultation.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-4">
                                  <div className="h-10 w-10 rounded-full overflow-hidden">
                                    <img 
                                      src={consultation.researcher.imageUrl} 
                                      alt={consultation.researcher.name}
                                      className="h-full w-full object-cover" 
                                    />
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg">{consultation.researcher.name}</CardTitle>
                                    <CardDescription>{consultation.researcher.field}</CardDescription>
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
                              <Button size="sm">Join Meeting</Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No upcoming consultations.</p>
                        <Button className="mt-4" asChild>
                          <a href="/researchers">Find Researchers</a>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="past" className="mt-0">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Past Consultations</h2>
                    
                    {pastConsultations.map((consultation) => (
                      <Card key={consultation.id} className="mb-6 last:mb-0">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-full overflow-hidden">
                                <img 
                                  src={consultation.researcher.imageUrl} 
                                  alt={consultation.researcher.name}
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{consultation.researcher.name}</CardTitle>
                                <CardDescription>{consultation.researcher.field}</CardDescription>
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
                            <p className="font-medium">Session Notes:</p>
                            <p className="text-gray-700 text-sm">{consultation.notes}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <Button variant="outline" size="sm">Download Notes</Button>
                          <Button size="sm">Book Again</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="payments" className="mt-0">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Payment History</h2>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="border-b">
                          <tr>
                            <th className="pb-3 font-medium">Date</th>
                            <th className="pb-3 font-medium">Researcher</th>
                            <th className="pb-3 font-medium">Amount</th>
                            <th className="pb-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistory.map((payment) => (
                            <tr key={payment.id} className="border-b last:border-b-0">
                              <td className="py-4">{payment.date}</td>
                              <td className="py-4">{payment.researcher}</td>
                              <td className="py-4">${payment.amount}</td>
                              <td className="py-4">
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  {payment.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="profile" className="mt-0">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Profile</h2>
                    <p className="text-gray-600">Edit your profile information and preferences.</p>
                    
                    <div className="mt-6">
                      <Button>Edit Profile</Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="mt-0">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Documents</h2>
                    <p className="text-gray-600">Access shared documents and resources from your consultations.</p>
                    
                    <div className="mt-6 text-center py-8">
                      <p className="text-gray-500">No documents available.</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-0">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Settings</h2>
                    <p className="text-gray-600">Manage your account settings and preferences.</p>
                    
                    <div className="mt-6">
                      <Button>Account Settings</Button>
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

export default Dashboard;
