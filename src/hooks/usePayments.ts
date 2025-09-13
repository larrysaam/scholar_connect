import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface Earning {
  id: string;
  project: string;
  client: string;
  amount: number;
  date: string;
  status: string;
  type: string;
  source: 'job' | 'appointment';
}

export interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal';
  description: string;
  amount: number;
  date: string;
  status: string;
}

export interface PaymentMethod {
  id: string;
  type: 'bank' | 'mobile';
  name: string;
  details: any;
  is_default: boolean;
}

export const usePayments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [studentPayments, setStudentPayments] = useState<any[]>([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchWalletBalance = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching wallet balance:', error);
        toast({
          title: "Error",
          description: "Failed to fetch wallet balance",
          variant: "destructive",
        });
        return;
      }

      setAvailableBalance(data?.wallet_balance || 0);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  }, [user, toast]);

  const fetchEarnings = useCallback(async () => {
    if (!user) return;

    try {
      // 1. Fetch appointment earnings (service_bookings)
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('service_bookings')
        .select(`
          id,
          scheduled_date,
          total_price,
          status,
          service:consultation_services(title),
          client:users!service_bookings_client_id_fkey(name)
        `)
        .eq('provider_id', user.id)
        .in('status', ['confirmed', 'completed']) // <-- include confirmed and completed
        .eq('payment_status', 'paid');

      if (appointmentError) {
        console.error('Error fetching appointment earnings:', appointmentError);
      }

      const appointmentEarnings = (appointmentData || []).map(booking => ({
        id: booking.id,
        project: booking.service?.title || 'N/A',
        client: booking.client?.name || 'N/A',
        amount: booking.total_price,
        date: new Date(booking.scheduled_date).toLocaleDateString(),
        status: booking.status,
        type: 'consultation' as const,
        source: 'appointment' as const,
      }));

      // 2. Fetch job earnings (job_applications + jobs)
      const { data: jobApplications, error: jobError } = await supabase
        .from('job_applications')
        .select(`
          id,
          job_id,
          status,
          created_at,
          jobs:job_id (title, budget, user_id, client:users(name))
        `)
        .eq('applicant_id', user.id)
        .eq('status', 'accepted');

      if (jobError) {
        console.error('Error fetching job earnings:', jobError);
      }

      // Only count jobs that are completed and paid (if you have a payment status, filter here)
      const jobEarnings = (jobApplications || []).map(app => ({
        id: app.id,
        project: app.jobs?.title || 'N/A',
        client: app.jobs?.client?.name || 'N/A',
        amount: app.jobs?.budget || 0,
        date: new Date(app.created_at).toLocaleDateString(),
        status: app.status,
        type: 'job' as const,
        source: 'job' as const,
      }));

      // Merge and sort by date desc
      const allEarnings = [...appointmentEarnings, ...jobEarnings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEarnings(allEarnings);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  }, [user]);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      const formattedTransactions = data.map(tx => ({
        id: tx.id,
        type: (tx.type === 'earning' || tx.type === 'withdrawal') ? tx.type : 'earning',
        description: tx.description,
        amount: tx.amount,
        date: new Date(tx.created_at).toLocaleDateString(),
        status: tx.status,
      }));

      setTransactions(formattedTransactions as Transaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [user]);

  const fetchPaymentMethods = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching payment methods:', error);
        return;
      }

      setPaymentMethods((data || []).map((pm: any) => ({
        ...pm,
        type: pm.type === 'bank' ? 'bank' : 'mobile',
      })));
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  }, [user]);

  const fetchStudentPayments = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select(`
          id,
          scheduled_date,
          created_at,
          total_price,
          payment_status,
          provider:users!service_bookings_provider_id_fkey(name)
        `)
        .eq('client_id', user.id)
        .eq('payment_status', 'paid');

      if (error) {
        console.error('Error fetching student payments:', error);
        return;
      }

      const formattedPayments = data.map(payment => ({
        id: payment.id,
        date: new Date(payment.created_at).toLocaleDateString(), // Use created_at for payment date
        researcher: payment.provider?.name || 'N/A',
        amount: payment.total_price,
        status: payment.payment_status,
      }));

      setStudentPayments(formattedPayments);
    } catch (error) {
      console.error('Error fetching student payments:', error);
    }
  }, [user]);

  const requestWithdrawal = async (amount: number) => {
    if (!user) return;

    try {
      // 1. Check if balance is sufficient
      if (amount > availableBalance) {
        toast({ title: "Error", description: "Insufficient balance", variant: "destructive" });
        return;
      }

      // 2. Create a withdrawal transaction
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          description: 'Withdrawal request',
          amount: -amount,
          status: 'pending',
        })
        .select()
        .single();

      if (txError) {
        console.error('Error creating withdrawal transaction:', txError);
        toast({ title: "Error", description: "Failed to request withdrawal", variant: "destructive" });
        return;
      }

      // 3. Update user's wallet balance
      const { error: userError } = await supabase
        .from('users')
        .update({ wallet_balance: availableBalance - amount })
        .eq('id', user.id);

      if (userError) {
        // If this fails, we should ideally roll back the transaction
        console.error('Error updating wallet balance:', userError);
        toast({ title: "Error", description: "Failed to update wallet balance", variant: "destructive" });
        return;
      }

      // 4. Refresh data
      await Promise.all([fetchWalletBalance(), fetchTransactions()]);

      toast({ title: "Success", description: "Withdrawal requested successfully" });

    } catch (error) {
      console.error('Error requesting withdrawal:', error);
    }
  };

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'is_default'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({ ...method, user_id: user.id });

      if (error) {
        console.error('Error adding payment method:', error);
        toast({ title: "Error", description: "Failed to add payment method", variant: "destructive" });
        return;
      }

      await fetchPaymentMethods();
      toast({ title: "Success", description: "Payment method added successfully" });

    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  };

  const updatePaymentMethod = async (method: PaymentMethod) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('payment_methods')
        .update(method)
        .eq('id', method.id);

      if (error) {
        console.error('Error updating payment method:', error);
        toast({ title: "Error", description: "Failed to update payment method", variant: "destructive" });
        return;
      }

      await fetchPaymentMethods();
      toast({ title: "Success", description: "Payment method updated successfully" });

    } catch (error) {
      console.error('Error updating payment method:', error);
    }
  };

  const deletePaymentMethod = async (methodId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', methodId);

      if (error) {
        console.error('Error deleting payment method:', error);
        toast({ title: "Error", description: "Failed to delete payment method", variant: "destructive" });
        return;
      }

      await fetchPaymentMethods();
      toast({ title: "Success", description: "Payment method deleted successfully" });

    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const setDefaultPaymentMethod = async (methodId: string) => {
    if (!user) return;

    try {
      // 1. Set all other methods to not be default
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // 2. Set the selected method as default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', methodId);

      if (error) {
        console.error('Error setting default payment method:', error);
        toast({ title: "Error", description: "Failed to set default payment method", variant: "destructive" });
        return;
      }

      await fetchPaymentMethods();
      toast({ title: "Success", description: "Default payment method updated" });

    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        fetchWalletBalance(),
        fetchEarnings(),
        fetchTransactions(),
        fetchPaymentMethods(),
        fetchStudentPayments(),
      ]).finally(() => setLoading(false));
    }
  }, [user, fetchWalletBalance, fetchEarnings, fetchTransactions, fetchPaymentMethods, fetchStudentPayments]);

  return {
    earnings,
    transactions,
    paymentMethods,
    studentPayments,
    availableBalance,
    loading,
    requestWithdrawal,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
  };
};