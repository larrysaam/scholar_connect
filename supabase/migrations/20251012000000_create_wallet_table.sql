-- Create wallet table to store user wallet information
CREATE TABLE public.wallet (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on wallet table
ALTER TABLE public.wallet ENABLE ROW LEVEL SECURITY;

-- RLS policy for users to view their own wallet
CREATE POLICY "Users can view their own wallet" 
ON public.wallet
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy for users to update their own wallet
CREATE POLICY "Users can update their own wallet" 
ON public.wallet
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS policy for users to insert their own wallet (though typically this would be done by the system)
CREATE POLICY "Users can insert their own wallet" 
ON public.wallet
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_wallet_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_wallet_updated_at_trigger
  BEFORE UPDATE ON public.wallet
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_updated_at();
