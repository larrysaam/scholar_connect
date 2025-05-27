
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Download, CreditCard, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsPaymentsEarnings = () => {
  const [activeTab, setActiveTab] = useState("earnings");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const { toast } = useToast();

  const earnings = [
    {
      id: 1,
      project: "Statistical Analysis Project",
      client: "Dr. Sarah Johnson",
      amount: "25,000 XAF",
      status: "paid",
      date: "2024-01-25",
      type: "completed_project"
    },
    {
      id: 2,
      project: "Literature Review",
      client: "Prof. Michael Chen",
      amount: "15,000 XAF", 
      status: "pending",
      date: "2024-01-28",
      type: "milestone_payment"
    },
    {
      id: 3,
      project: "Data Collection Planning",
      client: "Dr. Marie Dubois",
      amount: "8,000 XAF",
      status: "released",
      date: "2024-01-20",
      type: "consultation"
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "mobile_money",
      provider: "MTN Mobile Money",
      number: "**** **** 1234",
      isDefault: true
    },
    {
      id: 2,
      type: "bank_account",
      provider: "Afriland First Bank",
      number: "**** **** 5678",
      isDefault: false
    }
  ];

  const skills = [
    "Statistical Analysis",
    "SPSS",
    "Literature Review",
    "Data Collection",
    "Research Writing",
    "Academic Writing"
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-600">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case "released":
        return <Badge className="bg-blue-600">Released</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your earnings report is being generated"
    });
  };

  const handleRequestWithdrawal = () => {
    if (!withdrawalAmount.trim()) {
      toast({
        title: "Error",
        description: "Please enter withdrawal amount",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Withdrawal Requested",
      description: `Withdrawal of ${withdrawalAmount} XAF has been requested`
    });
    setWithdrawalAmount("");
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      toast({
        title: "Error",
        description: "Please enter a skill",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Skill Added",
      description: `${newSkill} has been added to your skills`
    });
    setNewSkill("");
  };

  const handleDeleteSkill = (skill: string) => {
    toast({
      title: "Skill Removed",
      description: `${skill} has been removed from your skills`
    });
  };

  const totalEarnings = earnings.reduce((sum, earning) => {
    const amount = parseInt(earning.amount.replace(/[^\d]/g, ''));
    return sum + amount;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payments & Earnings</h2>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === "earnings" ? "default" : "outline"} 
            onClick={() => setActiveTab("earnings")}
          >
            Earnings
          </Button>
          <Button 
            variant={activeTab === "payments" ? "default" : "outline"} 
            onClick={() => setActiveTab("payments")}
          >
            Payment Methods
          </Button>
          <Button 
            variant={activeTab === "skills" ? "default" : "outline"} 
            onClick={() => setActiveTab("skills")}
          >
            Skills
          </Button>
        </div>
      </div>

      {activeTab === "earnings" && (
        <div className="space-y-6">
          {/* Earnings Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold">{totalEarnings.toLocaleString()} XAF</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <p className="text-2xl font-bold">18,000 XAF</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold">25,000 XAF</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Request Withdrawal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Withdrawal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (XAF)</Label>
                    <Input
                      id="amount"
                      placeholder="Enter amount"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id.toString()}>
                            {method.provider} - {method.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleRequestWithdrawal} className="w-full">
                    Request Withdrawal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Earnings List */}
          <div className="space-y-4">
            {earnings.map((earning) => (
              <Card key={earning.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{earning.project}</h4>
                      <p className="text-sm text-gray-600">Client: {earning.client}</p>
                      <p className="text-xs text-gray-500">{earning.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{earning.amount}</p>
                      {getStatusBadge(earning.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "payments" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Payment Methods</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Payment Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        <SelectItem value="bank_account">Bank Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="provider">Provider</Label>
                    <Input
                      id="provider"
                      placeholder="Enter provider name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="account">Account Number</Label>
                    <Input
                      id="account"
                      placeholder="Enter account number"
                    />
                  </div>
                  <Button className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-8 w-8 text-gray-600" />
                      <div>
                        <h4 className="font-medium">{method.provider}</h4>
                        <p className="text-sm text-gray-600">{method.number}</p>
                        {method.isDefault && (
                          <Badge variant="outline" className="text-xs">Default</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Your Skills</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Skill</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-skill">Skill Name</Label>
                    <Input
                      id="new-skill"
                      placeholder="Enter skill name"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddSkill} className="w-full">
                    Add Skill
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{skill}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteSkill(skill)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchAidsPaymentsEarnings;
