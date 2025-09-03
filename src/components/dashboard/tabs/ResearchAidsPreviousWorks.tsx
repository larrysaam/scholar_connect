
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PlatformWorkCard from "../previousWorks/PlatformWorkCard";
import PrePlatformWorkCard from "../previousWorks/PrePlatformWorkCard";
import AddWorkModal from "../previousWorks/AddWorkModal";
import PortfolioSummary from "../previousWorks/PortfolioSummary";
import { usePreviousWorks } from "@/hooks/usePreviousWorks";
import LoadingSpinner from "@/components/LoadingSpinner"; // Assuming this component exists

const ResearchAidsPreviousWorks = () => {
  const [activeTab, setActiveTab] = useState("platform");
  
  const {
    platformWorks,
    prePlatformWorks,
    isAddWorkOpen,
    setIsAddWorkOpen,
    newWork,
    setNewWork,
    handleAddWork,
    handleViewDetails,
    handleDownloadPortfolio,
    handleViewCertificate,
    loading,
    error
  } = usePreviousWorks();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Previous Works</h2>
        <div className="flex space-x-2">
          <AddWorkModal
            isOpen={isAddWorkOpen}
            onOpenChange={setIsAddWorkOpen}
            newWork={newWork}
            onNewWorkChange={setNewWork}
            onAddWork={handleAddWork}
          />
          <Button 
            variant={activeTab === "platform" ? "default" : "outline"} 
            onClick={() => setActiveTab("platform")}
          >
            Platform Projects
          </Button>
          <Button 
            variant={activeTab === "pre-platform" ? "default" : "outline"} 
            onClick={() => setActiveTab("pre-platform")}
          >
            Previous Experience
          </Button>
        </div>
      </div>

      {activeTab === "platform" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {platformWorks.length === 0 ? (
              <p>No platform projects found.</p>
            ) : (
              platformWorks.map((work) => (
                <PlatformWorkCard
                  key={work.id}
                  work={work}
                  onViewDetails={handleViewDetails}
                  onDownloadPortfolio={handleDownloadPortfolio}
                />
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "pre-platform" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {prePlatformWorks.length === 0 ? (
              <p>No previous experience found.</p>
            ) : (
              prePlatformWorks.map((work) => (
                <PrePlatformWorkCard
                  key={work.id}
                  work={work}
                  onViewDetails={handleViewDetails}
                  onViewCertificate={handleViewCertificate}
                />
              ))
            )}
          </div>
        </div>
      )}

      <PortfolioSummary 
        platformWorks={platformWorks} 
        prePlatformWorks={prePlatformWorks} 
      />
    </div>
  );
};

export default ResearchAidsPreviousWorks;
