
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Settings, Users, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MembershipSettings = () => {
  const vipSubscriptions = [
    {
      id: 1,
      user: "Dr. Marie Ngono",
      type: "Faculty VIP",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "active",
      amount: "120,000 XAF/year"
    },
    {
      id: 2,
      user: "John Doe",
      type: "Student Premium",
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      status: "active",
      amount: "50,000 XAF/6months"
    }
  ];

  const vipApplications = [
    {
      id: 1,
      applicant: "Prof. James Wilson",
      type: "Faculty VIP",
      institution: "University of Lagos",
      applicationDate: "2024-01-18",
      status: "pending",
      documents: "PhD Certificate, Faculty Letter"
    },
    {
      id: 2,
      applicant: "Dr. Sarah Chen",
      type: "Researcher VIP",
      institution: "Research Institute",
      applicationDate: "2024-01-17",
      status: "under_review",
      documents: "Research Portfolio, Publications"
    }
  ];

  const membershipTiers = [
    {
      name: "Student Basic",
      price: "Free",
      features: ["Basic consultation booking", "Standard support", "Basic templates"]
    },
    {
      name: "Student Premium",
      price: "50,000 XAF/6months",
      features: ["Priority booking", "Extended sessions", "Premium templates", "24/7 support"]
    },
    {
      name: "Faculty VIP",
      price: "120,000 XAF/year",
      features: ["Unlimited consultations", "Research collaboration tools", "Priority matching", "Advanced analytics"]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Membership & VIP Settings</h2>

      <Tabs defaultValue="active-memberships" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active-memberships">Active Memberships</TabsTrigger>
          <TabsTrigger value="applications">VIP Applications</TabsTrigger>
          <TabsTrigger value="settings">Membership Settings</TabsTrigger>
          <TabsTrigger value="analytics">Membership Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active-memberships" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="mr-2 h-5 w-5 text-yellow-600" />
                Active VIP Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Membership Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vipSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          {subscription.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{subscription.startDate}</TableCell>
                      <TableCell>{subscription.endDate}</TableCell>
                      <TableCell>{subscription.amount}</TableCell>
                      <TableCell>
                        <Badge variant="default">{subscription.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">View Details</Button>
                          <Button size="sm" variant="outline">Extend</Button>
                          <Button size="sm" variant="destructive">Cancel</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                VIP Membership Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Membership Type</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vipApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.applicant}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{application.type}</Badge>
                      </TableCell>
                      <TableCell>{application.institution}</TableCell>
                      <TableCell>{application.applicationDate}</TableCell>
                      <TableCell className="max-w-xs truncate">{application.documents}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            application.status === "pending" ? "secondary" : 
                            application.status === "under_review" ? "default" : 
                            "destructive"
                          }
                        >
                          {application.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Review</Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                          <Button size="sm" variant="destructive">Reject</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Membership Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Student Premium Price (6 months)</Label>
                  <Input defaultValue="50,000" />
                  <p className="text-sm text-gray-600">Price in XAF</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Faculty VIP Price (Annual)</Label>
                  <Input defaultValue="120,000" />
                  <p className="text-sm text-gray-600">Price in XAF</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Trial Period Duration</Label>
                  <Input defaultValue="7" />
                  <p className="text-sm text-gray-600">Days</p>
                </div>
                
                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membership Tiers Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {membershipTiers.map((tier, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{tier.name}</h4>
                        <span className="font-bold text-green-600">{tier.price}</span>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {tier.features.map((feature, fIndex) => (
                          <li key={fIndex}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total VIP Members</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">+8 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly VIP Revenue</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,340,000 XAF</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5%</div>
                <p className="text-xs text-muted-foreground">Free to Premium</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Renewal Rate</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground">VIP renewal rate</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>VIP Member Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Average sessions per VIP member</span>
                  <span className="font-semibold">8.3/month</span>
                </div>
                <div className="flex justify-between">
                  <span>VIP member satisfaction rate</span>
                  <span className="font-semibold">4.9/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Most popular VIP feature</span>
                  <span className="font-semibold">Priority booking (78%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Average VIP session duration</span>
                  <span className="font-semibold">45 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MembershipSettings;
