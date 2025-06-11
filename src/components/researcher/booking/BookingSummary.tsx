
interface BookingSummaryProps {
  servicePrice: number;
  addOnsPrice: number;
  totalPrice: number;
}

const BookingSummary = ({ servicePrice, addOnsPrice, totalPrice }: BookingSummaryProps) => {
  return (
    <div className="pt-4 border-t">
      <div className="space-y-2 mb-4">
        {servicePrice > 0 && (
          <div className="flex justify-between items-center">
            <span>Service Fee:</span>
            <span className="font-medium">{servicePrice.toLocaleString()} XAF</span>
          </div>
        )}
        
        {addOnsPrice > 0 && (
          <div className="flex justify-between items-center">
            <span>Add-ons:</span>
            <span className="font-medium">{addOnsPrice.toLocaleString()} XAF</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
          <span>Total Fee:</span>
          <span>{totalPrice.toLocaleString()} XAF</span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
