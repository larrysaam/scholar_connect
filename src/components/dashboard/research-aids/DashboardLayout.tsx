
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ResearchAidsSidebar from "@/components/dashboard/ResearchAidsSidebar";

interface DashboardLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

const DashboardLayout = ({ activeTab, setActiveTab, children }: DashboardLayoutProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <ResearchAidsSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />
      </div>
      
      <div className="md:col-span-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value={activeTab} className="mt-0">
            {children}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardLayout;
