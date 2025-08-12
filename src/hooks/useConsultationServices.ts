import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface AcademicLevelPrice {
  id?: string;
  academic_level: 'Undergraduate' | 'Masters' | 'PhD' | 'Postdoc';
  price: number;
  currency: string;
}

export interface ServiceAddon {
  id?: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  is_active: boolean;
}

export interface ServiceAvailability {
  id?: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string;
  end_time: string;
  timezone: string;
  is_active: boolean;
}

export interface ConsultationService {
  id: string;
  user_id: string;
  category: 'General Consultation' | 'Chapter Review' | 'Full Thesis Cycle Support' | 'Full Thesis Review';
  title: string;
  description: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  pricing: AcademicLevelPrice[];
  addons: ServiceAddon[];
  availability: ServiceAvailability[];
}

export interface CreateServiceData {
  category: 'General Consultation' | 'Chapter Review' | 'Full Thesis Cycle Support' | 'Full Thesis Review';
  title: string;
  description: string;
  duration_minutes?: number;
  pricing: Omit<AcademicLevelPrice, 'id'>[];
  addons?: Omit<ServiceAddon, 'id'>[];
  availability?: Omit<ServiceAvailability, 'id'>[];
}

export interface ServiceBooking {
  id: string;
  service_id: string;
  provider_id: string;
  client_id: string;
  academic_level: string;
  base_price: number;
  addon_price: number;
  total_price: number;
  currency: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  meeting_link?: string;
  notes?: string;
  client_notes?: string;
  provider_notes?: string;
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  payment_id?: string;
  created_at: string;
  updated_at: string;
  service?: {
    title: string;
    category: string;
  };
  client?: {
    name: string;
    email: string;
  };
  provider?: {
    name: string;
    email: string;
  };
}

export const useConsultationServices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<ConsultationService[]>([]);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [studentBookings, setStudentBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const normalizeService = (service: any): ConsultationService => ({
    ...service,
    category: service.category as ConsultationService['category'],
    pricing: (service.pricing || []).map((p: any) => ({ ...p, academic_level: p.academic_level as AcademicLevelPrice['academic_level'] })),
    addons: (service.addons || []).map((a: any) => ({ ...a })),
    availability: (service.availability || []).map((av: any) => ({ ...av })),
  });

  const normalizeBooking = (booking: any): ServiceBooking => ({
    ...booking,
    status: booking.status as ServiceBooking['status'],
    payment_status: booking.payment_status as ServiceBooking['payment_status'],
  });

  const fetchServices = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('consultation_services')
        .select(`
          *,
          pricing:service_pricing(*),
          addons:service_addons(*),
          availability:service_availability(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch your services',
          variant: 'destructive',
        });
        return;
      }
      setServices((data || []).map(normalizeService));
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Error',
        description: 'Unexpected error fetching services',
        variant: 'destructive',
      });
    }
  }, [user, toast]);

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select(`
          *,
          service:consultation_services(title, category),
          client:users!service_bookings_client_id_fkey(name, email)
        `)
        .eq('provider_id', user.id)
        .order('scheduled_date', { ascending: true });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch your bookings',
          variant: 'destructive',
        });
        return;
      }
      setBookings((data || []).map(normalizeBooking));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Unexpected error fetching bookings',
        variant: 'destructive',
      });
    }
  }, [user, toast]);

  const fetchStudentBookings = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select(`
          *,
          service:consultation_services(title, category),
          provider:users!service_bookings_provider_id_fkey(name, email)
        `)
        .eq('client_id', user.id)
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.error('Error fetching student bookings:', error);
        return;
      }
      setStudentBookings((data || []).map(normalizeBooking));
    } catch (error) {
      console.error('Error fetching student bookings:', error);
    }
  }, [user]);

  const createService = async (serviceData: CreateServiceData): Promise<boolean> => {
    // Placeholder implementation
    return false;
  };

  const updateService = async (serviceId: string, updates: Partial<CreateServiceData>): Promise<boolean> => {
    // Placeholder implementation
    return false;
  };

  const toggleServiceStatus = async (serviceId: string, isActive: boolean): Promise<boolean> => {
    // Placeholder implementation
    return false;
  };

  const deleteService = async (serviceId: string): Promise<boolean> => {
    // Placeholder implementation
    return false;
  };

  const updateBookingStatus = async (bookingId: string, status: ServiceBooking['status']): Promise<boolean> => {
    // Placeholder implementation
    return false;
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        fetchServices(),
        fetchBookings(),
        fetchStudentBookings(),
      ]).finally(() => setLoading(false));
    }
  }, [user, fetchServices, fetchBookings, fetchStudentBookings]);

  return {
    services,
    bookings,
    studentBookings,
    loading,
    creating,
    updating,
    createService,
    updateService,
    toggleServiceStatus,
    deleteService,
    updateBookingStatus,
    fetchServices,
    fetchBookings,
    fetchStudentBookings,
  };
};
