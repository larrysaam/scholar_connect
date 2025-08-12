
-- Create transactions table
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'earning' or 'withdrawal'
  description text,
  amount numeric NOT NULL,
  status text NOT NULL, -- 'completed', 'pending', 'failed'
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS policy for users to view their own transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy for users to create their own transactions
CREATE POLICY "Users can create their own transactions" 
ON public.transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create payment_methods table
CREATE TABLE public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'bank' or 'mobile'
  name text,
  details jsonb NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on payment_methods table
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS policy for users to view their own payment methods
CREATE POLICY "Users can view their own payment methods" 
ON public.payment_methods
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy for users to manage their own payment methods
CREATE POLICY "Users can manage their own payment methods" 
ON public.payment_methods
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
