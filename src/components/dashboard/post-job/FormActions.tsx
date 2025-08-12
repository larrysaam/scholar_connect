
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  onSubmit: () => void;
  onClear: () => void;
  isSubmitting?: boolean;
}

const FormActions = ({ onSubmit, onClear, isSubmitting = false }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onClear} disabled={isSubmitting}>
        Clear Form
      </Button>
      <Button 
        onClick={onSubmit} 
        className="bg-green-600 hover:bg-green-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Posting...
          </>
        ) : (
          "Post Job"
        )}
      </Button>
    </div>
  );
};

export default FormActions;
