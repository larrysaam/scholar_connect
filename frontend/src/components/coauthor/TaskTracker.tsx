import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Plus, Calendar, User, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  created_at: string;
  project_id: string;
  created_by: string;
  profiles?: {
    name: string;
  };
}

interface TaskTrackerProps {
  projectId: string;
  permissions: {
    canAssignTasks: boolean;
  };
  teamMembers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
}

interface NewTask {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

const TaskTracker = ({ projectId, permissions, teamMembers }: TaskTrackerProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const { toast } = useToast();
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    priority: "medium"
  });

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("project_tasks")
        .select("*, profiles:assignee(name)")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });
        
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("project_tasks").insert({
        project_id: projectId,
        title: newTask.title,
        description: newTask.description,
        assignee: newTask.assignee,
        due_date: newTask.dueDate,
        priority: newTask.priority,
        status: "todo",
        created_by: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

      setShowNewTaskForm(false);
      setNewTask({
        title: "",
        description: "",
        assignee: "",
        dueDate: "",
        priority: "medium"
      });
      await fetchTasks();
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleUpdateTaskStatus = async (taskId: string, status: Task['status']) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("project_tasks")
        .update({ status })
        .eq("id", taskId);

      if (error) throw error;
      await fetchTasks();
      toast({
        title: "Success",
        description: "Task status updated successfully",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "todo": return "bg-gray-100 text-gray-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No date set";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Task Management
            </CardTitle>
            
            {permissions.canAssignTasks && (
              <Button onClick={() => setShowNewTaskForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {showNewTaskForm && permissions.canAssignTasks && (
            <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
              <h4 className="font-medium">Create New Task</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Task title"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Task description"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Select value={newTask.assignee} onValueChange={(value) => setNewTask({...newTask, assignee: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value as Task['priority']})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewTaskForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask} disabled={!newTask.title.trim()}>
                  Create Task
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{task.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{task.profiles?.name || "Unassigned"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {formatDate(task.due_date)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Created: {formatDate(task.created_at)}</span>
                  </div>
                </div>
                
                {permissions.canAssignTasks && (
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    {task.status === "todo" && (
                      <Button variant="outline" size="sm" onClick={() => handleUpdateTaskStatus(task.id, "in-progress")}>
                        Start Task
                      </Button>
                    )}
                    {task.status === "in-progress" && (
                      <Button variant="outline" size="sm" onClick={() => handleUpdateTaskStatus(task.id, "completed")}>
                        Complete Task
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskTracker;
