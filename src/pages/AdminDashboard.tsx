
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, AlertTriangle, Shield, BarChart3, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for admin dashboard
  const stats = {
    totalUsers: 1247,
    totalResearchers: 89,
    totalStudents: 1158,
    pendingVerifications: 12,
    recentReports: 3,
    activeConsultations: 45
  };

  const pendingVerifications = [
    {
      id: "1",
      researcherName: "Dr. John Smith",
      documentType: "Academic Credentials",
      submittedDate: "2024-01-15",
      status: "pending"
    },
    {
      id: "2",
      researcherName: "Prof. Sarah Johnson",
      documentType: "Publication Records",
      submittedDate: "2024-01-14",
      status: "pending"
    }
  ];

  const recentReports = [
    {
      id: "1",
      reporterType: "Student",
      reportedUser: "Dr. Mike Wilson",
      type: "Misconduct",
      date: "2024-01-16",
      status: "under-review"
    },
    {
      id: "2",
      reporterType: "Researcher",
      reportedUser: "Jane Doe",
      type: "Inappropriate Behavior",
      date: "2024-01-15",
      status: "resolved"
    }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalResearchers} researchers, {stats.totalStudents} students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Consultations</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeConsultations}</div>
            <p className="text-xs text-muted-foreground">
              Currently ongoing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Verification Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVerifications.slice(0, 3).map((verification) => (
                <div key={verification.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{verification.researcherName}</p>
                    <p className="text-sm text-gray-600">{verification.documentType}</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{report.type}</p>
                    <p className="text-sm text-gray-600">Against: {report.reportedUser}</p>
                  </div>
                  <Badge 
                    variant={report.status === "resolved" ? "default" : "destructive"}
                  >
                    {report.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderVerificationsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingVerifications.map((verification) => (
              <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{verification.researcherName}</h3>
                  <p className="text-sm text-gray-600">{verification.documentType}</p>
                  <p className="text-xs text-gray-500">Submitted: {verification.submittedDate}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Review</Button>
                  <Button size="sm">Approve</Button>
                  <Button variant="destructive" size="sm">Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Misconduct Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{report.type}</h3>
                  <p className="text-sm text-gray-600">Reported User: {report.reportedUser}</p>
                  <p className="text-sm text-gray-600">Reporter Type: {report.reporterType}</p>
                  <p className="text-xs text-gray-500">Date: {report.date}</p>
                </div>
                <div className="flex gap-2">
                  <Badge 
                    variant={report.status === "resolved" ? "default" : "destructive"}
                  >
                    {report.status}
                  </Badge>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage platform operations and user activities</p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="verifications">Verifications</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              {renderOverviewTab()}
            </TabsContent>
            
            <TabsContent value="verifications" className="mt-6">
              {renderVerificationsTab()}
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              {renderReportsTab()}
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Platform configuration options will be available here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
