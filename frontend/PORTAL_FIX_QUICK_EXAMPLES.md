# Quick Fix Examples for Portal Race Condition

## Example 1: Simple Form in Dialog with Select

### Before (Broken):
```tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const MyComponent = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = async () => {
    const success = await api.submit({ value });
    if (success) {
      setOpen(false); // ❌ Portal race condition!
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Option</DialogTitle>
        </DialogHeader>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
};
```

### After (Fixed):
```tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useDialogWithPortals } from '@/hooks/useDialogWithPortals'; // ✅ Import hook

const MyComponent = () => {
  const { isOpen, isProcessing, openDialog, safeClose } = useDialogWithPortals(); // ✅ Use hook
  const [value, setValue] = useState('');

  const handleSubmit = async () => {
    const success = await api.submit({ value });
    if (success) {
      await safeClose(); // ✅ Safe close with portal cleanup
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? openDialog() : undefined}> {/* ✅ Updated handler */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Option</DialogTitle>
        </DialogHeader>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit} disabled={isProcessing}> {/* ✅ Disable while processing */}
          {isProcessing ? 'Submitting...' : 'Submit'} {/* ✅ Loading state */}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
```

## Example 2: Complex Form with Multiple Selects

### After (Fixed with handleSubmitWithSafeClose):
```tsx
import { useDialogWithPortals } from '@/hooks/useDialogWithPortals';

const ComplexForm = () => {
  const { isOpen, isProcessing, openDialog, handleSubmitWithSafeClose } = useDialogWithPortals();
  const [formData, setFormData] = useState({ level: '', category: '', duration: '' });

  const handleSubmit = () => {
    handleSubmitWithSafeClose(
      async () => {
        // Your async submit logic
        const result = await api.createService(formData);
        return result.success;
      },
      () => {
        // Success callback
        toast.success('Created successfully!');
        setFormData({ level: '', category: '', duration: '' });
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open && openDialog()}>
      <DialogTrigger asChild>
        <Button onClick={openDialog}>Create Service</Button>
      </DialogTrigger>
      <DialogContent>
        <Select value={formData.level} onValueChange={(v) => setFormData({...formData, level: v})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="undergrad">Undergraduate</SelectItem>
            <SelectItem value="masters">Masters</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="thesis">Thesis</SelectItem>
            <SelectItem value="review">Review</SelectItem>
          </SelectContent>
        </Select>

        <Select value={formData.duration} onValueChange={(v) => setFormData({...formData, duration: v})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="60">1 Hour</SelectItem>
            <SelectItem value="120">2 Hours</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSubmit} disabled={isProcessing}>
          {isProcessing ? 'Creating...' : 'Create Service'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
```

## Example 3: Edit Modal

```tsx
import { useDialogWithPortals } from '@/hooks/useDialogWithPortals';

const EditServiceModal = ({ service, onUpdate }) => {
  const { isOpen, isProcessing, openDialog, safeClose } = useDialogWithPortals();
  const [formData, setFormData] = useState(service);

  // Reset form when service changes
  useEffect(() => {
    if (service && isOpen) {
      setFormData(service);
    }
  }, [service, isOpen]);

  const handleUpdate = async () => {
    const success = await onUpdate(service.id, formData);
    if (success) {
      await safeClose();
      toast.success('Updated successfully!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (open) {
        openDialog();
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={openDialog}>
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
          {/* Select options */}
        </Select>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => safeClose()} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isProcessing}>
            {isProcessing ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

## Example 4: With Form Validation

```tsx
import { useDialogWithPortals } from '@/hooks/useDialogWithPortals';
import { useForm } from 'react-hook-form';

const ValidatedForm = () => {
  const { isOpen, isProcessing, openDialog, safeClose } = useDialogWithPortals();
  const { register, handleSubmit: handleFormSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    const success = await api.submit(data);
    if (success) {
      await safeClose();
      reset();
      toast.success('Submitted successfully!');
    } else {
      toast.error('Submission failed');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open && openDialog()}>
      <DialogContent>
        <form onSubmit={handleFormSubmit(onSubmit)}>
          <Select {...register('category', { required: true })}>
            {/* Options */}
          </Select>
          {errors.category && <span className="text-red-500">Required</span>}
          
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
```

## Example 5: Quick Manual Fix (Without Hook)

If you can't use the hook immediately, add delays:

```tsx
const handleSubmit = async () => {
  // Close any open Select dropdowns
  document.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'Escape',
    code: 'Escape',
    keyCode: 27,
    bubbles: true
  }));
  
  // Wait for dropdowns to close
  await new Promise(r => setTimeout(r, 100));
  
  // Your API call
  const success = await api.submit(data);
  
  if (success) {
    // Wait for React state updates
    await new Promise(r => setTimeout(r, 500));
    
    // Now safe to close dialog
    setOpen(false);
  }
};
```

## Common Patterns

### Pattern 1: DialogTrigger with Button
```tsx
<DialogTrigger asChild>
  <Button onClick={openDialog}>Open</Button>
</DialogTrigger>
```

### Pattern 2: Controlled Open State
```tsx
<Dialog 
  open={isOpen} 
  onOpenChange={(open) => open ? openDialog() : undefined}
>
```

### Pattern 3: Close on Outside Click
```tsx
<Dialog 
  open={isOpen} 
  onOpenChange={(open) => {
    if (!open && !isProcessing) {
      safeClose();
    }
  }}
>
```

### Pattern 4: Prevent Close While Processing
```tsx
<DialogContent 
  onPointerDownOutside={(e) => {
    if (isProcessing) {
      e.preventDefault();
    }
  }}
  onEscapeKeyDown={(e) => {
    if (isProcessing) {
      e.preventDefault();
    }
  }}
>
```

## Testing Checklist

After applying fixes:

- [ ] Open dialog and interact with Select
- [ ] Change Select value multiple times
- [ ] Leave Select dropdown open and click submit
- [ ] Rapidly click submit button
- [ ] Try to close dialog during processing
- [ ] Check browser console for errors
- [ ] Verify smooth dialog close animation
- [ ] Test on mobile devices (slower)

## Need Help?

1. Check `PORTAL_RACE_CONDITION_FIX_GUIDE.md` for detailed explanation
2. Review hook API in `hooks/useDialogWithPortals.ts`
3. Look at `ServiceManagement.tsx` for complex example
4. Increase `cleanupDelayMs` if errors persist (500-1000ms)
