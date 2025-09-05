-- Create appointment_requests table
CREATE TABLE IF NOT EXISTS public.appointment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    research_aid_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES public.consultation_services(id) ON DELETE SET NULL,
    requested_date DATE NOT NULL,
    requested_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    meeting_type VARCHAR(20) DEFAULT 'video' CHECK (meeting_type IN ('video', 'phone', 'in-person')),
    project_description TEXT NOT NULL,
    specific_requirements TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for appointment_requests
CREATE INDEX IF NOT EXISTS idx_appointment_requests_student_id ON public.appointment_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_appointment_requests_research_aid_id ON public.appointment_requests(research_aid_id);
CREATE INDEX IF NOT EXISTS idx_appointment_requests_status ON public.appointment_requests(status);
CREATE INDEX IF NOT EXISTS idx_appointment_requests_date ON public.appointment_requests(requested_date);

-- Add new columns to service_bookings for appointment functionality
ALTER TABLE public.service_bookings 
ADD COLUMN IF NOT EXISTS meeting_type VARCHAR(20) DEFAULT 'video' CHECK (meeting_type IN ('video', 'phone', 'in-person')),
ADD COLUMN IF NOT EXISTS project_description TEXT,
ADD COLUMN IF NOT EXISTS location TEXT;

-- Create research_aid_availability table for managing availability
CREATE TABLE IF NOT EXISTS public.research_aid_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    research_aid_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for availability
CREATE INDEX IF NOT EXISTS idx_research_aid_availability_aid_id ON public.research_aid_availability(research_aid_id);
CREATE INDEX IF NOT EXISTS idx_research_aid_availability_day ON public.research_aid_availability(day_of_week);

-- Create appointment_payments table for payment tracking
CREATE TABLE IF NOT EXISTS public.appointment_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_request_id UUID REFERENCES public.appointment_requests(id) ON DELETE CASCADE,
    service_booking_id UUID REFERENCES public.service_bookings(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    research_aid_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50) DEFAULT 'mock', -- 'mock', 'stripe', 'paypal', etc.
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for payments
CREATE INDEX IF NOT EXISTS idx_appointment_payments_student_id ON public.appointment_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_appointment_payments_research_aid_id ON public.appointment_payments(research_aid_id);
CREATE INDEX IF NOT EXISTS idx_appointment_payments_status ON public.appointment_payments(payment_status);

-- Enable RLS on new tables
ALTER TABLE public.appointment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_aid_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for appointment_requests
CREATE POLICY "Students can create their own appointment requests" ON public.appointment_requests
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view their own appointment requests" ON public.appointment_requests
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Research aids can view requests made to them" ON public.appointment_requests
    FOR SELECT USING (auth.uid() = research_aid_id);

CREATE POLICY "Research aids can update requests made to them" ON public.appointment_requests
    FOR UPDATE USING (auth.uid() = research_aid_id);

CREATE POLICY "Students can update their own requests" ON public.appointment_requests
    FOR UPDATE USING (auth.uid() = student_id);

-- RLS Policies for research_aid_availability
CREATE POLICY "Research aids can manage their own availability" ON public.research_aid_availability
    FOR ALL USING (auth.uid() = research_aid_id);

CREATE POLICY "Anyone can view research aid availability" ON public.research_aid_availability
    FOR SELECT USING (true);

-- RLS Policies for appointment_payments
CREATE POLICY "Users can view their own payment records" ON public.appointment_payments
    FOR SELECT USING (auth.uid() = student_id OR auth.uid() = research_aid_id);

CREATE POLICY "System can create payment records" ON public.appointment_payments
    FOR INSERT WITH CHECK (true); -- This will be handled by the application

-- Grant permissions
GRANT ALL ON public.appointment_requests TO authenticated;
GRANT ALL ON public.research_aid_availability TO authenticated;
GRANT ALL ON public.appointment_payments TO authenticated;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_appointment_requests_updated_at 
    BEFORE UPDATE ON public.appointment_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_aid_availability_updated_at 
    BEFORE UPDATE ON public.research_aid_availability 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_payments_updated_at 
    BEFORE UPDATE ON public.appointment_payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate meeting links
CREATE OR REPLACE FUNCTION generate_meeting_link(meeting_type TEXT)
RETURNS TEXT AS $$
BEGIN
    CASE meeting_type
        WHEN 'video' THEN
            RETURN 'https://meet.google.com/' || substr(md5(random()::text), 1, 12);
        ELSE
            RETURN NULL;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle appointment request acceptance
CREATE OR REPLACE FUNCTION accept_appointment_request(request_id UUID)
RETURNS UUID AS $$
DECLARE
    request_record public.appointment_requests%ROWTYPE;
    booking_id UUID;
    meeting_link TEXT;
BEGIN
    -- Get the request details
    SELECT * INTO request_record FROM public.appointment_requests WHERE id = request_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Appointment request not found';
    END IF;
    
    -- Generate meeting link if needed
    meeting_link := generate_meeting_link(request_record.meeting_type);
    
    -- Create service booking
    INSERT INTO public.service_bookings (
        client_id,
        provider_id,
        service_id,
        scheduled_date,
        scheduled_time,
        duration_minutes,
        meeting_type,
        status,
        payment_status,
        meeting_link,
        project_description,
        notes
    ) VALUES (
        request_record.student_id,
        request_record.research_aid_id,
        request_record.service_id,
        request_record.requested_date,
        request_record.requested_time,
        request_record.duration_minutes,
        request_record.meeting_type,
        'confirmed',
        request_record.payment_status,
        meeting_link,
        request_record.project_description,
        request_record.specific_requirements
    ) RETURNING id INTO booking_id;
    
    -- Update request status
    UPDATE public.appointment_requests 
    SET status = 'accepted', updated_at = NOW()
    WHERE id = request_id;
    
    RETURN booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION accept_appointment_request(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_meeting_link(TEXT) TO authenticated;