
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState("all");

  const students = [
    { id: 1, name: "John Doe", email: "john@university.edu", institution: "University of Yaoundé", status: "active", bookings: 12, lastActivity: "2 days ago" },
    { id: 2, name: "Sarah Wilson", email: "sarah@univ.cm", institution: "University of Douala", status: "active", bookings: 8, lastActivity: "1 hour ago" }
  ];

  const researchers = [
    { id: 1, name: "Dr. Marie Ngono", email: "marie@university.cm", institution: "University of Yaoundé I", status: "verified", earnings: "450,000 XAF", sessions: 47, verification: "approved" },
    { id: 2, name: "Prof. James Akinyemi", email: "james@unilag.edu.ng", institution: "University of Lagos", status: "pending", earnings: "0 XAF", sessions: 0, verification: "pending" }
  ];

  const researchAids = [
    { id: 1, name: "Dr. Neba Emmanuel", email: "neba@gmail.com", specialization: "Academic Editor", status: "active", tasks: 23, rating: 4.9, completion: "96%" },
    { id: 2, name: "Emma Wilson", email: "emma@gmail.com", specialization: "Data Analyst", status: "active", tasks: 15, rating: 4.7, completion: "94%" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="researchers">Researchers</TabsTrigger>
          <TabsTrigger value="research-aids">Research Aids</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{student.institution}</TableCell>
                      <TableCell>
                        <Badge variant={student.status === "active" ? "default" : "secondary"}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.bookings}</TableCell>
                      <TableCell>{student.lastActivity}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="outline">Suspend</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="researchers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Researcher Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {researchers.map((researcher) => (
                    <TableRow key={researcher.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{researcher.name}</p>
                          <p className="text-sm text-gray-500">{researcher.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{researcher.institution}</TableCell>
                      <TableCell>
                        <Badge variant={researcher.verification === "approved" ? "default" : "destructive"}>
                          {researcher.verification}
                        </Badge>
                      </TableCell>
                      <TableCell>{researcher.sessions}</TableCell>
                      <TableCell>{researcher.earnings}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {researcher.verification === "pending" && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">View Profile</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="research-aids" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Research Aids Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {researchAids.map((aid) => (
                    <TableRow key={aid.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{aid.name}</p>
                          <p className="text-sm text-gray-500">{aid.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{aid.specialization}</TableCell>
                      <TableCell>
                        <Badge variant="default">{aid.status}</Badge>
                      </TableCell>
                      <TableCell>{aid.tasks}</TableCell>
                      <TableCell>{aid.rating}/5</TableCell>
                      <TableCell>{aid.completion}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">View Tasks</Button>
                          <Button size="sm" variant="outline">Assign</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
