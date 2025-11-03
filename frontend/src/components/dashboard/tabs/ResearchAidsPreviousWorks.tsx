
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PlatformWorkCard from "../previousWorks/PlatformWorkCard";
import PrePlatformWorkCard from "../previousWorks/PrePlatformWorkCard";
import AddWorkModal from "../previousWorks/AddWorkModal";
import PortfolioSummary from "../previousWorks/PortfolioSummary";
import { usePreviousWorks } from "@/hooks/usePreviousWorks";
import LoadingSpinner from "@/components/LoadingSpinner"; // Assuming this component exists
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"; // Added DialogTrigger, DialogFooter
import { Input } from "@/components/ui/input"; // Added Input
import { Label } from "@/components/ui/label"; // Added Label
import { Upload } from "lucide-react"; // Added Upload icon

const ResearchAidsPreviousWorks = () => {
  const [activeTab, setActiveTab] = useState("platform");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewFileName, setPreviewFileName] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // New state for upload modal
  const [fileToUpload, setFileToUpload] = useState<File | null>(null); // New state for file
  const [selectedWorkIdForUpload, setSelectedWorkIdForUpload] = useState<string | null>(null); // New state for workId

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
    handleUploadDeliverable, // New import from hook
    handleDeleteDeliverable, // New import from hook
    loading,
    error
  } = usePreviousWorks();

  const getViewerUrl = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    const googleViewerUrl = 'https://docs.google.com/gview?url=';

    switch (extension) {
      case 'pdf':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return url; // Browser can natively handle these
      case 'doc':
      case 'docx':
      case 'xls':
      case 'xlsx':
      case 'ppt':
      case 'pptx':
        return `${googleViewerUrl}${encodeURIComponent(url)}&embedded=true`;
      default:
        return url; // Fallback to direct URL, browser might download
    }
  };

  const handlePreviewDeliverable = (url: string, name: string) => {
    setPreviewUrl(getViewerUrl(url));
    setPreviewFileName(name);
    setIsPreviewModalOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileToUpload(event.target.files[0]);
    } else {
      setFileToUpload(null);
    }
  };

  const handleUploadClick = (workId: string) => {
    setSelectedWorkIdForUpload(workId);
    setIsUploadModalOpen(true);
  };

  const handleSubmitUpload = async () => {
    if (fileToUpload && selectedWorkIdForUpload) {
      await handleUploadDeliverable(selectedWorkIdForUpload, fileToUpload);
      setIsUploadModalOpen(false);
      setFileToUpload(null);
      setSelectedWorkIdForUpload(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold truncate">Previous Works</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="order-2 sm:order-1">
            <AddWorkModal
              isOpen={isAddWorkOpen}
              onOpenChange={setIsAddWorkOpen}
              newWork={newWork}
              onNewWorkChange={setNewWork}
              onAddWork={handleAddWork}
            />
          </div>
          <div className="flex space-x-1 sm:space-x-2 order-1 sm:order-2">
            <Button 
              variant={activeTab === "platform" ? "default" : "outline"} 
              onClick={() => setActiveTab("platform")}
              size="sm"
              className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">Platform Projects</span>
              <span className="sm:hidden">Platform</span>
            </Button>
            <Button 
              variant={activeTab === "pre-platform" ? "default" : "outline"} 
              onClick={() => setActiveTab("pre-platform")}
              size="sm"
              className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">Previous Experience</span>
              <span className="sm:hidden">Experience</span>
            </Button>
          </div>
        </div>
      </div>

      {activeTab === "platform" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {platformWorks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm sm:text-base">No platform projects found.</p>
              </div>
            ) : (
              platformWorks.map((work) => (
                <PlatformWorkCard
                  key={work.id}
                  work={work}
                  onViewDetails={handleViewDetails}
                  onDownloadPortfolio={handleDownloadPortfolio}
                  onPreviewDeliverable={handlePreviewDeliverable}
                  onUploadFile={() => handleUploadClick(work.id.toString())} // New prop
                  onDeleteDeliverable={handleDeleteDeliverable} // New prop
                />
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "pre-platform" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {prePlatformWorks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm sm:text-base">No previous experience found.</p>
              </div>
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

      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[800px] h-[85vh] sm:h-[80vh] flex flex-col max-w-none">
          <DialogHeader>
            <DialogTitle className="text-sm sm:text-base truncate pr-8">
              Preview: {previewFileName}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-hidden">
            {previewUrl && (
              <iframe
                src={previewUrl}
                title={previewFileName}
                className="w-full h-full border-0"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Upload Deliverable Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[425px] max-w-none">
          <DialogHeader>
            <DialogTitle className="text-sm sm:text-base">Upload Deliverable</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="file" className="sm:text-right text-sm">
                File
              </Label>
              <Input 
                id="file" 
                type="file" 
                className="sm:col-span-3" 
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              type="submit" 
              onClick={handleSubmitUpload} 
              disabled={!fileToUpload || loading}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" /> Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResearchAidsPreviousWorks;
