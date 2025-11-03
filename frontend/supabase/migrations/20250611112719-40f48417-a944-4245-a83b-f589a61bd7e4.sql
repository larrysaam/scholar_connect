
-- Migration 3: Update other tables to use enum types
-- File: 20250611110003_update_other_tables_enums.sql

-- Update consultations table
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'consultations') THEN
        -- Add status column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consultations' AND column_name = 'status') THEN
            ALTER TABLE public.consultations ADD COLUMN status consultation_status DEFAULT 'pending'::consultation_status;
        ELSE
            -- Update existing status column to use enum
            ALTER TABLE public.consultations ALTER COLUMN status TYPE consultation_status USING status::text::consultation_status;
        END IF;
    END IF;
END $$;

-- Update jobs table
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jobs') THEN
        -- Add status column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'status') THEN
            ALTER TABLE public.jobs ADD COLUMN status job_status DEFAULT 'pending'::job_status;
        ELSE
            -- Update existing status column to use enum
            ALTER TABLE public.jobs ALTER COLUMN status TYPE job_status USING status::text::job_status;
        END IF;
    END IF;
END $$;

-- Update payments table
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
        -- Update status column
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'status') THEN
            ALTER TABLE public.payments ALTER COLUMN status TYPE payment_status USING status::text::payment_status;
        END IF;
        
        -- Update payment_method column
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'payment_method') THEN
            ALTER TABLE public.payments ALTER COLUMN payment_method TYPE payment_method USING payment_method::text::payment_method;
        END IF;
        
        -- Update payment_type column
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'payment_type') THEN
            ALTER TABLE public.payments ALTER COLUMN payment_type TYPE payment_type USING payment_type::text::payment_type;
        END IF;
    END IF;
END $$;

-- Update withdrawals table
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'withdrawals') THEN
        -- Update status column
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'withdrawals' AND column_name = 'status') THEN
            ALTER TABLE public.withdrawals ALTER COLUMN status TYPE payment_status USING status::text::payment_status;
        END IF;
        
        -- Update payout_method column
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'withdrawals' AND column_name = 'payout_method') THEN
            ALTER TABLE public.withdrawals ALTER COLUMN payout_method TYPE payout_method USING payout_method::text::payout_method;
        END IF;
    END IF;
END $$;
