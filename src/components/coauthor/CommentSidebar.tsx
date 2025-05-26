
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Plus, Reply } from "lucide-react";

interface CommentSidebarProps {
  projectId: string;
  permissions: {
    canComment: boolean;
  };
}

const CommentSidebar = ({ projectId, permissions }: CommentSidebarProps) => {
  const [newComment, setNewComment] = useState("");
  const [comments] = useState([
    {
      id: 1,
      author: "Dr. Sarah Johnson",
      avatar: null,
      content: "Great introduction! Consider adding more recent statistics on AI adoption in education.",
      timestamp: "2024-01-15 10:30",
      section: "Introduction",
      replies: [
        {
          id: 11,
          author: "Prof. Michael Chen",
          avatar: null,
          content: "I agree. I found some 2024 data from UNESCO that might be helpful.",
          timestamp: "2024-01-15 11:00"
        }
      ]
    },
    {
      id: 2,
      author: "Prof. Michael Chen",
      avatar: null,
      content: "The methodology section needs more detail on data collection procedures.",
      timestamp: "2024-01-15 14:20",
      section: "Methodology",
      replies: []
    },
    {
      id: 3,
      author: "Dr. Emily Rodriguez",
      avatar: null,
      content: "Should we include a section on ethical considerations for AI in education?",
      timestamp: "2024-01-15 16:45",
      section: "General",
      replies: []
    }
  ]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In real app, this would save to database
      console.log("Adding comment:", newComment);
      setNewComment("");
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Discussion & Comments
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Add New Comment */}
          {permissions.canComment && (
            <div className="space-y-3">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment or suggestion..."
                rows={3}
              />
              <div className="flex justify-between items-center">
                <select className="text-sm border rounded px-2 py-1">
                  <option value="general">General</option>
                  <option value="introduction">Introduction</option>
                  <option value="methodology">Methodology</option>
                  <option value="results">Results</option>
                  <option value="conclusion">Conclusion</option>
                </select>
                
                <Button 
                  size="sm" 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.avatar || undefined} />
                    <AvatarFallback className="text-xs">
                      {comment.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{comment.author}</p>
                        <p className="text-xs text-gray-500">{formatTime(comment.timestamp)}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {comment.section}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-700">{comment.content}</p>
                    
                    {permissions.canComment && (
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Reply className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-11 space-y-3 border-l-2 border-gray-100 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={reply.avatar || undefined} />
                          <AvatarFallback className="text-xs">
                            {reply.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-xs">{reply.author}</p>
                            <p className="text-xs text-gray-500">{formatTime(reply.timestamp)}</p>
                          </div>
                          <p className="text-sm text-gray-700">{reply.content}</p>
                        </div>
                      </div>
                    ))}
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

export default CommentSidebar;
