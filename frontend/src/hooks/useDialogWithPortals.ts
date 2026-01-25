import { useState, useCallback } from 'react';

/**
 * Custom hook to safely handle dialogs containing portal-based components (Select, Popover, etc.)
 * 
 * This prevents the "Failed to execute 'removeChild' on 'Node'" error that occurs when
 * dialogs with portals close immediately after async operations.
 * 
 * @example
 * ```tsx
 * const { isOpen, isProcessing, openDialog, closeDialog, safeClose } = useDialogWithPortals();
 * 
 * const handleSubmit = async () => {
 *   const success = await api.submit(data);
 *   if (success) {
 *     await safeClose(); // Safely closes after portal cleanup
 *   }
 * };
 * 
 * return (
 *   <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
 *     ...
 *     <Button onClick={handleSubmit} disabled={isProcessing}>Submit</Button>
 *   </Dialog>
 * );
 * ```
 */
export const useDialogWithPortals = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Close all open portal components (Select dropdowns, Popovers, etc.)
   * by dispatching an Escape key event
   */
  const closeAllPortals = useCallback(() => {
    // Dispatch Escape key to close any open Radix UI portals
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        bubbles: true,
      })
    );
  }, []);

  /**
   * Open the dialog
   */
  const openDialog = useCallback(() => {
    setIsOpen(true);
    setIsProcessing(false);
  }, []);

  /**
   * Close the dialog immediately (use with caution)
   */
  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setIsProcessing(false);
  }, []);

  /**
   * Safely close the dialog after ensuring all portals are cleaned up
   * Call this after async operations that modify state
   * 
   * @param cleanupDelayMs - Time to wait for portal cleanup (default: 500ms)
   * @returns Promise that resolves when dialog is closed
   */
  const safeClose = useCallback(async (cleanupDelayMs = 500) => {
    setIsProcessing(true);

    // Step 1: Close any open portal components
    closeAllPortals();

    // Step 2: Wait for portal animations and cleanup
    await new Promise((resolve) => setTimeout(resolve, Math.min(cleanupDelayMs, 100)));

    // Step 3: Additional wait for React state propagation
    await new Promise((resolve) => setTimeout(resolve, Math.max(cleanupDelayMs - 100, 100)));

    // Step 4: Now safe to close the dialog
    setIsOpen(false);
    setIsProcessing(false);
  }, [closeAllPortals]);

  /**
   * Wrapper for async submit handlers
   * Automatically handles portal cleanup and dialog closing
   * 
   * @param asyncFn - Async function that returns true on success
   * @param onSuccess - Optional callback after successful close
   * @param cleanupDelayMs - Portal cleanup delay
   */
  const handleSubmitWithSafeClose = useCallback(
    async (
      asyncFn: () => Promise<boolean>,
      onSuccess?: () => void,
      cleanupDelayMs = 500
    ) => {
      if (isProcessing) return;

      setIsProcessing(true);

      try {
        const success = await asyncFn();

        if (success) {
          await safeClose(cleanupDelayMs);
          onSuccess?.();
        } else {
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('Submit error:', error);
        setIsProcessing(false);
      }
    },
    [isProcessing, safeClose]
  );

  return {
    isOpen,
    isProcessing,
    openDialog,
    closeDialog,
    safeClose,
    closeAllPortals,
    handleSubmitWithSafeClose,
  };
};

export default useDialogWithPortals;
