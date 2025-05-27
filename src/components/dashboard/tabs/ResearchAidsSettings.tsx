
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Moon, 
  Sun,
  Smartphone,
  Mail,
  Lock,
  Trash2
} from "lucide-react";

const ResearchAidsSettings = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    jobAlerts: true,
    messageAlerts: true,
    paymentAlerts: true,
    marketingEmails: false
  });

  const [availability, setAvailability] = useState({
    isAvailable: true,
    workingHours: "9-17",
    timezone: "WAT",
    maxActiveJobs: 5
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showRatings: true,
    showEarnings: false,
    allowDirectContact: true
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Account Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value="neba.emmanuel@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value="+237 678 123 456" />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-semibold">Change Password</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
            <Button>
              <Lock className="h-4 w-4 mr-1" />
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                </div>
              </div>
              <Switch
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, smsNotifications: checked }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Job Alerts</p>
                <p className="text-sm text-gray-600">New job opportunities matching your skills</p>
              </div>
              <Switch
                checked={notifications.jobAlerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, jobAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Message Alerts</p>
                <p className="text-sm text-gray-600">New messages from clients</p>
              </div>
              <Switch
                checked={notifications.messageAlerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, messageAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Alerts</p>
                <p className="text-sm text-gray-600">Payment confirmations and updates</p>
              </div>
              <Switch
                checked={notifications.paymentAlerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, paymentAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-gray-600">Platform updates and promotional content</p>
              </div>
              <Switch
                checked={notifications.marketingEmails}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, marketingEmails: checked }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Availability Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Available for Work</p>
              <p className="text-sm text-gray-600">Show as available to receive new job offers</p>
            </div>
            <Switch
              checked={availability.isAvailable}
              onCheckedChange={(checked) => 
                setAvailability(prev => ({ ...prev, isAvailable: checked }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="working-hours">Working Hours</Label>
              <Select value={availability.workingHours}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9-17">9:00 AM - 5:00 PM</SelectItem>
                  <SelectItem value="8-16">8:00 AM - 4:00 PM</SelectItem>
                  <SelectItem value="10-18">10:00 AM - 6:00 PM</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={availability.timezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WAT">West Africa Time (WAT)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="CET">Central European Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-jobs">Max Active Jobs</Label>
              <Input 
                id="max-jobs" 
                type="number" 
                value={availability.maxActiveJobs}
                min="1"
                max="10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Profile Visibility</p>
                <p className="text-sm text-gray-600">Who can see your profile</p>
              </div>
              <Select value={privacy.profileVisibility}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="clients-only">Clients Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Ratings</p>
                <p className="text-sm text-gray-600">Display your ratings publicly</p>
              </div>
              <Switch
                checked={privacy.showRatings}
                onCheckedChange={(checked) => 
                  setPrivacy(prev => ({ ...prev, showRatings: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Earnings</p>
                <p className="text-sm text-gray-600">Display earnings information</p>
              </div>
              <Switch
                checked={privacy.showEarnings}
                onCheckedChange={(checked) => 
                  setPrivacy(prev => ({ ...prev, showEarnings: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Direct Contact</p>
                <p className="text-sm text-gray-600">Let clients contact you directly</p>
              </div>
              <Switch
                checked={privacy.allowDirectContact}
                onCheckedChange={(checked) => 
                  setPrivacy(prev => ({ ...prev, allowDirectContact: checked }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preferred-currency">Preferred Currency</Label>
            <Select defaultValue="XAF">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="XAF">Central African CFA franc (XAF)</SelectItem>
                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline">
            Manage Payment Methods
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
            <p className="text-sm text-red-700 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="destructive">
              Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default ResearchAidsSettings;
