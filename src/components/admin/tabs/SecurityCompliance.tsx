
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, AlertTriangle, Eye, Lock, Download } from "lucide-react";

const SecurityCompliance = () => {
  const adminUsers = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@ResearchWow.com",
      role: "Super Admin",
      lastLogin: "2024-01-20 08:30",
      status: "active",
      permissions: "Full Access"
    },
    {
      id: 2,
      name: "Operations Manager",
      email: "ops@ResearchWow.com",
      role: "Ops Manager",
      lastLogin: "2024-01-20 09:15",
      status: "active",
      permissions: "User Management, Consultations"
    },
    {
      id: 3,
      name: "Content Manager",
      email: "content@ResearchWow.com",
      role: "Content Manager",
      lastLogin: "2024-01-19 16:45",
      status: "active",
      permissions: "Content, Templates, Announcements"
    }
  ];

  const securityLogs = [
    {
      id: 1,
      timestamp: "2024-01-20 14:30",
      user: "john.doe@university.edu",
      action: "Multiple failed login attempts",
      ipAddress: "192.168.1.105",
      severity: "high",
      status: "investigating"
    },
    {
      id: 2,
      timestamp: "2024-01-20 12:15",
      user: "admin@ResearchWow.com",
      action: "Admin login from new location",
      ipAddress: "10.0.0.1",
      severity: "medium",
      status: "cleared"
    },
    {
      id: 3,
      timestamp: "2024-01-20 09:45",
      user: "researcher@university.cm",
      action: "Password reset requested",
      ipAddress: "172.16.0.50",
      severity: "low",
      status: "normal"
    }
  ];

  const dataRequests = [
    {
      id: 1,
      user: "alice.johnson@student.edu",
      requestType: "Data Download",
      requestDate: "2024-01-18",
      status: "pending",
      dataType: "Personal Profile, Consultation History",
      reason: "Account closure"
    },
    {
      id: 2,
      user: "researcher.xyz@university.org",
      requestType: "Data Deletion",
      requestDate: "2024-01-15",
      status: "completed",
      dataType: "All Personal Data",
      reason: "GDPR compliance request"
    }
  ];

  const complianceChecks = [
    { item: "Data Encryption", status: "compliant", lastCheck: "2024-01-19" },
    { item: "Access Controls", status: "compliant", lastCheck: "2024-01-18" },
    { item: "Audit Logging", status: "compliant", lastCheck: "2024-01-17" },
    { item: "Data Retention Policies", status: "review_needed", lastCheck: "2024-01-10" },
    { item: "Third-party Integrations", status: "compliant", lastCheck: "2024-01-16" }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Security & Compliance</h2>

      <Tabs defaultValue="access-control" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="access-control">Access Control</TabsTrigger>
          <TabsTrigger value="security-monitoring">Security Monitoring</TabsTrigger>
          <TabsTrigger value="data-requests">Data Requests</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="access-control" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Admin User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div></div>
                <Button>Add New Admin User</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{user.permissions}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <Badge variant="default">{user.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Permissions</Button>
                          <Button size="sm" variant="destructive">Deactivate</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Role Permissions Matrix */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Role Permissions Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Super Admin</h4>
                  <ul className="text-sm space-y-1">
                    <li>✅ Full platform access</li>
                    <li>✅ User management</li>
                    <li>✅ Financial data</li>
                    <li>✅ Security settings</li>
                    <li>✅ System configuration</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Ops Manager</h4>
                  <ul className="text-sm space-y-1">
                    <li>✅ User management</li>
                    <li>✅ Consultation management</li>
                    <li>✅ Task management</li>
                    <li>❌ Financial data</li>
                    <li>❌ Security settings</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Content Manager</h4>
                  <ul className="text-sm space-y-1">
                    <li>✅ Content management</li>
                    <li>✅ Templates</li>
                    <li>✅ Announcements</li>
                    <li>❌ User data</li>
                    <li>❌ Financial data</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security-monitoring" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">234</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Event Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell className="font-mono text-sm">{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            log.severity === "high" ? "destructive" : 
                            log.severity === "medium" ? "default" : 
                            "secondary"
                          }
                        >
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.status === "investigating" ? "destructive" : "default"}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Details</Button>
                          {log.status === "investigating" && (
                            <Button size="sm" variant="outline">Resolve</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data-requests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5" />
                GDPR/CCPA Data Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Request Type</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-sm">{request.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.requestType}</Badge>
                      </TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.dataType}</TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={request.status === "completed" ? "default" : "secondary"}
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Process</Button>
                          {request.status === "completed" && (
                            <Button size="sm" variant="outline">Download</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{check.item}</h4>
                      <p className="text-sm text-gray-600">Last checked: {check.lastCheck}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={check.status === "compliant" ? "default" : "destructive"}
                      >
                        {check.status.replace('_', ' ')}
                      </Badge>
                      <Button size="sm" variant="outline">Check Now</Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Data Protection Measures</h4>
                  <ul className="text-sm space-y-2">
                    <li>✅ End-to-end encryption for sensitive data</li>
                    <li>✅ Regular security audits and penetration testing</li>
                    <li>✅ Two-factor authentication for admin accounts</li>
                    <li>✅ Regular backup and disaster recovery procedures</li>
                    <li>✅ GDPR and CCPA compliance protocols</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Compliance Reports</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Generate Security Audit Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      GDPR Compliance Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Data Processing Activity Record
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      User Access Log
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityCompliance;
