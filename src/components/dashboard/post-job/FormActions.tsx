
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onSubmit: () => void;
  onClear: () => void;
}

const FormActions = ({ onSubmit, onClear }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onClear}>
        Clear Form
      </Button>
      <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700">
        Post Job
      </Button>
    </div>
  );
};

export default FormActions;
