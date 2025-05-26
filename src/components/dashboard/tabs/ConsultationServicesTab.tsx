
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Clock, DollarSign, Globe, BookOpen } from "lucide-react";

interface ServiceSetup {
  researchDomains: string[];
  sessionTypes: Array<{
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
  }>;
  languages: string[];
  regions: string[];
}

const ConsultationServicesTab = () => {
  const [services, setServices] = useState<ServiceSetup>({
    researchDomains: ["Machine Learning", "Data Science", "AI Ethics"],
    sessionTypes: [
      {
        id: "1",
        name: "Proposal Review",
        description: "Comprehensive review of research proposals",
        duration: 60,
        price: 45000
      },
      {
        id: "2",
        name: "Thesis Structure Help",
        description: "Guidance on thesis organization and structure",
        duration: 90,
        price: 60000
      }
    ],
    languages: ["English", "French"],
    regions: ["West Africa", "Central Africa"]
  });

  const [newDomain, setNewDomain] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newRegion, setNewRegion] = useState("");
  const [newSessionType, setNewSessionType] = useState({
    name: "",
    description: "",
    duration: 60,
    price: 30000
  });

  const addDomain = () => {
    if (newDomain.trim()) {
      setServices(prev => ({
        ...prev,
        researchDomains: [...prev.researchDomains, newDomain.trim()]
      }));
      setNewDomain("");
    }
  };

  const removeDomain = (index: number) => {
    setServices(prev => ({
      ...prev,
      researchDomains: prev.researchDomains.filter((_, i) => i !== index)
    }));
  };

  const addSessionType = () => {
    if (newSessionType.name.trim()) {
      setServices(prev => ({
        ...prev,
        sessionTypes: [...prev.sessionTypes, {
          ...newSessionType,
          id: Date.now().toString()
        }]
      }));
      setNewSessionType({
        name: "",
        description: "",
        duration: 60,
        price: 30000
      });
    }
  };

  const removeSessionType = (id: string) => {
    setServices(prev => ({
      ...prev,
      sessionTypes: prev.sessionTypes.filter(type => type.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Consultation Services Setup</h2>
        <p className="text-gray-600">Configure your expertise areas and service offerings</p>
      </div>

      {/* Research Domains */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Research Domains</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {services.researchDomains.map((domain, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                <span>{domain}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-red-100"
                  onClick={() => removeDomain(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Add research domain..."
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDomain()}
            />
            <Button onClick={addDomain}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Session Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Session Types & Pricing</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {services.sessionTypes.map((sessionType) => (
            <div key={sessionType.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{sessionType.name}</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeSessionType(sessionType.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">{sessionType.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{sessionType.duration} minutes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{sessionType.price.toLocaleString()} XAF</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Session Type */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Add New Session Type</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionName">Session Name</Label>
                <Input
                  id="sessionName"
                  placeholder="e.g., Proposal Review"
                  value={newSessionType.name}
                  onChange={(e) => setNewSessionType(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select
                  value={newSessionType.duration.toString()}
                  onValueChange={(value) => setNewSessionType(prev => ({ ...prev, duration: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this session covers..."
                value={newSessionType.description}
                onChange={(e) => setNewSessionType(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="price">Price (XAF)</Label>
              <Input
                id="price"
                type="number"
                placeholder="30000"
                value={newSessionType.price}
                onChange={(e) => setNewSessionType(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <Button onClick={addSessionType} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Session Type
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Languages & Regions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Languages</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {services.languages.map((language, index) => (
                <Badge key={index} variant="outline">
                  {language}
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Add language..."
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (newLanguage.trim()) {
                    setServices(prev => ({
                      ...prev,
                      languages: [...prev.languages, newLanguage.trim()]
                    }));
                    setNewLanguage("");
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regions of Expertise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {services.regions.map((region, index) => (
                <Badge key={index} variant="outline">
                  {region}
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Add region..."
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (newRegion.trim()) {
                    setServices(prev => ({
                      ...prev,
                      regions: [...prev.regions, newRegion.trim()]
                    }));
                    setNewRegion("");
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsultationServicesTab;
