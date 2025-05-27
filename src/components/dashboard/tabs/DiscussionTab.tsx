
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, MessageCircle, Users, Pin, Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DiscussionTab = () => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const { toast } = useToast();

  const [discussionTopics, setDiscussionTopics] = useState([
    { id: "general", name: "General Discussion", participants: 45, unread: 3 },
    { id: "research-methods", name: "Research Methods", participants: 28, unread: 0 },
    { id: "academic-writing", name: "Academic Writing", participants: 32, unread: 1 },
    { id: "data-analysis", name: "Data Analysis", participants: 19, unread: 5 },
    { id: "collaboration", name: "Collaboration Opportunities", participants: 15, unread: 0 }
  ]);

  const [allMessages, setAllMessages] = useState({
    general: [
      {
        id: 1,
        author: "Dr. Sarah Johnson",
        avatar: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
        message: "Has anyone worked with mixed-methods research in education? I'm looking for some guidance on data integration techniques.",
        timestamp: "2 hours ago",
        replies: 3,
        isPinned: true
      },
      {
        id: 2,
        author: "Prof. Michael Chen",
        avatar: "/lovable-uploads/327ccde5-c0c9-443a-acd7-4570799bb7f8.png",
        message: "I'd be happy to help! I've used concurrent triangulation in several studies. The key is ensuring your qual and quant data address the same research questions.",
        timestamp: "1 hour ago",
        replies: 0,
        isPinned: false
      },
      {
        id: 3,
        author: "Alex Smith",
        avatar: "/lovable-uploads/0c2151ac-5e74-4b77-86a9-9b359241cfca.png",
        message: "Thank you both! This discussion is exactly what I needed. Would it be possible to set up a consultation to dive deeper into this topic?",
        timestamp: "30 minutes ago",
        replies: 1,
        isPinned: false
      }
    ],
    "research-methods": [
      {
        id: 1,
        author: "Dr. Marie Dubois",
        avatar: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
        message: "What are the best practices for sample size calculation in qualitative research?",
        timestamp: "3 hours ago",
        replies: 2,
        isPinned: false
      }
    ],
    "academic-writing": [
      {
        id: 1,
        author: "Prof. John Doe",
        avatar: "/lovable-uploads/327ccde5-c0c9-443a-acd7-4570799bb7f8.png",
        message: "Tips for writing a compelling research abstract?",
        timestamp: "1 day ago",
        replies: 5,
        isPinned: true
      }
    ],
    "data-analysis": [
      {
        id: 1,
        author: "Dr. Jane Smith",
        avatar: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
        message: "Which statistical software is best for longitudinal data analysis?",
        timestamp: "2 days ago",
        replies: 4,
        isPinned: false
      }
    ],
    collaboration: [
      {
        id: 1,
        author: "Research Team Lead",
        avatar: "/lovable-uploads/0c2151ac-5e74-4b77-86a9-9b359241cfca.png",
        message: "Looking for collaborators on climate change research project.",
        timestamp: "1 week ago",
        replies: 8,
        isPinned: false
      }
    ]
  });

  const currentMessages = allMessages[selectedTopic as keyof typeof allMessages] || [];
  const filteredTopics = discussionTopics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: currentMessages.length + 1,
        author: "You",
        avatar: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
        message: newMessage,
        timestamp: "Just now",
        replies: 0,
        isPinned: false
      };

      setAllMessages(prev => ({
        ...prev,
        [selectedTopic]: [...(prev[selectedTopic as keyof typeof prev] || []), newMsg]
      }));

      setNewMessage("");
      
      toast({
        title: "Message Sent",
        description: "Your message has been posted to the discussion"
      });
    }
  };

  const handleCreateTopic = () => {
    if (!newTopicTitle.trim() || !newTopicDescription.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const topicId = newTopicTitle.toLowerCase().replace(/\s+/g, '-');
    const newTopic = {
      id: topicId,
      name: newTopicTitle,
      participants: 1,
      unread: 0
    };

    setDiscussionTopics(prev => [...prev, newTopic]);
    setAllMessages(prev => ({
      ...prev,
      [topicId]: [
        {
          id: 1,
          author: "You",
          avatar: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
          message: newTopicDescription,
          timestamp: "Just now",
          replies: 0,
          isPinned: true
        }
      ]
    }));

    setNewTopicTitle("");
    setNewTopicDescription("");
    setSelectedTopic(topicId);

    toast({
      title: "Topic Created",
      description: "Your new discussion topic has been created successfully"
    });
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      toast({
        title: "Search Results",
        description: `Found ${filteredTopics.length} topics matching "${searchTerm}"`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discussion Forum</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search discussions..." 
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Topic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Discussion Topic</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic-title">Topic Title</Label>
                  <Input
                    id="topic-title"
                    placeholder="Enter topic title"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="topic-description">Initial Message</Label>
                  <Textarea
                    id="topic-description"
                    placeholder="Start the discussion..."
                    value={newTopicDescription}
                    onChange={(e) => setNewTopicDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleCreateTopic} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Topic
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Topics Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Discussion Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedTopic === topic.id 
                      ? "bg-blue-100 border-blue-200 border" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{topic.name}</h4>
                      <p className="text-xs text-gray-500">{topic.participants} participants</p>
                    </div>
                    {topic.unread > 0 && (
                      <Badge variant="default" className="text-xs">
                        {topic.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Discussion Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {discussionTopics.find(t => t.id === selectedTopic)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {currentMessages.map((message) => (
                  <div key={message.id} className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={message.avatar} alt={message.author} />
                      <AvatarFallback>{message.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium">{message.author}</h5>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                        {message.isPinned && (
                          <Pin className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{message.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <button className="hover:text-blue-600">Reply</button>
                        <button className="hover:text-blue-600">Like</button>
                        {message.replies > 0 && (
                          <span>{message.replies} replies</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t pt-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>YU</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Join the discussion..."
                      rows={3}
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        Tip: Use @username to mention someone
                      </div>
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        size="sm"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DiscussionTab;
