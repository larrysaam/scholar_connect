import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, X, DollarSign, BookOpen, Eye, Trash2, Info } from "lucide-react";

interface AcademicLevelPrice {
  level: "Undergraduate" | "Master's" | "PhD";
  price: number;
}

interface ServiceType {
  id: string;
  category: "General Consultation" | "Chapter Review" | "Full Thesis Cycle Support" | "Full Thesis Review";
  academicLevelPrices: AcademicLevelPrice[];
  description: string;
}

const ConsultationServicesTab = () => {
  const [services, setServices] = useState<ServiceType[]>([
    {
      id: "1",
      category: "General Consultation",
      academicLevelPrices: [{ level: "Undergraduate", price: 8000 }],
      description: "General research guidance and consultation"
    }
  ]);

  const [newService, setNewService] = useState<Partial<ServiceType>>({
    category: "General Consultation",
    academicLevelPrices: [],
    description: ""
  });

  const [tempAcademicLevel, setTempAcademicLevel] = useState<"Undergraduate" | "Master's" | "PhD">("Undergraduate");
  const [tempPrice, setTempPrice] = useState<number>(0);

  const serviceCategories = [
    "General Consultation",
    "Chapter Review", 
    "Full Thesis Cycle Support",
    "Full Thesis Review"
  ];

  const academicLevels = ["Undergraduate", "Master's", "PhD"];

  const addAcademicLevelPrice = () => {
    if (tempAcademicLevel && tempPrice > 0) {
      const existingIndex = newService.academicLevelPrices?.findIndex(
        item => item.level === tempAcademicLevel
      );
      
      if (existingIndex !== undefined && existingIndex >= 0) {
        // Update existing level
        const updatedPrices = [...(newService.academicLevelPrices || [])];
        updatedPrices[existingIndex] = { level: tempAcademicLevel, price: tempPrice };
        setNewService(prev => ({ ...prev, academicLevelPrices: updatedPrices }));
      } else {
        // Add new level
        setNewService(prev => ({
          ...prev,
          academicLevelPrices: [...(prev.academicLevelPrices || []), { level: tempAcademicLevel, price: tempPrice }]
        }));
      }
      
      setTempPrice(0);
    }
  };

  const removeAcademicLevelPrice = (level: string) => {
    setNewService(prev => ({
      ...prev,
      academicLevelPrices: prev.academicLevelPrices?.filter(item => item.level !== level) || []
    }));
  };

  const addService = () => {
    if (newService.category && newService.academicLevelPrices && newService.academicLevelPrices.length > 0) {
      setServices(prev => [...prev, {
        ...newService as ServiceType,
        id: Date.now().toString()
      }]);
      setNewService({
        category: "General Consultation",
        academicLevelPrices: [],
        description: ""
      });
    }
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const PriceGridModal = ({ category }: { category: string }) => {
    const getPriceData = () => {
      switch (category) {
        case "Full Thesis Cycle Support":
          return {
            title: "Full Thesis Cycle Support / Co-supervision",
            data: [
              { rank: "Professor / Professor Emeritus / Emerita/Research Director", undergraduate: "100,000 – 140,000", masters: "180,000 – 250,000", phd: "300,000 – 450,000" },
              { rank: "Associate Professor", undergraduate: "90,000 – 130,000", masters: "160,000 – 230,000", phd: "280,000 – 400,000" },
              { rank: "Senior Lecturer / Senior Research Officer", undergraduate: "80,000 – 120,000", masters: "140,000 – 200,000", phd: "250,000 – 350,000" },
              { rank: "Lecturer / PhD Holder / Research Officer", undergraduate: "70,000 – 110,000", masters: "120,000 – 180,000", phd: "220,000 – 320,000" }
            ],
            includes: [
              "Topic Development & Approval Guidance",
              "Research Proposal (Chapters 1–3) Coaching", 
              "Methodology Design + Tool Support",
              "Data Analysis Guidance (Quantitative/Qualitative)",
              "Feedback on Chapters 1–5",
              "Referencing & Formatting Checks",
              "Ongoing Email & Scheduled Consultation Support (6–12 sessions)"
            ]
          };
        case "Full Thesis Review":
          return {
            title: "Expert Complete Thesis Review",
            data: [
              { rank: "Professor / Professor Emeritus / Emerita", undergraduate: "75,000 – 100,000", masters: "120,000 – 180,000", phd: "200,000 – 300,000" },
              { rank: "Associate Professor", undergraduate: "60,000 – 90,000", masters: "100,000 – 160,000", phd: "180,000 – 250,000" },
              { rank: "Senior Lecturer / Senior Research Officer", undergraduate: "50,000 – 75,000", masters: "90,000 – 140,000", phd: "150,000 – 220,000" },
              { rank: "Lecturer / PhD Holder / Research Officer", undergraduate: "40,000 – 60,000", masters: "70,000 – 120,000", phd: "120,000 – 180,000" }
            ],
            includes: [
              "Full manuscript review (Intro to Conclusion)",
              "Theoretical and methodological coherence check",
              "Literature alignment and critical analysis", 
              "Structure, flow, clarity, and argument enhancement",
              "Inline and summary feedback",
              "Plagiarism risk alerts and referencing check"
            ],
            addOns: [
              { service: "Full APA/MLA/Chicago Formatting", fee: "10,000 – 20,000" },
              { service: "Final Proofreading & Language Editing", fee: "15,000 – 30,000" },
              { service: "72-hour Express Full Review", fee: "+25% surcharge" }
            ]
          };
        case "Chapter Review":
          return {
            title: "Chapter Review (Per Chapter)",
            data: [
              { rank: "Professor / Professor Emeritus / Emerita", undergraduate: "20,000 – 25,000", masters: "25,000 – 30,000", phd: "30,000 – 35,000" },
              { rank: "Associate Professor", undergraduate: "18,000 – 22,000", masters: "22,000 – 28,000", phd: "25,000 – 30,000" },
              { rank: "Senior Lecturer / Senior Research Officer", undergraduate: "15,000 – 20,000", masters: "20,000 – 25,000", phd: "22,000 – 27,000" },
              { rank: "Lecturer / PhD Holder / Research Officer", undergraduate: "10,000 – 15,000", masters: "15,000 – 20,000", phd: "18,000 – 22,000" }
            ],
            notes: [
              "PhD chapters are generally more rigorous, hence priced higher due to analytical and theoretical complexity",
              "Undergraduate chapters tend to focus more on structure and clarity, so feedback is more affordable",
              "Turnaround time, length, and content difficulty may influence rates within the listed range"
            ],
            addOns: [
              { service: "Formatting & Language Polishing", fee: "5,000 – 10,000" },
              { service: "Citation & Reference Check", fee: "2,000 – 5,000" },
              { service: "Express Review (48–72 hours)", fee: "+20% surcharge" }
            ]
          };
        case "General Consultation":
          return {
            title: "General Research Consultation (Per Hour)",
            data: [
              { rank: "Professor / Professor Emeritus / Emerita/Research Director", fee: "10,000 – 15,000" },
              { rank: "Associate Professor", fee: "7,000 – 10,000" },
              { rank: "Senior Lecturer / Senior Research Officer / Lead", fee: "6,000 – 8,000" },
              { rank: "Lecturer / PhD Holder / Research Officer", fee: "4,000 – 6,000" }
            ],
            includes: [
              "Research Topic Clarification",
              "Problem Statement and Objectives",
              "Conceptual and Theoretical Framework",
              "Literature Review Support",
              "Methodology and Research Design",
              "Live Document Review",
              "Data Analysis & Interpretation",
              "Referencing and Plagiarism",
              "Thesis Formatting & Submission",
              "Publication or Defense Preparation and general research issues"
            ]
          };
        default:
          return null;
      }
    };

    const priceData = getPriceData();
    if (!priceData) return null;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="ml-2">
            <Eye className="h-4 w-4 mr-1" />
            Price Grid
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{priceData.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Price Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academic Rank</TableHead>
                  {category === "General Consultation" ? (
                    <TableHead>Suggested Fee Range (XAF) per Hour</TableHead>
                  ) : (
                    <>
                      <TableHead>Undergraduate (XAF)</TableHead>
                      <TableHead>Master's (XAF)</TableHead>
                      <TableHead>PhD (XAF)</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceData.data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.rank}</TableCell>
                    {category === "General Consultation" ? (
                      <TableCell>{row.fee}</TableCell>
                    ) : (
                      <>
                        <TableCell>{row.undergraduate}</TableCell>
                        <TableCell>{row.masters}</TableCell>
                        <TableCell>{row.phd}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* What's Included */}
            {priceData.includes && (
              <div>
                <h4 className="font-semibold mb-2">What This Includes:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {priceData.includes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notes */}
            {priceData.notes && (
              <div>
                <h4 className="font-semibold mb-2">Notes:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {priceData.notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add-ons */}
            {priceData.addOns && (
              <div>
                <h4 className="font-semibold mb-2">Optional Add-ons:</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Add-on Service</TableHead>
                      <TableHead>Extra Fee (XAF)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {priceData.addOns.map((addon, index) => (
                      <TableRow key={index}>
                        <TableCell>{addon.service}</TableCell>
                        <TableCell>{addon.fee}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Instructions Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Instructions for Service Setup</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Dear Esteemed Researcher, please refer to the price grid before setting a price that corresponds to your academic level. 
                Note that you can add several service categories and academic levels and prices. The platform will deduct 15% of any amount 
                paid by research students. We are passionate about supporting researchers and students.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold">Consultation Service Setup</h2>
        <p className="text-gray-600">Configure your service offerings and pricing</p>
      </div>

      {/* Current Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Your Service Offerings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{service.category}</h4>
                  <PriceGridModal category={service.category} />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeService(service.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">{service.description}</p>
              
              {/* Academic Level Prices */}
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Academic Level Pricing:</h5>
                <div className="flex flex-wrap gap-2">
                  {service.academicLevelPrices.map((levelPrice, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                      <Badge variant="secondary">{levelPrice.level}</Badge>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="text-sm">{levelPrice.price.toLocaleString()} XAF</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Service */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Add New Service</h4>
            
            <div>
              <Label htmlFor="category">Service Category</Label>
              <div className="flex items-center space-x-2">
                <Select
                  value={newService.category}
                  onValueChange={(value) => setNewService(prev => ({ ...prev, category: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {newService.category && (
                  <PriceGridModal category={newService.category} />
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Service Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your service offering..."
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            {/* Academic Level and Price Input */}
            <div className="space-y-3">
              <Label>Academic Level Pricing</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="academicLevel">Academic Level</Label>
                  <Select
                    value={tempAcademicLevel}
                    onValueChange={(value) => setTempAcademicLevel(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {academicLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="price">Price (XAF)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={tempPrice || ''}
                    onChange={(e) => setTempPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="flex items-end">
                  <Button 
                    type="button" 
                    onClick={addAcademicLevelPrice}
                    disabled={!tempAcademicLevel || tempPrice <= 0}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Display added academic level prices */}
              {newService.academicLevelPrices && newService.academicLevelPrices.length > 0 && (
                <div className="space-y-2">
                  <Label>Added Pricing:</Label>
                  <div className="flex flex-wrap gap-2">
                    {newService.academicLevelPrices.map((levelPrice, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-blue-50 rounded-lg p-2">
                        <Badge variant="secondary">{levelPrice.level}</Badge>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="text-sm">{levelPrice.price.toLocaleString()} XAF</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeAcademicLevelPrice(levelPrice.level)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              onClick={addService} 
              className="w-full"
              disabled={!newService.category || !newService.academicLevelPrices || newService.academicLevelPrices.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultationServicesTab;
