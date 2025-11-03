import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard } from "lucide-react";
import { CreateJobData } from "@/hooks/useJobManagement";
import { useAuth } from "@/hooks/useAuth";

interface JobPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobData: CreateJobData;
  budget: number;
  onPaymentSuccess: () => void;
}

const JobPaymentModal = ({ isOpen, onClose, jobData, budget, onPaymentSuccess }: JobPaymentModalProps) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!mobileNumber.trim()) {
      toast({
        title: "Mobile Number Required",
        description: "Please enter your mobile money number",
        variant: "destructive"
      });
      return;
    }

    // Validate mobile number format (basic validation for Cameroon)
    const mobileRegex = /^6[5-9]\d{7}$/;
    if (!mobileRegex.test(mobileNumber.replace(/\s+/g, ''))) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid Cameroon mobile number (e.g., 677123456)",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${import.meta.env.VITE_MESOMB_SERVER_URL}/api/job-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: budget,
          service: 'MTN', // Default to MTN, could be made dynamic
          payer: mobileNumber.replace(/\s+/g, ''),
          country: 'CM',
          currency: 'XAF',
          jobData,
          userId: user?.id,
          customer: {
            id: user?.id,
            phone: mobileNumber.replace(/\s+/g, '')
          }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.paymentSuccess && result.jobCreated) {
        toast({
          title: "Payment Successful",
          description: "Your job has been posted successfully!",
        });
        onPaymentSuccess();
        onClose();
      } else if (result.paymentSuccess && !result.jobCreated) {
        toast({
          title: "Payment Successful",
          description: "Payment processed but job creation failed. Please contact support.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Payment Failed",
          description: result.error || "Payment could not be processed. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      let errorMessage = "An error occurred while processing payment. Please try again.";
      
      if (error.name === 'AbortError') {
        errorMessage = "Payment request timed out. Please check your connection and try again.";
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.message.includes('HTTP error!')) {
        errorMessage = "Server error. Please try again later or contact support.";
      }

      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Pay for Job Posting
          </DialogTitle>
          <DialogDescription>
            To post your job "{jobData.title}", you need to pay {budget.toLocaleString()} XAF via mobile money.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Money Number</Label>
            <Input
              id="mobile"
              placeholder="677 123 456"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              disabled={isProcessing}
              maxLength={9}
            />
            <p className="text-sm text-gray-500">
              Enter your MTN or Orange mobile number (e.g., 677123456)
            </p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Amount:</strong> {budget.toLocaleString()} XAF
            </p>
            <p className="text-sm text-blue-800">
              <strong>Job:</strong> {jobData.title}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing || !mobileNumber.trim()}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${budget.toLocaleString()} XAF`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobPaymentModal;
