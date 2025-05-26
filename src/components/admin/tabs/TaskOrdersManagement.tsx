
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Clock, AlertTriangle, CheckCircle } from "lucide-react";

const TaskOrdersManagement = () => {
  const inProgressTasks = [
    {
      id: 1,
      student: "John Doe",
      researchAid: "Dr. Neba Emmanuel",
      taskType: "Thesis Editing",
      description: "Edit and proofread master's thesis on climate change",
      deadline: "2024-01-25",
      progress: "75%",
      amount: "25,000 XAF"
    },
    {
      id: 2,
      student: "Sarah Wilson",
      researchAid: "Emma Wilson",
      taskType: "Data Analysis",
      description: "Statistical analysis of survey data",
      deadline: "2024-01-22",
      progress: "40%",
      amount: "30,000 XAF"
    }
  ];

  const completedTasks = [
    {
      id: 3,
      student: "Alice Johnson",
      researchAid: "Dr. Neba Emmanuel",
      taskType: "Literature Review",
      description: "Comprehensive literature review for PhD proposal",
      completedDate: "2024-01-18",
      rating: 5,
      amount: "35,000 XAF",
      status: "approved"
    }
  ];

  const delayedTasks = [
    {
      id: 4,
      student: "Bob Smith",
      researchAid: "Emma Wilson",
      taskType: "GIS Mapping",
      description: "Create spatial analysis maps for research",
      deadline: "2024-01-15",
      daysOverdue: 3,
      amount: "20,000 XAF"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Task Orders Management</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Active tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Task quality rating</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="in-progress" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="delayed">Delayed/Issues</TabsTrigger>
        </TabsList>
        
        <TabsContent value="in-progress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Research Aid</TableHead>
                    <TableHead>Task Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inProgressTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.student}</TableCell>
                      <TableCell>{task.researchAid}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.taskType}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{task.description}</TableCell>
                      <TableCell>{task.deadline}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: task.progress }}
                            ></div>
                          </div>
                          <span className="text-sm">{task.progress}</span>
                        </div>
                      </TableCell>
                      <TableCell>{task.amount}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="outline">Message</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Research Aid</TableHead>
                    <TableHead>Task Type</TableHead>
                    <TableHead>Completed Date</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.student}</TableCell>
                      <TableCell>{task.researchAid}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.taskType}</Badge>
                      </TableCell>
                      <TableCell>{task.completedDate}</TableCell>
                      <TableCell>{task.rating}/5 ⭐</TableCell>
                      <TableCell>{task.amount}</TableCell>
                      <TableCell>
                        <Badge variant="default">{task.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="delayed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Delayed Tasks Requiring Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Research Aid</TableHead>
                    <TableHead>Task Type</TableHead>
                    <TableHead>Original Deadline</TableHead>
                    <TableHead>Days Overdue</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {delayedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.student}</TableCell>
                      <TableCell>{task.researchAid}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{task.taskType}</Badge>
                      </TableCell>
                      <TableCell>{task.deadline}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{task.daysOverdue} days</Badge>
                      </TableCell>
                      <TableCell>{task.amount}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Contact Aid</Button>
                          <Button size="sm" variant="outline">Reassign</Button>
                          <Button size="sm" variant="destructive">Refund</Button>
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

export default TaskOrdersManagement;
