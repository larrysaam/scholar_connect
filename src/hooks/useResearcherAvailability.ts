import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DayAvailability {
  enabled: boolean;
  slots: string[];
}

interface WeeklyAvailability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

export const useResearcherAvailability = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getResearcherAvailability = useCallback(async (researcherId: string): Promise<WeeklyAvailability | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('researcher_profiles')
        .select('availability')
        .eq('user_id', researcherId)
        .single();

      if (error) {
        console.error('Error fetching researcher availability:', error);
        return null;
      }

      return data?.availability as WeeklyAvailability || null;
    } catch (error) {
      console.error('Error fetching availability:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAvailableSlots = useCallback(async (researcherId: string, date: string): Promise<string[]> => {
    try {
      const availability = await getResearcherAvailability(researcherId);
      if (!availability) return [];

      // Get day of week from date
      const selectedDate = new Date(date);
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayKey = dayNames[selectedDate.getDay()] as keyof WeeklyAvailability;

      const dayAvailability = availability[dayKey];
      if (!dayAvailability?.enabled) return [];

      // Get existing bookings for this date
      const { data: bookings } = await supabase
        .from('service_bookings')
        .select('scheduled_time')
        .eq('provider_id', researcherId)
        .eq('scheduled_date', date)
        .in('status', ['pending', 'confirmed']);

      const bookedSlots = bookings?.map(b => b.scheduled_time) || [];
      
      // Filter out booked slots
      return dayAvailability.slots.filter(slot => !bookedSlots.includes(slot));
    } catch (error) {
      console.error('Error getting available slots:', error);
      toast({
        title: "Error",
        description: "Failed to load available time slots",
        variant: "destructive"
      });
      return [];
    }
  }, [toast, getResearcherAvailability]);

  const isDateAvailable = useCallback(async (researcherId: string, date: string): Promise<boolean> => {
    const availability = await getResearcherAvailability(researcherId);
    if (!availability) return false;

    const selectedDate = new Date(date);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayKey = dayNames[selectedDate.getDay()] as keyof WeeklyAvailability;

    return availability[dayKey]?.enabled || false;
  }, [getResearcherAvailability]);

  return {
    loading,
    getResearcherAvailability,
    getAvailableSlots,
    isDateAvailable
  };
};
