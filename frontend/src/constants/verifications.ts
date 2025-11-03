import { User, GraduationCap, Award, Building } from "lucide-react";
import { VerificationItem } from "@/types/verifications";

export const VERIFICATION_ITEMS: VerificationItem[] = [
  {
    key: 'identity',
    title: "Identity Verification",
    description: "Government-issued ID verification",
    icon: User,
    documents: ["Passport", "Driver's License", "National ID Card"]
  },
  {
    key: 'education',
    title: "Educational Background",
    description: "Academic credentials and degrees (e.g., BSc, MSc, PhD)",
    icon: GraduationCap,
    documents: ["Degree Certificate", "Academic Transcript"]
  },
  {
    key: 'employment',
    title: "Employment Verification",
    description: "Current or previous institutional affiliation (if any)",
    icon: Building,
    documents: ["Employment Letter", "Institutional ID"],
    hasOtherField: true
  },
  {
    key: 'skills',
    title: "Skills & Certifications",
    description: "Professional certifications or proof of skills",
    icon: Award,
    documents: ["Certification Document", "Reference Letter"]
  }
];
