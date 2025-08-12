-- Restore researcher access to consultations, bookings, services, and profiles
-- Run this SQL in Supabase SQL editor or as a migration

-- Consultations: allow experts to view and create their consultations
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Experts can view their consultations" ON public.consultations
  FOR SELECT USING (auth.uid() = expert_id);
CREATE POLICY "Experts can create consultations" ON public.consultations
  FOR INSERT WITH CHECK (auth.uid() = expert_id);
CREATE POLICY "Experts can update their consultations" ON public.consultations
  FOR UPDATE USING (auth.uid() = expert_id);
CREATE POLICY "Experts can delete their consultations" ON public.consultations
  FOR DELETE USING (auth.uid() = expert_id);

-- Service bookings: allow providers (researchers) to view and manage their bookings
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Providers can view their bookings" ON public.service_bookings
  FOR SELECT USING (auth.uid() = provider_id);
CREATE POLICY "Providers can update their bookings" ON public.service_bookings
  FOR UPDATE USING (auth.uid() = provider_id);

-- Consultation services: allow researchers to view and manage their own services
ALTER TABLE public.consultation_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Researchers can view their services" ON public.consultation_services
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Researchers can create services" ON public.consultation_services
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Researchers can update their services" ON public.consultation_services
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Researchers can delete their services" ON public.consultation_services
  FOR DELETE USING (auth.uid() = user_id);

-- Researcher profiles: allow researchers to view and manage their own profile
ALTER TABLE public.researcher_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Researchers can view their profile" ON public.researcher_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Researchers can create their profile" ON public.researcher_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Researchers can update their profile" ON public.researcher_profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Researchers can delete their profile" ON public.researcher_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Researcher reviews: allow anyone to view public reviews, and users to create reviews for researchers
ALTER TABLE public.researcher_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public researcher reviews" ON public.researcher_reviews
  FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create reviews for researchers" ON public.researcher_reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id AND auth.uid() != researcher_id);
CREATE POLICY "Users can update their own reviews" ON public.researcher_reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);
CREATE POLICY "Users can delete their own reviews" ON public.researcher_reviews
  FOR DELETE USING (auth.uid() = reviewer_id);
