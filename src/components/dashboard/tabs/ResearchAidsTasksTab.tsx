
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Clock, MessageSquare, FileText, CheckCircle, Star } from "lucide-react";

const ResearchAidsTasksTab = () => {
  const [activeTab, setActiveTab] = useState("active");

  const activeTasks = [
    {
      id: 1,
      title: "Statistical Analysis of Survey Data",
      category: "Statistics",
      researchAid: {
        name: "Dr. Marie Ngono",
        image: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
        rating: 4.9
      },
      budget: "25,000 FCFA",
      deadline: "2024-01-15",
      status: "in-progress",
      progress: 65,
      lastUpdate: "2 hours ago"
    },
    {
      id: 2,
      title: "Thesis Chapter Proofreading",
      category: "Academic Editing",
      researchAid: {
        name: "Dr. Fatima Bello",
        image: "/lovable-uploads/0c2151ac-5e74-4b77-86a9-9b359241cfca.png",
        rating: 4.7
      },
      budget: "15,000 FCFA",
      deadline: "2024-01-12",
      status: "review",
      progress: 90,
      lastUpdate: "1 day ago"
    }
  ];

  const completedTasks = [
    {
      id: 3,
      title: "Interview Transcription",
      category: "Transcription",
      researchAid: {
        name: "Emmanuel Talla",
        image: "/lovable-uploads/327ccde5-c0c9-443a-acd7-4570799bb7f8.png",
        rating: 4.8
      },
      budget: "12,000 FCFA",
      completedDate: "2024-01-05",
      status: "completed",
      rating: 5
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "review":
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Research Aid Tasks</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Post New Task
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-2 px-1 font-medium text-sm ${
            activeTab === "active"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Active Tasks ({activeTasks.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-2 px-1 font-medium text-sm ${
            activeTab === "completed"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Completed ({completedTasks.length})
        </button>
      </div>

      {/* Active Tasks */}
      {activeTab === "active" && (
        <div className="space-y-4">
          {activeTasks.length > 0 ? (
            activeTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{task.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">{task.category}</span>
                        <span>Budget: {task.budget}</span>
                        <span>Due: {task.deadline}</span>
                      </div>
                    </div>
                    {getStatusBadge(task.status)}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.researchAid.image} alt={task.researchAid.name} />
                        <AvatarFallback>{task.researchAid.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{task.researchAid.name}</p>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-xs text-gray-600">{task.researchAid.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-sm font-medium">{task.progress}% Complete</p>
                        <p className="text-xs text-gray-500">Updated {task.lastUpdate}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Active Tasks</h3>
              <p className="text-gray-500 mb-4">You don't have any ongoing research aid tasks.</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Task
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Completed Tasks */}
      {activeTab === "completed" && (
        <div className="space-y-4">
          {completedTasks.length > 0 ? (
            completedTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{task.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">{task.category}</span>
                        <span>Budget: {task.budget}</span>
                        <span>Completed: {task.completedDate}</span>
                      </div>
                    </div>
                    {getStatusBadge(task.status)}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.researchAid.image} alt={task.researchAid.name} />
                        <AvatarFallback>{task.researchAid.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{task.researchAid.name}</p>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-xs text-gray-600">{task.researchAid.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < task.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">Your rating</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Completed Tasks</h3>
              <p className="text-gray-500">Your completed research aid tasks will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResearchAidsTasksTab;
