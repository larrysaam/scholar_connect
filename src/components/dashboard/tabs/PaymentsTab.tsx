
import { Badge } from "@/components/ui/badge";
import { DollarSign, Loader2 } from "lucide-react";
import { usePayments } from "@/hooks/usePayments";

const PaymentsTab = () => {
  const { studentPayments, loading } = usePayments();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading payment history...</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <DollarSign className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-semibold">Payment History</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b">
            <tr>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Researcher</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {studentPayments.map((payment) => (
              <tr key={payment.id} className="border-b last:border-b-0">
                <td className="py-4">{payment.date}</td>
                <td className="py-4">{payment.researcher}</td>
                <td className="py-4">{payment.amount} XAF</td>
                <td className="py-4">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {payment.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsTab;
