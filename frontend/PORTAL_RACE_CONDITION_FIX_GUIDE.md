# Portal Race Condition - Application-Wide Fix Guide

## Problem Overview

**Error:** `Uncaught NotFoundError: Failed to execute 'removeChild' on 'Node'`

This error occurs throughout the application when:
1. **Dialog** components contain **Select/Combobox/Popover** (portal-based components)
2. Dialog closes **immediately after** async operations (API calls, state updates)
3. React tries to unmount **both portals simultaneously**, causing a race condition

### Why This Happens
- Radix UI components (Dialog, Select, Popover, etc.) use React Portals
- Portals render outside the parent DOM hierarchy
- When parent unmounts, portal cleanup is **asynchronous**
- React tries to remove nodes that are already being removed by portal cleanup

## Affected Components

### High Priority (Confirmed Issues):
1. ✅ **ServiceManagement.tsx** - Create/Update consultation services
2. **AppointmentBooking.tsx** - Book appointments with Select dropdowns
3. **ComprehensiveBookingModal.tsx** - Complex booking with multiple Selects
4. **TaskPostingModal.tsx** - Research aid task posting
5. **InviteModal.tsx** - Co-author invitations
6. **BookingModal.tsx** - Researcher booking modal
7. **ServiceBookingModal.tsx** - Payment service bookings

### Medium Priority:
- Any Dialog containing Select components
- Any Dialog that closes after form submission
- Nested portal components (Dialog → Popover → Select)

## Solution: Use `useDialogWithPortals` Hook

### Installation
The hook is located at: `frontend/src/hooks/useDialogWithPortals.ts`

### Basic Usage

#### Before (Problematic):
```typescript
const [open, setOpen] = useState(false);

const handleSubmit = async () => {
  const success = await api.submit(data);
  if (success) {
    setOpen(false); // ❌ Causes portal race condition
  }
};

return (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <Select>...</Select> {/* Portal component */}
      <Button onClick={handleSubmit}>Submit</Button>
    </DialogContent>
  </Dialog>
);
```

#### After (Fixed):
```typescript
import { useDialogWithPortals } from '@/hooks/useDialogWithPortals';

const { isOpen, isProcessing, openDialog, safeClose } = useDialogWithPortals();

const handleSubmit = async () => {
  const success = await api.submit(data);
  if (success) {
    await safeClose(); // ✅ Safely closes after portal cleanup
  }
};

return (
  <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
    <DialogContent>
      <Select>...</Select>
      <Button onClick={handleSubmit} disabled={isProcessing}>
        {isProcessing ? 'Saving...' : 'Submit'}
      </Button>
    </DialogContent>
  </Dialog>
);
```

### Advanced Usage with Submit Handler

```typescript
import { useDialogWithPortals } from '@/hooks/useDialogWithPortals';

const { isOpen, isProcessing, openDialog, handleSubmitWithSafeClose } = useDialogWithPortals();

const handleSubmit = () => {
  handleSubmitWithSafeClose(
    async () => {
      // Your async operation
      const success = await api.submit(data);
      return success;
    },
    () => {
      // Optional: Called after successful close
      toast.success('Saved successfully!');
      resetForm();
    }
  );
};

return (
  <Dialog open={isOpen} onOpenChange={(open) => open ? openDialog() : undefined}>
    <DialogTrigger asChild>
      <Button onClick={openDialog}>Open</Button>
    </DialogTrigger>
    <DialogContent>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <Select>...</Select>
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Saving...' : 'Submit'}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
);
```

## Hook API Reference

### Returns

```typescript
{
  isOpen: boolean;              // Dialog open state
  isProcessing: boolean;        // True while closing/processing
  openDialog: () => void;       // Open the dialog
  closeDialog: () => void;      // Close immediately (use with caution)
  safeClose: (delay?: number) => Promise<void>;  // Safe close with cleanup
  closeAllPortals: () => void;  // Close all portal components
  handleSubmitWithSafeClose: (
    asyncFn: () => Promise<boolean>,
    onSuccess?: () => void,
    delay?: number
  ) => Promise<void>;            // Wrapper for submit handlers
}
```

