import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { AcademicLevelPrice, ConsultationService, ServiceAddon, ServiceAvailability } from '@/types/consultations';

export interface CreateServiceData {
  category: 'General Consultation' | 'Chapter Review' | 'Full Thesis Cycle Support' | 'Full Thesis Review';
  title: string;
  description: string;
  duration_minutes?: number;
  pricing: Omit<AcademicLevelPrice, 'id'>[];
  addons?: Omit<ServiceAddon, 'id'>[];
  availability?: Omit<ServiceAvailability, 'id'>[];
  google_meet_link?: string;
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

  const normalizeBooking = useCallback((booking: any): ServiceBooking => ({
    ...booking,
    status: booking.status as ServiceBooking['status'],
    payment_status: booking.payment_status as ServiceBooking['payment_status'],
  }), []);

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
        .select(`*, client:users!service_bookings_client_id_fkey(name, email)`) // Join client user
        .eq('provider_id', user.id)
        .order('scheduled_date', { ascending: true });
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch your bookings',
          variant: 'destructive'
        });
        return;
      }
      const bookingsWithClientNames = await Promise.all(
        (data || []).map(async (booking) => {
          let client = booking.client;
          if (!client) {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('name, email')
              .eq('id', booking.client_id)
              .single();
            if (userError) {
              console.error(`Error fetching user ${booking.client_id}:`, userError);
              client = { name: 'N/A', email: '' };
            } else {
              client = userData;
            }
          }
          return normalizeBooking({ ...booking, client });
        })
      );
      setBookings(bookingsWithClientNames);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Unexpected error fetching bookings',
        variant: 'destructive'
      });
    }
  }, [user, toast, normalizeBooking]);

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
  }, [user, normalizeBooking]);

  const createService = async (serviceData: CreateServiceData): Promise<boolean> => {
    if (!user) return false;
    setCreating(true);
    try {
      // Generate Google Meet link
      const { data: meetLinkData, error: meetLinkError } = await supabase.functions.invoke('generate-meet-link');
      if (meetLinkError || !meetLinkData.meetLink) {
        toast({ title: 'Error', description: 'Failed to generate Google Meet link', variant: 'destructive' });
        setCreating(false);
        return false;
      }

      // Insert the main service
      const { data: service, error } = await supabase
        .from('consultation_services')
        .insert({
          user_id: user.id,
          category: serviceData.category,
          title: serviceData.title,
          description: serviceData.description,
          duration_minutes: serviceData.duration_minutes || 60,
          is_active: true,
          google_meet_link: meetLinkData.meetLink,
        })
        .select()
        .single();
      if (error || !service) {
        toast({ title: 'Error', description: 'Failed to create service', variant: 'destructive' });
        setCreating(false);
        return false;
      }
      // Insert pricing
      if (serviceData.pricing && serviceData.pricing.length > 0) {
        const pricingRows = serviceData.pricing.map(p => ({
          service_id: service.id,
          academic_level: p.academic_level,
          price: p.price,
          currency: p.currency || 'XAF',
        }));
        await supabase.from('service_pricing').insert(pricingRows);
      }
      // Insert addons
      if (serviceData.addons && serviceData.addons.length > 0) {
        const addonRows = serviceData.addons.map(a => ({
          service_id: service.id,
          name: a.name,
          description: a.description || '',
          price: a.price,
          currency: a.currency || 'XAF',
          is_active: true,
        }));
        await supabase.from('service_addons').insert(addonRows);
      }
      await fetchServices();
      toast({ title: 'Service Created', description: 'Your service has been added.', variant: 'default' });
      setCreating(false);
      return true;
    } catch (err) {
      setCreating(false);
      toast({ title: 'Error', description: 'Unexpected error creating service', variant: 'destructive' });
      return false;
    }
  };

  const updateService = async (serviceId: string, updates: Partial<CreateServiceData>): Promise<boolean> => {
    if (!user) return false;
    setUpdating(true);
    try {
      // Update main service fields
      const { error: serviceError } = await supabase
        .from('consultation_services')
        .update({
          category: updates.category,
          title: updates.title,
          description: updates.description,
          duration_minutes: updates.duration_minutes,
        })
        .eq('id', serviceId);
      if (serviceError) {
        toast({ title: 'Error', description: 'Failed to update service', variant: 'destructive' });
        setUpdating(false);
        return false;
      }
      // Update pricing: delete old, insert new
      if (updates.pricing) {
        await supabase.from('service_pricing').delete().eq('service_id', serviceId);
        const pricingRows = updates.pricing.map(p => ({
          service_id: serviceId,
          academic_level: p.academic_level,
          price: p.price,
          currency: p.currency || 'XAF',
        }));
        if (pricingRows.length > 0) {
          await supabase.from('service_pricing').insert(pricingRows);
        }
      }
      // Update addons: delete old, insert new
      if (updates.addons) {
        await supabase.from('service_addons').delete().eq('service_id', serviceId);
        const addonRows = updates.addons.map(a => ({
          service_id: serviceId,
          name: a.name,
          description: a.description || '',
          price: a.price,
          currency: a.currency || 'XAF',
          is_active: true,
        }));
        if (addonRows.length > 0) {
          await supabase.from('service_addons').insert(addonRows);
        }
      }
      // Update availability: delete old, insert new
      if (updates.availability) {
        await supabase.from('service_availability').delete().eq('service_id', serviceId);
        const availabilityRows = updates.availability.map(a => ({
          service_id: serviceId,
          day_of_week: a.day_of_week,
          start_time: a.start_time,
          end_time: a.end_time,
          timezone: a.timezone,
          is_active: a.is_active,
        }));
        if (availabilityRows.length > 0) {
          await supabase.from('service_availability').insert(availabilityRows);
        }
      }
      await fetchServices();
      toast({ title: 'Service Updated', description: 'Your service has been updated.', variant: 'default' });
      setUpdating(false);
      return true;
    } catch (err) {
      setUpdating(false);
      toast({ title: 'Error', description: 'Unexpected error updating service', variant: 'destructive' });
      return false;
    }
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
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('service_bookings')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId);

      if (error) {
        toast({
          title: 'Error',
          description: `Failed to update booking status: ${error.message}`,
          variant: 'destructive',
        });
        return false;
      }

      // Update local state
      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId ? { ...b, status, updated_at: new Date().toISOString() } : b
        )
      );
      setStudentBookings(prev =>
        prev.map(b =>
          b.id === bookingId ? { ...b, status, updated_at: new Date().toISOString() } : b
        )
      );

      toast({
        title: 'Booking Updated',
        description: `Booking status changed to '${status}'.`,
      });
      return true;
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      toast({
        title: 'Error',
        description: 'Unexpected error updating booking status',
        variant: 'destructive',
      });
      return false;
    } finally {
      setUpdating(false);
    }
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