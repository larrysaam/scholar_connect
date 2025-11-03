
-- Migration 1: Create enum types
-- File: 20250611110001_create_enum_types.sql

DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('student', 'expert', 'aid', 'admin');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.sex_type AS ENUM ('male', 'female');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.study_level AS ENUM ('undergraduate', 'masters', 'phd', 'postdoc');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payout_method AS ENUM ('mobile_money', 'bank_transfer', 'paypal');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.consultation_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.job_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'released');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_method AS ENUM ('stripe', 'mobile_money', 'bank_transfer');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_type AS ENUM ('consultation', 'service');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
