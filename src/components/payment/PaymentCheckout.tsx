
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Phone, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentCheckoutProps {
  serviceType: "consultation" | "service";
  provider: {
    id: string;
    name: string;
    title: string;
  };
  service: {
    title: string;
    description: string;
    amount: number;
    duration?: string;
    deadline?: string;
  };
  onPaymentSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

const PaymentCheckout = ({ 
  serviceType, 
  provider, 
  service, 
  onPaymentSuccess, 
  onCancel 
}: PaymentCheckoutProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setPaymentDetails({});
  };

  const handlePaymentDetailsChange = (field: string, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  const processPayment = async () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a mock payment ID
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Update payment status in database
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'paid',
          payment_method: paymentMethod as any,
          stripe_payment_intent_id: paymentId
        })
        .eq('provider_id', provider.id)
        .eq('status', 'pending');

      if (error) throw error;

      toast({
        title: "Payment Successful!",
        description: `Payment of ${service.amount.toLocaleString()} XAF has been processed successfully.`,
      });

      onPaymentSuccess(paymentId);
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber || ''}
                onChange={(e) => handlePaymentDetailsChange('cardNumber', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={paymentDetails.expiry || ''}
                  onChange={(e) => handlePaymentDetailsChange('expiry', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentDetails.cvv || ''}
                  onChange={(e) => handlePaymentDetailsChange('cvv', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={paymentDetails.cardName || ''}
                onChange={(e) => handlePaymentDetailsChange('cardName', e.target.value)}
              />
            </div>
          </div>
        );

      case 'mtn':
      case 'orange':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phoneNumber">Mobile Number</Label>
              <Input
                id="phoneNumber"
                placeholder="6XXXXXXXX"
                value={paymentDetails.phoneNumber || ''}
                onChange={(e) => handlePaymentDetailsChange('phoneNumber', e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-600">
              You will receive a prompt on your phone to confirm the payment.
            </div>
          </div>
        );

      case 'bank':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankAccount">Bank Account Number</Label>
              <Input
                id="bankAccount"
                placeholder="Enter your account number"
                value={paymentDetails.bankAccount || ''}
                onChange={(e) => handlePaymentDetailsChange('bankAccount', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Select 
                value={paymentDetails.bankName || ''} 
                onValueChange={(value) => handlePaymentDetailsChange('bankName', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="afriland">Afriland First Bank</SelectItem>
                  <SelectItem value="bicec">BICEC</SelectItem>
                  <SelectItem value="sgbc">SGBC</SelectItem>
                  <SelectItem value="uba">UBA</SelectItem>
                  <SelectItem value="ecobank">Ecobank</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Provider:</span>
              <span>{provider.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Service:</span>
              <span>{service.title}</span>
            </div>
            {service.duration && (
              <div className="flex justify-between">
                <span className="font-medium">Duration:</span>
                <span>{service.duration}</span>
              </div>
            )}
            {service.deadline && (
              <div className="flex justify-between">
                <span className="font-medium">Deadline:</span>
                <span>{service.deadline}</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{service.amount.toLocaleString()} XAF</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={paymentMethod} onValueChange={handlePaymentMethodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit/Debit Card
                  </div>
                </SelectItem>
                <SelectItem value="mtn">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    MTN Mobile Money
                  </div>
                </SelectItem>
                <SelectItem value="orange">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Orange Money
                  </div>
                </SelectItem>
                <SelectItem value="bank">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Bank Transfer
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {renderPaymentForm()}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={processPayment} 
          disabled={!paymentMethod || isProcessing}
          className="flex-1"
        >
          {isProcessing ? 'Processing...' : `Pay ${service.amount.toLocaleString()} XAF`}
        </Button>
      </div>
    </div>
  );
};

export default PaymentCheckout;
