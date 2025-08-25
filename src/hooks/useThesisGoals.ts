import { useState, useEffect, useCallback } from 'react';
import { ThesisGoalsService, ThesisGoal } from '@/services/thesisGoalsService';
import { useToast } from '@/components/ui/use-toast';

export const useThesisGoals = (bookingId: string | undefined, userId: string | undefined, isStudent: boolean) => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<ThesisGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!bookingId || !userId) {
      setGoals([]);
      setLoading(false);
      return;
    }
    if (userId === '') { // Added check for empty string userId
      setGoals([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const fetchedGoals = await ThesisGoalsService.getGoalsByBookingId(bookingId, userId, isStudent);
    if (fetchedGoals) {
      setGoals(fetchedGoals);
    } else {
      setError('Failed to fetch goals.');
      toast({
        title: 'Error',
        description: 'Failed to load thesis goals.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  }, [bookingId, userId, isStudent, toast]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = useCallback(async (description: string) => {
    if (!bookingId) {
      toast({
        title: 'Error',
        description: 'Cannot add goal: No booking selected.',
        variant: 'destructive',
      });
      return null;
    }
    const newGoal = await ThesisGoalsService.addGoal(bookingId, description);
    if (newGoal) {
      setGoals((prevGoals) => [...prevGoals, newGoal]);
      toast({
        title: 'Success',
        description: 'Goal added successfully.',
      });
      return newGoal;
    } else {
      toast({
        title: 'Error',
        description: 'Failed to add goal.',
        variant: 'destructive',
      });
      return null;
    }
  }, [bookingId, toast]);

  const updateGoalStatus = useCallback(async (goalId: string, status: 'pending' | 'completed' | 'in_progress') => {
    const updatedGoal = await ThesisGoalsService.updateGoalStatus(goalId, status);
    if (updatedGoal) {
      setGoals((prevGoals) =>
        prevGoals.map((goal) => (goal.id === goalId ? updatedGoal : goal))
      );
      toast({
        title: 'Success',
        description: 'Goal status updated.',
      });
      return updatedGoal;
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update goal status.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const deleteGoal = useCallback(async (goalId: string) => {
    const success = await ThesisGoalsService.deleteGoal(goalId);
    if (success) {
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
      toast({
        title: 'Success',
        description: 'Goal deleted successfully.',
      });
      return true;
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete goal.',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoalStatus,
    deleteGoal,
    fetchGoals, // Expose fetchGoals for manual refresh if needed
  };
};