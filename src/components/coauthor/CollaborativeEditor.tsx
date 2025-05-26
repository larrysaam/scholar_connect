
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, Download, FileText, Settings } from "lucide-react";

interface CollaborativeEditorProps {
  document: {
    title: string;
    abstract: string;
    content: string;
    references: string;
  };
  setDocument: (doc: any) => void;
  permissions: {
    canWrite: boolean;
    canExport: boolean;
  };
  onSave: () => void;
  onExport: (format: string) => void;
}

const CollaborativeEditor = ({ 
  document, 
  setDocument, 
  permissions, 
  onSave, 
  onExport 
}: CollaborativeEditorProps) => {
  const [activeSection, setActiveSection] = useState("content");
  const [wordCount, setWordCount] = useState(0);

  const exportFormats = [
    { value: "pdf", label: "PDF" },
    { value: "docx", label: "Word (.docx)" },
    { value: "latex", label: "LaTeX" },
    { value: "scholar", label: "ScholarConnect Submission" }
  ];

  const updateWordCount = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleContentChange = (field: string, value: string) => {
    setDocument({
      ...document,
      [field]: value
    });
    
    if (field === 'content') {
      updateWordCount(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Stats */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Word count: {wordCount}</span>
          <span>•</span>
          <span>Last saved: 2 minutes ago</span>
          <span>•</span>
          <Badge variant="outline" className="text-xs">Auto-saving enabled</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Now
          </Button>
          
          {permissions.canExport && (
            <Select onValueChange={onExport}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Export as..." />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      {format.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Main Editor */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Editor
            </CardTitle>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="title">Title & Info</TabsTrigger>
              <TabsTrigger value="abstract">Abstract</TabsTrigger>
              <TabsTrigger value="content">Main Content</TabsTrigger>
              <TabsTrigger value="references">References</TabsTrigger>
            </TabsList>
            
            <TabsContent value="title" className="mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="doc-title">Document Title</Label>
                  <Input
                    id="doc-title"
                    value={document.title}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    className="mt-1 text-lg font-medium"
                    readOnly={!permissions.canWrite}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Document Type</Label>
                    <Select disabled={!permissions.canWrite}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Journal Article" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="journal">Journal Article</SelectItem>
                        <SelectItem value="conference">Conference Paper</SelectItem>
                        <SelectItem value="thesis">Thesis</SelectItem>
                        <SelectItem value="policy">Policy Brief</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Target Journal</Label>
                    <Input 
                      placeholder="Enter target journal" 
                      className="mt-1"
                      readOnly={!permissions.canWrite}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Keywords</Label>
                  <Input 
                    placeholder="Artificial Intelligence, Education, Research Methodology" 
                    className="mt-1"
                    readOnly={!permissions.canWrite}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="abstract" className="mt-6">
              <div>
                <Label htmlFor="abstract">Abstract</Label>
                <Textarea
                  id="abstract"
                  value={document.abstract}
                  onChange={(e) => handleContentChange('abstract', e.target.value)}
                  className="mt-1 min-h-[200px]"
                  placeholder="Write your abstract here..."
                  readOnly={!permissions.canWrite}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {document.abstract.length}/300 characters recommended
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="mt-6">
              <div>
                <Label htmlFor="content">Main Content</Label>
                <Textarea
                  id="content"
                  value={document.content}
                  onChange={(e) => handleContentChange('content', e.target.value)}
                  className="mt-1 min-h-[500px] font-mono"
                  placeholder="Write your research content here..."
                  readOnly={!permissions.canWrite}
                />
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>Supports Markdown formatting</span>
                  <span>{document.content.length} characters</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="references" className="mt-6">
              <div>
                <Label htmlFor="references">References & Bibliography</Label>
                <Textarea
                  id="references"
                  value={document.references}
                  onChange={(e) => handleContentChange('references', e.target.value)}
                  className="mt-1 min-h-[300px]"
                  placeholder="Add your references here..."
                  readOnly={!permissions.canWrite}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Use standard citation format (APA, MLA, Chicago, etc.)
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Access Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Journal Finder</h4>
            <p className="text-sm text-gray-600 mb-3">Find relevant journals for your research</p>
            <Button size="sm" variant="outline" className="w-full">
              Find Journals
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Research Aid Marketplace</h4>
            <p className="text-sm text-gray-600 mb-3">Get help with editing, statistics, or data analysis</p>
            <Button size="sm" variant="outline" className="w-full">
              Browse Services
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Templates</h4>
            <p className="text-sm text-gray-600 mb-3">Use academic writing templates</p>
            <Button size="sm" variant="outline" className="w-full">
              Browse Templates
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CollaborativeEditor;
