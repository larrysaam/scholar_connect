
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Reply, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DiscussionTab = () => {
  const { toast } = useToast();
  const [newPost, setNewPost] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReply, setActiveReply] = useState<string | null>(null);

  // Sample discussion posts visible to all users
  const discussionPosts = [
    {
      id: "1",
      author: "Dr. Sarah Johnson",
      authorRole: "Professor",
      title: "Best Practices for Literature Reviews in AI Research",
      content: "I'd like to discuss effective strategies for conducting comprehensive literature reviews in artificial intelligence research. What databases and search strategies do you recommend?",
      timestamp: "2 hours ago",
      likes: 15,
      replies: 8,
      category: "Research Methods"
    },
    {
      id: "2", 
      author: "Prof. Michael Chen",
      authorRole: "Associate Professor",
      title: "Collaboration Opportunities in Machine Learning",
      content: "Looking for researchers interested in collaborative projects focused on machine learning applications in healthcare. Anyone working in similar areas?",
      timestamp: "5 hours ago", 
      likes: 23,
      replies: 12,
      category: "Collaboration"
    },
    {
      id: "3",
      author: "Dr. Amina Hassan",
      authorRole: "Research Fellow", 
      title: "Funding Opportunities for Graduate Students",
      content: "Has anyone come across good funding opportunities for graduate students in computer science? I'm particularly interested in scholarships for African students.",
      timestamp: "1 day ago",
      likes: 31,
      replies: 18,
      category: "Funding"
    },
    {
      id: "4",
      author: "Marie Kouadio",
      authorRole: "PhD Student",
      title: "Statistical Analysis Software Recommendations",
      content: "I'm working on my thesis and need recommendations for statistical analysis software. Currently using SPSS but wondering if there are better alternatives for complex data analysis.",
      timestamp: "2 days ago",
      likes: 19,
      replies: 14,
      category: "Tools & Software"
    }
  ];

  const handleNewPost = () => {
    if (!newPost.trim()) {
      toast({
        title: "Empty Post",
        description: "Please write something before posting",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Post Created",
      description: "Your discussion post has been published"
    });
    setNewPost("");
  };

  const handleLike = (postId: string) => {
    toast({
      title: "Post Liked",
      description: "You liked this post"
    });
  };

  const handleReply = (postId: string) => {
    if (!replyText.trim()) {
      toast({
        title: "Empty Reply",
        description: "Please write a reply before posting",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reply Posted",
      description: "Your reply has been added to the discussion"
    });
    setReplyText("");
    setActiveReply(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discussion Forum</h2>
        <Badge variant="secondary">{discussionPosts.length} Active Discussions</Badge>
      </div>

      {/* Create New Post */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Start New Discussion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What would you like to discuss? Share your thoughts, questions, or research insights..."
            rows={4}
          />
          <Button onClick={handleNewPost}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Post Discussion
          </Button>
        </CardContent>
      </Card>

      {/* Discussion Posts */}
      <div className="space-y-4">
        {discussionPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{post.title}</h4>
                    <p className="text-sm text-gray-600">
                      by {post.author} • {post.authorRole} • {post.timestamp}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">{post.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{post.content}</p>
              
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleLike(post.id)}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {post.likes}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveReply(activeReply === post.id ? null : post.id)}
                >
                  <Reply className="h-4 w-4 mr-1" />
                  Reply ({post.replies})
                </Button>
              </div>

              {/* Reply Section */}
              {activeReply === post.id && (
                <div className="border-t pt-4 space-y-3">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleReply(post.id)}>
                      Post Reply
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setActiveReply(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DiscussionTab;
