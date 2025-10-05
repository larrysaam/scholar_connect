import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceGridModalProps {
  category: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  showIcon?: boolean;
}

const PriceGridModal = ({ category, className, variant = "outline", showIcon = true }: PriceGridModalProps) => {
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
            "Publication or Defense Preparation Support"
          ],
          notes: [
            "Prices can be adjusted based on thesis length and complexity",
            "Payment plans available over the duration of support",
            "Includes regular check-ins and milestone reviews",
            "Add-ons available for specialized statistical analysis or tools"
          ],
          addOns: [
            { service: "Statistical Analysis Package", fee: "50,000 – 100,000" },
            { service: "Research Software Training", fee: "30,000 – 60,000" },
            { service: "Monthly Progress Report", fee: "25,000" }
          ]
        };
      case "Full Thesis Review":
        return {
          title: "Full Thesis Review (Complete Manuscript)",
          data: [
            { rank: "Professor / Professor Emeritus / Emerita/Research Director", undergraduate: "70,000 – 100,000", masters: "130,000 – 180,000", phd: "200,000 – 300,000" },
            { rank: "Associate Professor", undergraduate: "60,000 – 90,000", masters: "120,000 – 170,000", phd: "180,000 – 280,000" },
            { rank: "Senior Lecturer / Senior Research Officer", undergraduate: "50,000 – 80,000", masters: "100,000 – 150,000", phd: "160,000 – 240,000" },
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
            { rank: "Professor / Professor Emeritus / Emerita/Research Director", undergraduate: "25,000 – 35,000", masters: "45,000 – 65,000", phd: "75,000 – 100,000" },
            { rank: "Associate Professor", undergraduate: "20,000 – 30,000", masters: "40,000 – 60,000", phd: "70,000 – 95,000" },
            { rank: "Senior Lecturer / Senior Research Officer", undergraduate: "15,000 – 25,000", masters: "35,000 – 55,000", phd: "65,000 – 90,000" },
            { rank: "Lecturer / PhD Holder / Research Officer", undergraduate: "10,000 – 20,000", masters: "30,000 – 50,000", phd: "60,000 – 85,000" }
          ],
          includes: [
            "Detailed chapter analysis",
            "Content and argument evaluation",
            "Structure and flow assessment",
            "Citation and reference check",
            "Language and clarity review",
            "Recommendations for improvement"
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
            { rank: "Professor / Professor Emeritus / Emerita/Research Director", fee: "8,000 – 12,000" },
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
        <Button 
          variant={variant} 
          size="sm" 
          className={cn("text-xs sm:text-sm", className)}
        >
          {showIcon && <Eye className="h-4 w-4 mr-1" />}
          View Price Grid
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-blue-900">{priceData.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Price Table */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="font-semibold text-blue-900">Academic Rank</TableHead>
                  {category === "General Consultation" ? (
                    <TableHead className="font-semibold text-blue-900">Suggested Fee Range (XAF) per Hour</TableHead>
                  ) : (
                    <>
                      <TableHead className="font-semibold text-blue-900">Undergraduate (XAF)</TableHead>
                      <TableHead className="font-semibold text-blue-900">Master's (XAF)</TableHead>
                      <TableHead className="font-semibold text-blue-900">PhD (XAF)</TableHead>
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
                        <TableCell className="text-green-700">{row.undergraduate}</TableCell>
                        <TableCell className="text-blue-700">{row.masters}</TableCell>
                        <TableCell className="text-purple-700">{row.phd}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* What's Included */}
          {priceData.includes && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">What This Includes:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {priceData.includes.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2 text-green-800">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {priceData.notes && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-3">Important Notes:</h4>
              <ul className="space-y-2">
                {priceData.notes.map((note, index) => (
                  <li key={index} className="flex items-start space-x-2 text-yellow-800">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span className="text-sm">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add-ons */}
          {priceData.addOns && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">Optional Add-ons:</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-blue-900">Add-on Service</TableHead>
                    <TableHead className="text-blue-900">Extra Fee (XAF)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceData.addOns.map((addon, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{addon.service}</TableCell>
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

export default PriceGridModal;
