import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Reply, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  created_at: string;
  updated_at: string;
  parent_id: string | null;
  replies?: Comment[];
}

interface CommentsSectionProps {
  projectId: string;
  canComment?: boolean;
}

export default function CommentsSection({ projectId, canComment = true }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
  }, [projectId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("project_comments")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const commentsMap: { [key: string]: Comment } = {};
      const rootComments: Comment[] = [];

      data.forEach((comment: any) => {
        const formattedComment: Comment = {
          id: comment.id,
          content: comment.content,
          author_id: comment.author_id,
          author_name: comment.author_name,
          author_avatar: comment.author_avatar,
          created_at: comment.created_at,
          updated_at: comment.updated_at,
          parent_id: comment.parent_id,
          replies: [],
        };

        commentsMap[comment.id] = formattedComment;

        if (comment.parent_id) {
          commentsMap[comment.parent_id]?.replies?.push(formattedComment);
        } else {
          rootComments.push(formattedComment);
        }
      });

      setComments(rootComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from("project_comments")
        .insert({
          content: newComment,
          author_id: user.id,
          author_name: user.user_metadata?.full_name || "Anonymous",
          author_avatar: user.user_metadata?.avatar_url || null,
          project_id: projectId,
          parent_id: null,
        })
        .select()
        .single();

      if (error) throw error;

      const newCommentData: Comment = {
        id: data.id,
        content: data.content,
        author_id: data.author_id,
        author_name: data.author_name,
        author_avatar: data.author_avatar,
        created_at: data.created_at,
        updated_at: data.updated_at,
        parent_id: data.parent_id,
        replies: [],
      };

      setComments([...comments, newCommentData]);
      setNewComment("");

      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !user) return;

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from("project_comments")
        .insert({
          content: replyContent,
          author_id: user.id,
          author_name: user.user_metadata?.full_name || "Anonymous",
          author_avatar: user.user_metadata?.avatar_url || null,
          project_id: projectId,
          parent_id: parentId,
        })
        .select()
        .single();

      if (error) throw error;

      const newReply: Comment = {
        id: data.id,
        content: data.content,
        author_id: data.author_id,
        author_name: data.author_name,
        author_avatar: data.author_avatar,
        created_at: data.created_at,
        updated_at: data.updated_at,
        parent_id: data.parent_id,
        replies: [],
      };

      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      });

      setComments(updatedComments);
      setReplyContent("");
      setReplyTo(null);

      toast({
        title: "Success",
        description: "Reply added successfully",
      });
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "ml-8 mt-3" : "mb-4"}`}>
      <Card className="border-l-4 border-l-blue-500/20">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author_avatar || undefined} />
              <AvatarFallback>
                {comment.author_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{comment.author_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(comment.created_at)}
                  </span>
                  {!isReply && (
                    <Badge variant="outline" className="text-xs">
                      Comment
                    </Badge>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {comment.author_id === user?.id && (
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    )}
                    {!isReply && canComment && (
                      <DropdownMenuItem onClick={() => setReplyTo(comment.id)}>
                        Reply
                      </DropdownMenuItem>
                    )}
                    {comment.author_id === user?.id && (
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="mt-2 text-sm leading-relaxed">{comment.content}</p>

              {/* Reply form */}
              {replyTo === comment.id && !isReply && (
                <div className="mt-3 space-y-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-[80px] text-sm"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReplyTo(null);
                        setReplyContent("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyContent.trim() || isSubmitting}
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Comments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Comments</span>
              <Badge variant="secondary">{comments.length}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* New comment form */}
          {canComment && (
            <div className="space-y-3 pb-4 border-b">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this project..."
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Post Comment</span>
                </Button>
              </div>
            </div>
          )}

          {/* Comments list */}
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No comments yet</p>
              {canComment && <p className="text-sm">Be the first to share your thoughts!</p>}
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => renderComment(comment))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