### Parameters

- `safeClose(cleanupDelayMs = 500)` - Adjust delay if needed (300-1000ms recommended)
- `handleSubmitWithSafeClose` - Takes async function that returns `true` on success

## Migration Checklist

For each component with Dialog + Select/Popover:

- [ ] Import `useDialogWithPortals` hook
- [ ] Replace `useState` for dialog state
- [ ] Use `safeClose()` instead of direct state updates
- [ ] Add `disabled={isProcessing}` to submit buttons
- [ ] Show loading state: `{isProcessing ? 'Saving...' : 'Submit'}`
- [ ] Update `onOpenChange` handler: `onOpenChange={(open) => !open && closeDialog()}`
- [ ] Test: Open dialog → Interact with Select → Submit → Verify no errors

## Priority Fix List

### Immediate (Causes frequent errors):
1. **ServiceManagement.tsx** - ✅ Already partially fixed
2. **AppointmentBooking.tsx** - Student appointment booking
3. **ComprehensiveBookingModal.tsx** - Main booking flow
4. **TaskPostingModal.tsx** - Research aid tasks

### High Priority:
5. **BookingModal.tsx** - Researcher bookings
6. **InviteModal.tsx** - Co-author invites
7. **ServiceBookingModal.tsx** - Payment bookings
8. **ConsultationServicesDisplay.tsx** - Service selection

### Medium Priority:
9. **CoAuthorModal.tsx** - Co-author management
10. **MessageModal.tsx** - Messaging
11. Any other Dialog + Select combinations

## Alternative Solutions

### Option 1: Increase Delay (Quick Fix)
If you can't refactor immediately:
```typescript
const handleSubmit = async () => {
  const success = await api.submit(data);
  if (success) {
    // Increase delay to 800-1000ms
    await new Promise(r => setTimeout(r, 1000));
    setOpen(false);
  }
};
```

### Option 2: Use `modal={false}` on Dialog
```typescript
<Dialog open={open} onOpenChange={setOpen} modal={false}>
```
⚠️ May cause z-index and overlay issues

### Option 3: Replace Select with Combobox
Use a non-portal component if possible

## Testing

After applying fixes:

1. Open dialog with Select dropdowns
2. Change Select values multiple times
3. Leave dropdown open and click submit
4. Rapidly open/close dialog
5. Check console for errors
6. Verify dialog closes smoothly

## Common Mistakes

❌ **Don't** close dialog immediately after API call:
```typescript
const success = await api.call();
setOpen(false); // Race condition!
```

✅ **Do** use safeClose:
```typescript
const success = await api.call();
await safeClose(); // Proper cleanup
```

❌ **Don't** ignore isProcessing state:
```typescript
<Button onClick={submit}>Submit</Button>
```

✅ **Do** disable during processing:
```typescript
<Button onClick={submit} disabled={isProcessing}>
  {isProcessing ? 'Saving...' : 'Submit'}
</Button>
```

## Performance Considerations

- **Default delay:** 500ms (imperceptible to users)
- **Minimum delay:** 300ms (for simple forms)
- **Maximum delay:** 1000ms (for complex nested portals)
- **Impact:** Negligible - users expect brief loading states

## Related Files

- Hook: `frontend/src/hooks/useDialogWithPortals.ts`
- Example: `frontend/src/components/dashboard/consultation-services/ServiceManagement.tsx`
- Documentation: `frontend/PORTAL_RACE_CONDITION_FIX_GUIDE.md`

## Support

If errors persist after applying fixes:
1. Check browser console for specific component
2. Increase `cleanupDelayMs` to 800-1000ms
3. Verify all Select components are inside Dialog
4. Check for custom portal components

## Summary

**Root Cause:** React Portal race condition when Dialog closes while Select portal is cleaning up

**Solution:** Use `useDialogWithPortals` hook to ensure proper async cleanup before closing

**Impact:** Fixes application-wide portal errors with minimal code changes

**Priority:** High - affects user experience and causes app crashes
