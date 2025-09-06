import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useConsultationServices } from "./useConsultationServices";
import { AcademicLevelPrice } from "@/types/consultations";

export function useAidSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { createService, services, updateService, fetchServices } = useConsultationServices();

  // Fetch settings from DB
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("research_aid_profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setSettings(data);
        setLoading(false);
      });
  }, [user]);

  // --- Auto-create or update 'Appointment' consultation service with correct price ---
  const ensureAppointmentService = async (hourlyRate: number) => {
    if (!user) return;
    try {
      // Always fetch latest services directly from supabase to ensure up-to-date list
      const { data: freshServices, error: freshError } = await supabase
        .from("consultation_services")
        .select("*, pricing:service_pricing(*)")
        .eq("user_id", user.id);
      if (freshError) {
        console.error('Error fetching services:', freshError);
        throw new Error(freshError.message);
      }
      const defaultTitle = "Appointment";
      const defaultCategory = "General Consultation";
      let defaultService = (freshServices || []).find(
        (s) => s.title === defaultTitle && s.category === defaultCategory
      );
      // Cover all academic levels for pricing
      const defaultPricing: AcademicLevelPrice[] = [
        { academic_level: "Undergraduate", price: hourlyRate, currency: "XAF" },
        { academic_level: "Masters", price: hourlyRate, currency: "XAF" },
        { academic_level: "PhD", price: hourlyRate, currency: "XAF" },
        { academic_level: "Postdoc", price: hourlyRate, currency: "XAF" },
      ];
      if (!defaultService) {
        // Create the default service
        const created = await createService({
          category: defaultCategory,
          title: defaultTitle,
          description: "Book a general research consultation appointment.",
          duration_minutes: 60,
          pricing: defaultPricing,
        });
        if (!created) {
          console.error('Failed to create Appointment service');
          throw new Error('Failed to create Appointment service');
        }
        await fetchServices();
      } else {
        // Update price in service_pricing if needed
        const hasAllCorrectPrices = ["Undergraduate","Masters","PhD","Postdoc"].every(level =>
          (defaultService.pricing || []).some(
            (p) => p.academic_level === level && p.price === hourlyRate
          )
        );
        if (!hasAllCorrectPrices) {
          const updated = await updateService(defaultService.id, {
            pricing: defaultPricing,
          });
          if (!updated) {
            console.error('Failed to update Appointment service pricing');
            throw new Error('Failed to update Appointment service pricing');
          }
          await fetchServices();
        }
      }
      // Force a direct DB check and log result
      const { data: verifyServices, error: verifyError } = await supabase
        .from("consultation_services")
        .select("*, pricing:service_pricing(*)")
        .eq("user_id", user.id);
      if (verifyError) {
        console.error('Verification fetch error:', verifyError);
      } else {
        const found = (verifyServices || []).find(
          (s) => s.title === defaultTitle && s.category === defaultCategory
        );
        if (!found) {
          console.error('Appointment service NOT found after creation/update!');
        } else {
          console.log('Appointment service found after creation/update:', found);
        }
      }
    } catch (err) {
      console.error('Error in Appointment service auto-create/update:', err);
    }
  };

  // Update settings in DB
  const updateSettings = async (updates: any) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("research_aid_profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setSettings(data);
    if (typeof updates.hourly_rate === "number" && updates.hourly_rate > 0) {
      await ensureAppointmentService(updates.hourly_rate);
    }
    return data;
  };

  // Change password (auth)
  const changePassword = async (currentPassword: string, newPassword: string) => {
    // This requires re-authentication in Supabase; placeholder for now
    // You may want to use supabase.auth.updateUser({ password: newPassword })
    return supabase.auth.updateUser({ password: newPassword });
  };

  // Payment methods CRUD (simplified)
  const fetchPaymentMethods = async () => {
    if (!user) return [];
    const { data } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", user.id);
    return data || [];
  };
  const addPaymentMethod = async (method: any) => {
    if (!user) return;
    await supabase.from("payment_methods").insert({ ...method, user_id: user.id });
    return fetchPaymentMethods();
  };
  const removePaymentMethod = async (id: number) => {
    await supabase.from("payment_methods").delete().eq("id", id);
    return fetchPaymentMethods();
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    changePassword,
    fetchPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
  };
}
