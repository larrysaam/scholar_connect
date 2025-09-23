-- Create discussion_posts table
CREATE TABLE discussion_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Questions', 'Tools & Resources', 'Opportunities', 'General Discussion')),
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create discussion_replies table
CREATE TABLE discussion_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES discussion_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create discussion_likes table
CREATE TABLE discussion_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES discussion_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id) -- Prevent duplicate likes
);

-- Function to update reply count when reply is added/removed
CREATE OR REPLACE FUNCTION update_post_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE discussion_posts 
    SET replies_count = replies_count + 1,
        updated_at = NOW()
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE discussion_posts 
    SET replies_count = replies_count - 1,
        updated_at = NOW()
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update like count when like is added/removed
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE discussion_posts 
    SET likes_count = likes_count + 1,
        updated_at = NOW()
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE discussion_posts 
    SET likes_count = likes_count - 1,
        updated_at = NOW()
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_reply_count
  AFTER INSERT OR DELETE ON discussion_replies
  FOR EACH ROW EXECUTE FUNCTION update_post_reply_count();

CREATE TRIGGER trigger_update_like_count
  AFTER INSERT OR DELETE ON discussion_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

-- Enable Row Level Security
ALTER TABLE discussion_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for discussion_posts
CREATE POLICY "Anyone can view posts" ON discussion_posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON discussion_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON discussion_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts" ON discussion_posts
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for discussion_replies
CREATE POLICY "Anyone can view replies" ON discussion_replies
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create replies" ON discussion_replies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = author_id);

CREATE POLICY "Users can update own replies" ON discussion_replies
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own replies" ON discussion_replies
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for discussion_likes
CREATE POLICY "Anyone can view likes" ON discussion_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can create own likes" ON discussion_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON discussion_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_discussion_posts_author_id ON discussion_posts(author_id);
CREATE INDEX idx_discussion_posts_created_at ON discussion_posts(created_at DESC);
CREATE INDEX idx_discussion_posts_category ON discussion_posts(category);
CREATE INDEX idx_discussion_replies_post_id ON discussion_replies(post_id);
CREATE INDEX idx_discussion_replies_author_id ON discussion_replies(author_id);
CREATE INDEX idx_discussion_likes_post_id ON discussion_likes(post_id);
CREATE INDEX idx_discussion_likes_user_id ON discussion_likes(user_id);
