-- Create consultation services table
CREATE TABLE IF NOT EXISTS public.consultation_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('General Consultation', 'Chapter Review', 'Full Thesis Cycle Support', 'Full Thesis Review')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create service pricing table for different academic levels
CREATE TABLE IF NOT EXISTS public.service_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.consultation_services(id) ON DELETE CASCADE NOT NULL,
    academic_level TEXT NOT NULL CHECK (academic_level IN ('Undergraduate', 'Masters', 'PhD', 'Postdoc')),
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'XAF' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(service_id, academic_level)
);

-- Create service add-ons table
CREATE TABLE IF NOT EXISTS public.service_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.consultation_services(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'XAF' NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create service availability table
CREATE TABLE IF NOT EXISTS public.service_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.consultation_services(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone TEXT DEFAULT 'Africa/Douala',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create service bookings table
CREATE TABLE IF NOT EXISTS public.service_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.consultation_services(id) ON DELETE CASCADE NOT NULL,
    provider_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    academic_level TEXT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    addon_price DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'XAF' NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    meeting_link TEXT,
    notes TEXT,
    client_notes TEXT,
    provider_notes TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create booking add-ons junction table
CREATE TABLE IF NOT EXISTS public.booking_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.service_bookings(id) ON DELETE CASCADE NOT NULL,
    addon_id UUID REFERENCES public.service_addons(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultation_services_user_id ON public.consultation_services(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_services_category ON public.consultation_services(category);
CREATE INDEX IF NOT EXISTS idx_consultation_services_active ON public.consultation_services(is_active);

CREATE INDEX IF NOT EXISTS idx_service_pricing_service_id ON public.service_pricing(service_id);
CREATE INDEX IF NOT EXISTS idx_service_pricing_academic_level ON public.service_pricing(academic_level);

CREATE INDEX IF NOT EXISTS idx_service_addons_service_id ON public.service_addons(service_id);
CREATE INDEX IF NOT EXISTS idx_service_addons_active ON public.service_addons(is_active);

CREATE INDEX IF NOT EXISTS idx_service_availability_service_id ON public.service_availability(service_id);
CREATE INDEX IF NOT EXISTS idx_service_availability_day ON public.service_availability(day_of_week);

CREATE INDEX IF NOT EXISTS idx_service_bookings_service_id ON public.service_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_provider_id ON public.service_bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_client_id ON public.service_bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON public.service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_service_bookings_date ON public.service_bookings(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_booking_addons_booking_id ON public.booking_addons(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_addons_addon_id ON public.booking_addons(addon_id);

-- Enable RLS
ALTER TABLE public.consultation_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_addons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for consultation_services
CREATE POLICY "Users can view all active services" ON public.consultation_services
    FOR SELECT USING (is_active = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own services" ON public.consultation_services
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own services" ON public.consultation_services
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own services" ON public.consultation_services
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for service_pricing
CREATE POLICY "Users can view pricing for active services" ON public.service_pricing
    FOR SELECT USING (
        service_id IN (
            SELECT id FROM public.consultation_services 
            WHERE is_active = true OR user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage pricing for their services" ON public.service_pricing
    FOR ALL USING (
        service_id IN (
            SELECT id FROM public.consultation_services 
            WHERE user_id = auth.uid()
        )
    );

-- Create RLS policies for service_addons
CREATE POLICY "Users can view addons for active services" ON public.service_addons
    FOR SELECT USING (
        service_id IN (
            SELECT id FROM public.consultation_services 
            WHERE is_active = true OR user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage addons for their services" ON public.service_addons
    FOR ALL USING (
        service_id IN (
            SELECT id FROM public.consultation_services 
            WHERE user_id = auth.uid()
        )
    );

-- Create RLS policies for service_availability
CREATE POLICY "Users can view availability for active services" ON public.service_availability
    FOR SELECT USING (
        service_id IN (
            SELECT id FROM public.consultation_services 
            WHERE is_active = true OR user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage availability for their services" ON public.service_availability
    FOR ALL USING (
        service_id IN (
            SELECT id FROM public.consultation_services 
            WHERE user_id = auth.uid()
        )
    );

-- Create RLS policies for service_bookings
CREATE POLICY "Users can view their bookings" ON public.service_bookings
    FOR SELECT USING (auth.uid() = provider_id OR auth.uid() = client_id);

CREATE POLICY "Clients can create bookings" ON public.service_bookings
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Providers and clients can update their bookings" ON public.service_bookings
    FOR UPDATE USING (auth.uid() = provider_id OR auth.uid() = client_id);

-- Create RLS policies for booking_addons
CREATE POLICY "Users can view booking addons for their bookings" ON public.booking_addons
    FOR SELECT USING (
        booking_id IN (
            SELECT id FROM public.service_bookings 
            WHERE provider_id = auth.uid() OR client_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage booking addons for their bookings" ON public.booking_addons
    FOR ALL USING (
        booking_id IN (
            SELECT id FROM public.service_bookings 
            WHERE provider_id = auth.uid() OR client_id = auth.uid()
        )
    );

-- Grant necessary permissions
GRANT ALL ON public.consultation_services TO authenticated;
GRANT ALL ON public.service_pricing TO authenticated;
GRANT ALL ON public.service_addons TO authenticated;
GRANT ALL ON public.service_availability TO authenticated;
GRANT ALL ON public.service_bookings TO authenticated;
GRANT ALL ON public.booking_addons TO authenticated;