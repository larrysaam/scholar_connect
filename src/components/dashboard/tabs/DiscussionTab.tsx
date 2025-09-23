import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, ThumbsUp, Reply, Plus, Heart, Trash2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useDiscussions } from "@/hooks/useDiscussions";

const DiscussionTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    posts, 
    loading, 
    createPost, 
    toggleLike, 
    fetchReplies, 
    createReply, 
    deletePost, 
    deleteReply 
  } = useDiscussions();

  // Form states
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<string>("");
  const [replyText, setReplyText] = useState("");
  const [activeReply, setActiveReply] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, any[]>>({});
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});

  // Optimistic like state for instant UI feedback
  const [optimisticLikes, setOptimisticLikes] = useState<Record<string, boolean>>({});

  // Categories for discussion posts
  const categories = [
    'Questions',
    'Tools & Resources', 
    'Opportunities',
    'General Discussion'
  ];

  // Handle new post creation
  const handleNewPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostCategory) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in title, content, and select a category",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a post",
        variant: "destructive"
      });
      return;
    }

    await createPost(newPostTitle, newPostContent, newPostCategory);
    
    // Clear form
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostCategory("");
  };

  // Handle like toggle
  const handleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like posts",
        variant: "destructive"
      });
      return;
    }

    const post = posts.find(p => p.id === postId);
    const alreadyLiked = (typeof optimisticLikes[postId] === 'boolean' ? optimisticLikes[postId] : post?.user_has_liked);

    // Optimistically update UI
    setOptimisticLikes(prev => ({
      ...prev,
      [postId]: !alreadyLiked
    }));

    // Toggle like in DB (add if not liked, remove if already liked)
    await toggleLike(postId);
  };

  // Handle reply creation
  const handleReply = async (postId: string) => {
    if (!replyText.trim()) {
      toast({
        title: "Empty Reply",
        description: "Please write a reply before posting",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required", 
        description: "Please log in to reply to posts",
        variant: "destructive"
      });
      return;
    }

    await createReply(postId, replyText);
    setReplyText("");
    setActiveReply(null);
    
    // Refresh replies for this post
    handleViewReplies(postId);
  };

  // Handle viewing replies for a post
  const handleViewReplies = async (postId: string) => {
    if (showReplies[postId]) {
      // Hide replies
      setShowReplies(prev => ({ ...prev, [postId]: false }));
    } else {
      // Load and show replies
      const postReplies = await fetchReplies(postId);
      setReplies(prev => ({ ...prev, [postId]: postReplies }));
      setShowReplies(prev => ({ ...prev, [postId]: true }));
    }
  };

  // Handle post deletion
  const handleDeletePost = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
    }
  };

  // Handle reply deletion
  const handleDeleteReply = async (replyId: string, postId: string) => {
    if (confirm("Are you sure you want to delete this reply?")) {
      await deleteReply(replyId, postId);
      // Refresh replies
      handleViewReplies(postId);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes} minutes ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hours ago`;
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading discussions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discussion Forum</h2>
        <Badge variant="secondary">{posts.length} Active Discussions</Badge>
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
          <div className="space-y-2">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="What would you like to discuss?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-category">Category</Label>
            <Select value={newPostCategory} onValueChange={setNewPostCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-content">Content</Label>
            <Textarea
              id="post-content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share your thoughts, questions, or research insights..."
              rows={4}
            />
          </div>

          <Button onClick={handleNewPost} className="w-full">
            <MessageSquare className="h-4 w-4 mr-2" />
            Post Discussion
          </Button>
        </CardContent>
      </Card>

      {/* No Posts Message */}
      {posts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
            <p className="text-gray-500 text-center max-w-md">
              Be the first to start a discussion! Share your research questions, insights, or collaborate with other scholars.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Discussion Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar_url} />
                    <AvatarFallback>
                      {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{post.title}</h4>
                    <p className="text-sm text-gray-600">
                      by {post.author.name} • {post.author.role} • {formatTimestamp(post.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{post.category}</Badge>
                  {user && user.id === post.author.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{post.content}</p>
              
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={((typeof optimisticLikes[post.id] === 'boolean' ? optimisticLikes[post.id] : post.user_has_liked) ? "text-blue-600" : "")}
                >                  <ThumbsUp className={((typeof optimisticLikes[post.id] === 'boolean' ? optimisticLikes[post.id] : post.user_has_liked) ? "h-4 w-4 mr-1 text-blue-600" : "h-4 w-4 mr-1")}/>
                  {post.likes_count}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveReply(activeReply === post.id ? null : post.id)}
                >
                  <Reply className="h-4 w-4 mr-1" />
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewReplies(post.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {showReplies[post.id] ? 'Hide Replies' : `See Replies (${replies?.[post.id]?.length})`}
                </Button>
              </div>

              {/* Reply Form */}
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
                      <Send className="h-4 w-4 mr-1" />
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

              {/* Replies Display */}
              {showReplies[post.id] && replies[post.id] && (
                <div className="border-t pt-4 space-y-4">
                  <h5 className="font-medium text-gray-900">Replies</h5>
                  {replies[post.id].map((reply) => (
                    <div key={reply.id} className="flex space-x-3 bg-gray-50 p-4 rounded-lg">
                      <Avatar className="flex-shrink-0">
                        <AvatarImage src={reply.author.avatar_url} />
                        <AvatarFallback>
                          {reply.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{reply.author.name}</p>
                            <p className="text-xs text-gray-500">
                              {reply.author.role} • {formatTimestamp(reply.created_at)}
                            </p>
                          </div>
                          {user && user.id === reply.author.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReply(reply.id, post.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-gray-700 mt-2">{reply.content}</p>
                      </div>
                    </div>
                  ))}
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
