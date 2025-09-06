import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useAidSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
