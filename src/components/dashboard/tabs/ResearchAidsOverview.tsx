import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, TrendingUp, MessageSquare, Clock, DollarSign, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ResearchAidsOverviewProps {
  setActiveTab: (tab: string) => void;
}

const ResearchAidsOverview = ({ setActiveTab }: ResearchAidsOverviewProps) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const { profile, user } = useAuth();
  const { toast } = useToast();

  // Real data state
  const [aidProfile, setAidProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    jobsInProgress: 0,
    newMessages: 0,
    earningsThisWeek: 0,
    profileViews: 0,
    rating: 0,
    totalJobs: 0,
    successRate: 0,
    name: '',
    avatar: '',
    title: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch user info
        const { data: userData } = await supabase
          .from('users')
          .select('id, name, avatar_url, email')
          .eq('id', user.id)
          .single();
        // Fetch research aid profile
        const { data: profileData } = await supabase
          .from('research_aid_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        // Fetch jobs in progress
        const { count: jobsInProgress } = await supabase
          .from('service_bookings')
          .select('id', { count: 'exact', head: true })
          .eq('provider_id', user.id)
          .eq('status', 'in_progress');
        // Fetch total jobs completed
        const { count: totalJobs } = await supabase
          .from('service_bookings')
          .select('id', { count: 'exact', head: true })
          .eq('provider_id', user.id)
          .eq('status', 'completed');
        // Fetch new messages (unread) - fallback to all messages if 'messages' not in types
        let newMessages = 0;
        try {
          const { count } = await supabase
            .from('messages' as any)
            .select('id', { count: 'exact', head: true })
            .eq('recipient_id', user.id)
            .is('read', false);
          newMessages = count || 0;
        } catch {
          newMessages = 0;
        }
        // Fetch earnings this week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const { data: earningsRows } = await supabase
          .from('transactions')
          .select('amount, created_at')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .gte('created_at', weekAgo.toISOString());
        const earningsThisWeek = (earningsRows || []).reduce((sum, row) => sum + (row.amount || 0), 0);
        // Profile views fallback (not in schema)
        const profileViews = 0;
        // Calculate success rate
        const successRate = totalJobs + jobsInProgress > 0 ? Math.round((totalJobs / (totalJobs + jobsInProgress)) * 100) : 0;
        setAidProfile(profileData);
        setStats({
          jobsInProgress: jobsInProgress || 0,
          newMessages: newMessages || 0,
          earningsThisWeek,
          profileViews,
          rating: profileData?.rating || 0,
          totalJobs: totalJobs || 0,
          successRate,
          name: userData?.name || '',
          avatar: userData?.avatar_url || '/placeholder-avatar.jpg',
          title: profileData?.title || '',
        });
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getWelcomeMessage = () => {
    if (!profile?.name) return "Welcome!";
    
    const nameParts = profile.name.split(' ');
    const lastName = nameParts[nameParts.length - 1];
    
    // Check for academic rank first (Professor takes precedence)
    if (profile.academic_rank && 
        (profile.academic_rank.includes('Professor') || 
         profile.academic_rank.includes('Prof'))) {
      return `Welcome, Prof. ${lastName}!`;
    }
    
    // Check for PhD/Postdoc in level_of_study or highest_education
    const hasPhD = profile.level_of_study?.toLowerCase().includes('phd') ||
                   profile.level_of_study?.toLowerCase().includes('postdoc') ||
                   profile.highest_education?.toLowerCase().includes('phd') ||
                   profile.highest_education?.toLowerCase().includes('postdoc');
    
    if (hasPhD) {
      return `Welcome, Dr. ${lastName}!`;
    }
    
    return `Welcome, ${lastName}!`;
  };

  const handleViewJobRequests = () => {
    setActiveTab("job-requests");
  };

  const handleCheckMessages = () => {
    setActiveTab("messages");
  };

  const handleUpdateProfile = () => {
    setActiveTab("profile-ratings");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{getWelcomeMessage()}</h2>
              <p className="text-gray-600 mt-1">
                You have <span className="font-semibold text-blue-600">3 new job requests</span> and 
                <span className="font-semibold text-orange-600"> 1 pending delivery</span>.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium">Available</span>
              <Switch
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
                className="data-[state=checked]:bg-green-600"
              />
              <Badge variant={isAvailable ? "default" : "secondary"} className={isAvailable ? "bg-green-600" : ""}>
                {isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={stats.avatar} alt={stats.name} />
              <AvatarFallback>{stats.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{stats.name}</h3>
              <p className="text-sm text-gray-600">{stats.title}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-lg font-semibold">{stats.rating}</span>
              </div>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
              <p className="text-sm text-gray-600">Total Jobs Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.successRate}%</p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Jobs in Progress</p>
                <p className="text-2xl font-bold">{stats.jobsInProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New Messages</p>
                <p className="text-2xl font-bold">{stats.newMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Earnings This Week</p>
                <p className="text-2xl font-bold">{stats.earningsThisWeek} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold">{stats.profileViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="w-full" onClick={handleViewJobRequests}>
              View Job Requests
            </Button>
            <Button variant="outline" className="w-full" onClick={handleCheckMessages}>
              Check Messages
            </Button>
            <Button variant="outline" className="w-full" onClick={handleUpdateProfile}>
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAidsOverview;
