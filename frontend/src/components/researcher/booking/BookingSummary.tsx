
interface BookingSummaryProps {
  servicePrice: number;
  addOnsPrice: number;
  totalPrice: number;
}

const BookingSummary = ({ servicePrice, addOnsPrice, totalPrice }: BookingSummaryProps) => {
  // Show as FREE for all research aid appointments
  return (
    <div className="pt-4 border-t bg-green-50 border-green-200 rounded-lg p-4">
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total Fee:</span>
          <span className="text-green-600 font-bold text-xl">FREE</span>
        </div>
        <div className="text-sm text-green-700 mt-2">
          <span className="font-medium">✓ No payment required - this consultation is completely free!</span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
