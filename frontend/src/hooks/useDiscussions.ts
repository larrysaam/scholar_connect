import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EmailService } from '@/services/emailService';

export interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  category: 'Questions' | 'Tools & Resources' | 'Opportunities' | 'General Discussion';
  likes_count: number;
  replies_count: number;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar_url?: string;
  };
  user_has_liked?: boolean;
}

export interface DiscussionReply {
  id: string;
  content: string;
  created_at: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar_url?: string;
  };
}

export const useDiscussions = () => {
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all discussion posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('discussion_posts')
        .select(`
          id,
          title,
          content,
          category,
          likes_count,
          replies_count,
          created_at,
          updated_at,
          author:users!author_id (
            id,
            name,
            role,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check which posts the current user has liked
      const postsWithLikes = await Promise.all(
        (data || []).map(async (post) => {
          let user_has_liked = false;
          
          if (user) {
            const { data: likeData } = await supabase
              .from('discussion_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .single();
            
            user_has_liked = !!likeData;
          }

          return {
            ...post,
            user_has_liked
          };
        })
      );

      setPosts(postsWithLikes);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load discussions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new discussion post
  const createPost = async (title: string, content: string, category: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('discussion_posts')
        .insert({
          title,
          content,
          category,
          author_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Discussion post created successfully"
      });

      // Refresh posts
      fetchPosts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create post",
        variant: "destructive"
      });
    }
  };

  // Toggle like on a post
  const toggleLike = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from('discussion_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike the post
        const { error } = await supabase
          .from('discussion_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Like the post
        const { error } = await supabase
          .from('discussion_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        if (error) throw error;
      }

      // Refresh posts to update like counts and user like status
      fetchPosts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to toggle like",
        variant: "destructive"
      });
    }
  };

  // Fetch replies for a specific post
  const fetchReplies = async (postId: string): Promise<DiscussionReply[]> => {
    try {
      const { data, error } = await supabase
        .from('discussion_replies')
        .select(`
          id,
          content,
          created_at,
          author:users!author_id (
            id,
            name,
            role,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to load replies",
        variant: "destructive"
      });
      return [];
    }
  };
  // Create a reply to a post
  const createReply = async (postId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get the post author details for email notification
      const { data: postData, error: postError } = await supabase
        .from('discussion_posts')
        .select(`
          title,
          author:users!author_id (
            id,
            name,
            email,
            email_notifications
          )
        `)
        .eq('id', postId)
        .single();

      if (postError) throw postError;

      // Get the reply author's name
      const { data: replyAuthorData, error: authorError } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single();

      if (authorError) throw authorError;

      // Insert the reply
      const { error } = await supabase
        .from('discussion_replies')
        .insert({
          post_id: postId,
          content,
          author_id: user.id
        });

      if (error) throw error;

      // Send email notification to post author (if it's not their own reply and they have notifications enabled)
      if (postData?.author && 
          postData.author.id !== user.id && 
          postData.author.email_notifications !== false) {
        
        const emailService = new EmailService();
        
        try {
          await emailService.sendDiscussionReplyNotification(
            postData.author.email,
            postData.author.name,
            postData.title,
            replyAuthorData?.name || 'Anonymous User',
            content,
            postId
          );
          
          console.log(`Email notification sent to ${postData.author.email} for reply to "${postData.title}"`);
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
          // Don't fail the reply creation if email fails
        }
      }

      toast({
        title: "Success",
        description: "Reply posted successfully"
      });

      // Refresh posts to update reply counts
      fetchPosts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create reply",
        variant: "destructive"
      });
    }
  };

  // Delete a post (only by author)
  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('discussion_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully"
      });

      // Refresh posts
      fetchPosts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete post",
        variant: "destructive"
      });
    }
  };

  // Delete a reply (only by author)
  const deleteReply = async (replyId: string, postId: string) => {
    try {
      const { error } = await supabase
        .from('discussion_replies')
        .delete()
        .eq('id', replyId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reply deleted successfully"
      });

      // Refresh posts to update reply counts
      fetchPosts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete reply",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    toggleLike,
    fetchReplies,
    createReply,
    deletePost,
    deleteReply
  };
};
