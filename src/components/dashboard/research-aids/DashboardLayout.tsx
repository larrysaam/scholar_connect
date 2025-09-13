
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ResearchAidsSidebar from "@/components/dashboard/ResearchAidsSidebar";

interface DashboardLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

const DashboardLayout = ({ activeTab, setActiveTab, children }: DashboardLayoutProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Sidebar - hidden on mobile, visible on tablet/desktop */}
      <div className="hidden lg:block lg:col-span-1 mb-4 lg:mb-0">
        <ResearchAidsSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />
      </div>
      
      {/* Main content - full width on mobile, 3/4 width on tablet/desktop */}
      <div className="col-span-1 lg:col-span-3">
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
