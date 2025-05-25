
import { Tabs, TabsContent } from "@/components/ui/tabs";
import UpcomingTab from "./tabs/UpcomingTab";
import PastTab from "./tabs/PastTab";
import PaymentsTab from "./tabs/PaymentsTab";
import ProfileTab from "./tabs/ProfileTab";
import DocumentsTab from "./tabs/DocumentsTab";
import SettingsTab from "./tabs/SettingsTab";
import QualityFeedbackTab from "./tabs/QualityFeedbackTab";

interface DashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardContent = ({ activeTab, setActiveTab }: DashboardContentProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsContent value="upcoming" className="mt-0">
        <UpcomingTab />
      </TabsContent>
      
      <TabsContent value="past" className="mt-0">
        <PastTab />
      </TabsContent>
      
      <TabsContent value="payments" className="mt-0">
        <PaymentsTab />
      </TabsContent>
      
      <TabsContent value="quality" className="mt-0">
        <QualityFeedbackTab />
      </TabsContent>
      
      <TabsContent value="profile" className="mt-0">
        <ProfileTab />
      </TabsContent>
      
      <TabsContent value="documents" className="mt-0">
        <DocumentsTab />
      </TabsContent>
      
      <TabsContent value="settings" className="mt-0">
        <SettingsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardContent;
