
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

      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Preview: {previewFileName}</DialogTitle>
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Deliverable</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <Input id="file" type="file" className="col-span-3" onChange={handleFileChange} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitUpload} disabled={!fileToUpload || loading}>
              <Upload className="h-4 w-4 mr-2" /> Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResearchAidsPreviousWorks;
