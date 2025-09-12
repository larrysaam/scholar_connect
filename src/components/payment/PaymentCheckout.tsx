import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Wallet, User, Clock, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface PaymentCheckoutProps {
  serviceType: "consultation" | "service";
  provider: {
    id: string;
    name: string;
    title: string;
    rating: number;
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
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "mobile_money" | "bank_transfer">("mobile_money");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [operator, setOperator] = useState("MTN"); // or 'ORANGE'

  const processingFee = service.amount * 0.025; // 2.5% processing fee
  const totalAmount = service.amount + processingFee;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (paymentMethod === "mobile_money") {
        // Call Supabase Edge Function for MeSomb payment
        const response = await fetch(
          "https://yujuomiqwydnwovgwtrg.functions.supabase.co/mesomb-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: totalAmount,
              service: operator, // 'MTN' or 'ORANGE'
              phone,
              description: `${serviceType} payment for ${service.title}`,
              customer: {
                email: user.email,
                firstName: user.user_metadata?.firstName || '',
                lastName: user.user_metadata?.lastName || '',
                country: 'CM',
              },
              location: { town: '', region: '', country: 'CM' },
              products: [
                { name: service.title, category: serviceType, quantity: 1, amount: totalAmount }
              ],
            }),
          }
        );
        const mesombResult = await response.json();
        if (!mesombResult.success && (!mesombResult.operationSuccess || !mesombResult.transactionSuccess)) {
          throw new Error(
            mesombResult.error ||
            mesombResult.message ||
            'Mobile money payment failed'
          );
        }
      }

      // Create transaction record (Supabase)
      const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          amount: totalAmount,
          description: `${serviceType} payment for ${service.title}`,
          status: "completed",
          type: serviceType,
        })
        .select()
        .single();
      if (txError) throw txError;

      toast({
        title: "Payment Successful!",
        description: `Your payment of ${totalAmount.toLocaleString()} XAF has been processed.`,
      });

      onPaymentSuccess(transaction.id);
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Payment Checkout</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provider Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">{provider.name}</h3>
              <p className="text-sm text-gray-600">{provider.title}</p>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm">{provider.rating}</span>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-3">
            <h4 className="font-medium">Service Details</h4>
            <div className="p-4 border rounded-lg space-y-2">
              <h5 className="font-medium">{service.title}</h5>
              <p className="text-sm text-gray-600">{service.description}</p>
              {service.duration && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {service.duration}</span>
                </div>
              )}
              {service.deadline && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Deadline: {service.deadline}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Payment Method</h4>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod as any}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="mobile_money" id="mobile_money" />
                <Label htmlFor="mobile_money" className="flex items-center space-x-2 flex-1 cursor-pointer">
                  <Smartphone className="h-4 w-4 text-orange-600" />
                  <span>Mobile Money (MTN, Orange)</span>
                  <Badge variant="secondary">Popular</Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe" className="flex items-center space-x-2 flex-1 cursor-pointer">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>Credit/Debit Card</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label htmlFor="bank_transfer" className="flex items-center space-x-2 flex-1 cursor-pointer">
                  <Wallet className="h-4 w-4 text-green-600" />
                  <span>Bank Transfer</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Add phone and operator input fields for mobile money */}
          <div className="space-y-3">
            {paymentMethod === "mobile_money" && (
              <>
                <h4 className="font-medium">Mobile Money Details</h4>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g. 6XXXXXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required={paymentMethod === "mobile_money"}
                  />
                  <Label htmlFor="operator">Operator</Label>
                  <select
                    id="operator"
                    value={operator}
                    onChange={e => setOperator(e.target.value)}
                    className="border rounded p-2"
                  >
                    <option value="MTN">MTN</option>
                    <option value="ORANGE">ORANGE</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Payment Summary */}
          <div className="space-y-3">
            <h4 className="font-medium">Payment Summary</h4>
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>{service.amount.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Processing Fee (2.5%)</span>
                <span>{processingFee.toLocaleString()} XAF</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{totalAmount.toLocaleString()} XAF</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Processing..." : `Pay ${totalAmount.toLocaleString()} XAF`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCheckout;
