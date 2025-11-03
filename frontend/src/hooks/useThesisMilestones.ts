import { useState, useEffect, useCallback } from 'react';
import { ThesisMilestonesService, ThesisMilestone } from '@/services/thesisMilestonesService';
import { useToast } from '@/components/ui/use-toast';

export const useThesisMilestones = (bookingId: string | undefined, userId: string | undefined, isStudent: boolean) => {
  const { toast } = useToast();
  const [milestones, setMilestones] = useState<ThesisMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMilestones = useCallback(async () => {
    if (!bookingId || !userId) {
      setMilestones([]);
      setLoading(false);
      return;
    }
    if (userId === '') { // Added check for empty string userId
      setMilestones([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const fetchedMilestones = await ThesisMilestonesService.getMilestonesByBookingId(bookingId, userId, isStudent);
    if (fetchedMilestones) {
      setMilestones(fetchedMilestones);
    } else {
      setError('Failed to fetch milestones.');
      toast({
        title: 'Error',
        description: 'Failed to load thesis milestones.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  }, [bookingId, userId, isStudent, toast]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const addMilestone = useCallback(async (description: string, dueDate?: string) => {
    if (!bookingId) {
      toast({
        title: 'Error',
        description: 'Cannot add milestone: No booking selected.',
        variant: 'destructive',
      });
      return null;
    }
    const newMilestone = await ThesisMilestonesService.addMilestone(bookingId, description, dueDate);
    if (newMilestone) {
      setMilestones((prevMilestones) => [...prevMilestones, newMilestone]);
      toast({
        title: 'Success',
        description: 'Milestone added successfully.',
      });
      return newMilestone;
    } else {
      toast({
        title: 'Error',
        description: 'Failed to add milestone.',
        variant: 'destructive',
      });
      return null;
    }
  }, [bookingId, toast]);

  // Add a milestone to a specific project (bookingId override)
  const addMilestoneToProject = useCallback(async (targetBookingId: string, description: string, dueDate?: string) => {
    if (!targetBookingId) {
      toast({
        title: 'Error',
        description: 'Cannot add milestone: No project selected.',
        variant: 'destructive',
      });
      return null;
    }
    const newMilestone = await ThesisMilestonesService.addMilestone(targetBookingId, description, dueDate);
    if (newMilestone) {
      // If the current bookingId matches, update local state
      if (targetBookingId === bookingId) {
        setMilestones((prevMilestones) => [...prevMilestones, newMilestone]);
      }
      toast({
        title: 'Success',
        description: 'Milestone added successfully.',
      });
      return newMilestone;
    } else {
      toast({
        title: 'Error',
        description: 'Failed to add milestone.',
        variant: 'destructive',
      });
      return null;
    }
  }, [bookingId, toast]);

  const updateMilestoneStatus = useCallback(async (milestoneId: string, status: 'pending' | 'completed' | 'in_progress') => {
    const updatedMilestone = await ThesisMilestonesService.updateMilestoneStatus(milestoneId, status);
    if (updatedMilestone) {
      setMilestones((prevMilestones) =>
        prevMilestones.map((milestone) => (milestone.id === milestoneId ? updatedMilestone : milestone))
      );
      toast({
        title: 'Success',
        description: 'Milestone status updated.',
      });
      return updatedMilestone;
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update milestone status.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const deleteMilestone = useCallback(async (milestoneId: string) => {
    const success = await ThesisMilestonesService.deleteMilestone(milestoneId);
    if (success) {
      setMilestones((prevMilestones) => prevMilestones.filter((milestone) => milestone.id !== milestoneId));
      toast({
        title: 'Success',
        description: 'Milestone deleted successfully.',
      });
      return true;
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete milestone.',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  return {
    milestones,
    loading,
    error,
    addMilestone,
    addMilestoneToProject, // <-- new function
    updateMilestoneStatus,
    deleteMilestone,
    fetchMilestones,
  };
};