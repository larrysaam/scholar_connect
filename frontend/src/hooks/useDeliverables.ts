
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabaseClient';

export const useDeliverables = (projectId: string) => {
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliverables = async () => {
      try {
        const { data, error } = await supabase
          .from('deliverables')
          .select('*')
          .eq('project_id', projectId);

        if (error) {
          throw new Error(error.message);
        }

        setDeliverables(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchDeliverables();
    }
  }, [projectId]);

  const createDeliverable = async (deliverable: any) => {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .insert([deliverable])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      setDeliverables((prev) => [...prev, ...(data || [])]);

      return data;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateDeliverable = async (deliverableId: number, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .update(updates)
        .eq('id', deliverableId)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      setDeliverables((prev) =>
        prev.map((d) => (d.id === deliverableId ? { ...d, ...updates } : d))
      );

      return data;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { deliverables, loading, error, createDeliverable, updateDeliverable };
};
