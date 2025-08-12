
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Briefcase, Eye } from "lucide-react";
import PostJobHeader from "@/components/dashboard/post-job/PostJobHeader";
import JobPostingForm from "@/components/dashboard/post-job/JobPostingForm";
import PostJobTips from "@/components/dashboard/post-job/PostJobTips";
import JobManagement from "@/components/dashboard/post-job/JobManagement";
import { useJobManagement } from "@/hooks/useJobManagement";

const PostJobTab = () => {
  const [activeTab, setActiveTab] = useState("post");
  const { jobs, loading } = useJobManagement();

  return (
    <div className="space-y-6">
      <PostJobHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="post" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post New Job
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Manage Jobs ({jobs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="post" className="space-y-6">
          <JobPostingForm />
          <PostJobTips />
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <JobManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostJobTab;
