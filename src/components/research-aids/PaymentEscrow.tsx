
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, DollarSign, AlertCircle } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: "pending" | "in-progress" | "completed" | "released";
  description: string;
}

interface PaymentEscrowProps {
  taskId: string;
  totalAmount: number;
  milestones: Milestone[];
}

const PaymentEscrow = ({ taskId, totalAmount, milestones }: PaymentEscrowProps) => {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  const completedAmount = milestones
    .filter(m => m.status === "completed" || m.status === "released")
    .reduce((sum, m) => sum + m.amount, 0);

  const progressPercentage = (completedAmount / totalAmount) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "released":
        return <DollarSign className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      "in-progress": "default",
      completed: "outline",
      released: "default"
    };
    
    const colors = {
      pending: "bg-gray-100 text-gray-600",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-yellow-100 text-yellow-800",
      released: "bg-green-100 text-green-800"
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const handleReleaseFunds = (milestoneId: string) => {
    console.log("Releasing funds for milestone:", milestoneId);
    // Here you would integrate with your payment processor
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Escrow</span>
          <span className="text-lg font-bold">{totalAmount.toLocaleString()} FCFA</span>
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{completedAmount.toLocaleString()} / {totalAmount.toLocaleString()} FCFA</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                selectedMilestone === milestone.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
              onClick={() => setSelectedMilestone(milestone.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(milestone.status)}
                  <h4 className="font-medium">{milestone.title}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{milestone.amount.toLocaleString()} FCFA</span>
                  {getStatusBadge(milestone.status)}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
              
              {milestone.status === "completed" && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReleaseFunds(milestone.id);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Release Funds
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Escrow Protection</span>
          </div>
          <p className="text-xs text-blue-700">
            Your payment is held securely until you approve each milestone. 
            Funds are only released when you're satisfied with the work delivered.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentEscrow;
