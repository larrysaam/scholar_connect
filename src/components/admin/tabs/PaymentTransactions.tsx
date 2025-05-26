
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, TrendingUp, AlertCircle, Download } from "lucide-react";

const PaymentTransactions = () => {
  const recentTransactions = [
    {
      id: "TXN001",
      user: "John Doe",
      type: "Consultation Payment",
      amount: "15,000 XAF",
      method: "Mobile Money",
      status: "completed",
      date: "2024-01-20 14:30",
      recipient: "Dr. Marie Ngono"
    },
    {
      id: "TXN002",
      user: "Sarah Wilson",
      type: "Task Payment",
      amount: "25,000 XAF",
      method: "Bank Transfer",
      status: "pending",
      date: "2024-01-20 13:15",
      recipient: "Dr. Neba Emmanuel"
    },
    {
      id: "TXN003",
      user: "Alice Johnson",
      type: "VIP Subscription",
      amount: "50,000 XAF",
      method: "Card Payment",
      status: "failed",
      date: "2024-01-20 12:00",
      recipient: "Platform"
    }
  ];

  const payoutSchedule = [
    {
      id: "PAY001",
      recipient: "Dr. Marie Ngono",
      amount: "245,000 XAF",
      method: "Bank Transfer",
      scheduledDate: "2024-01-25",
      status: "scheduled",
      sessions: 16
    },
    {
      id: "PAY002", 
      recipient: "Dr. Neba Emmanuel",
      amount: "180,000 XAF",
      method: "Mobile Money",
      scheduledDate: "2024-01-25",
      status: "scheduled",
      sessions: 12
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment & Transactions</h2>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Payment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,450,000 XAF</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,680,000 XAF</div>
            <p className="text-xs text-muted-foreground">+8% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.2%</div>
            <p className="text-xs text-muted-foreground">Payment success rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payout Schedule</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono">{transaction.id}</TableCell>
                      <TableCell>{transaction.user}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell className="font-semibold">{transaction.amount}</TableCell>
                      <TableCell>{transaction.method}</TableCell>
                      <TableCell>{transaction.recipient}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            transaction.status === "completed" ? "default" : 
                            transaction.status === "pending" ? "secondary" : 
                            "destructive"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">View</Button>
                          {transaction.status === "failed" && (
                            <Button size="sm" variant="outline">Retry</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payouts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutSchedule.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-mono">{payout.id}</TableCell>
                      <TableCell>{payout.recipient}</TableCell>
                      <TableCell className="font-semibold">{payout.amount}</TableCell>
                      <TableCell>{payout.method}</TableCell>
                      <TableCell>{payout.sessions} sessions</TableCell>
                      <TableCell>{payout.scheduledDate}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{payout.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Process Now</Button>
                          <Button size="sm" variant="outline">Modify</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Quick Reports</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Daily Revenue Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Weekly Transaction Summary
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Monthly Payout Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Failed Payments Report
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Payment Method Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Mobile Money</span>
                      <span className="font-semibold">65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bank Transfer</span>
                      <span className="font-semibold">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Card Payment</span>
                      <span className="font-semibold">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentTransactions;
