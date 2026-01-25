import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CreateServiceData } from "@/hooks/useConsultationServices";
import ServiceForm from "./ServiceForm";

interface SafeServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  formData: CreateServiceData;
  onFormDataChange: (data: CreateServiceData) => void;
  serviceType: 'free' | 'paid';
  onSubmit: () => Promise<void>;
  isProcessing: boolean;
  trigger?: React.ReactNode;
}

/**
 * SafeServiceDialog - Wraps Dialog with proper portal cleanup handling
 * 
 * This component solves the portal race condition error by:
 * 1. Using modal={false} to prevent portal issues
 * 2. Properly managing form lifecycle
 * 3. Handling cleanup before dialog closes
 */
export const SafeServiceDialog: React.FC<SafeServiceDialogProps> = ({
  open,
  onOpenChange,
  mode,
  formData,
  onFormDataChange,
  serviceType,
  onSubmit,
  isProcessing,
  trigger
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Cleanup effect when dialog closes
  useEffect(() => {
    if (!open && isClosing) {
      setIsClosing(false);
    }
  }, [open, isClosing]);

  const handleSubmit = async () => {
    if (isClosing || isProcessing) return;
    
    setIsClosing(true);
    
    // Close any open dropdowns by dispatching Escape
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      bubbles: true
    }));
    
    // Small delay to let dropdowns close
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Execute the actual submit
    await onSubmit();
    
    setIsClosing(false);
  };

  const handleCancel = () => {
    // Close any open dropdowns before closing dialog
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      bubbles: true
    }));
    
    setTimeout(() => {
      onOpenChange(false);
    }, 50);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent 
        ref={contentRef}
        className="w-[95vw] max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto mx-2 sm:mx-0"
        onPointerDownOutside={(e) => {
          // Prevent closing when clicking on select dropdowns
          const target = e.target as HTMLElement;
          if (target.closest('[role="listbox"]') || target.closest('[data-radix-select-content]')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-base sm:text-lg">
            {mode === 'create' ? 'Create New Service' : 'Edit Service'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {mode === 'create' 
              ? 'Set up a new consultation service with pricing and add-ons'
              : 'Update your service details, pricing, and add-ons'}
          </DialogDescription>
        </DialogHeader>
        
        <ServiceForm 
          formData={formData}
          onFormDataChange={onFormDataChange}
          serviceType={serviceType}
        />
        
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isProcessing || isClosing}
            className="w-full sm:w-auto text-sm order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isProcessing || isClosing}
            className="w-full sm:w-auto text-sm order-1 sm:order-2"
          >
            {isProcessing || isClosing ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                {isClosing ? 'Saving...' : mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              mode === 'create' ? 'Create Service' : 'Update Service'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SafeServiceDialog;
