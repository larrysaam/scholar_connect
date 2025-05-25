import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, Clock, XCircle, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface VerificationBadgeProps {
  type?: "academic" | "publication" | "institutional" | "overall";
  status: "verified" | "pending" | "unverified";
  size?: "sm" | "md" | "lg";
  verifications?: {
    academic: "verified" | "pending" | "unverified";
    publication: "verified" | "pending" | "unverified";
    institutional: "verified" | "pending" | "unverified";
  };
}

const VerificationBadge = ({ 
  type = "overall", 
  status, 
  size = "sm", 
  verifications 
}: VerificationBadgeProps) => {
  const { t } = useLanguage();

  // Calculate overall status if type is "overall" and verifications are provided
  const getOverallStatus = () => {
    if (type !== "overall" || !verifications) return status;
    
    const { academic, publication, institutional } = verifications;
    
    // If all are verified, status is verified
    if (academic === "verified" && publication === "verified" && institutional === "verified") {
      return "verified";
    }
    
    // If any is pending, status is pending
    if (academic === "pending" || publication === "pending" || institutional === "pending") {
      return "pending";
    }
    
    // If at least one is verified, status is verified
    if (academic === "verified" || publication === "verified" || institutional === "verified") {
      return "verified";
    }
    
    // Otherwise unverified
    return "unverified";
  };

  const finalStatus = getOverallStatus();

  const getIcon = () => {
    switch (finalStatus) {
      case "verified":
        return <CheckCircle className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} text-green-600`} />;
      case "pending":
        return <Clock className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} text-yellow-600`} />;
      case "unverified":
        return <XCircle className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} text-gray-400`} />;
      default:
        return null;
    }
  };

  const getVariant = () => {
    switch (finalStatus) {
      case "verified":
        return "default";
      case "pending":
        return "secondary";
      case "unverified":
        return "outline";
      default:
        return "outline";
    }
  };

  const getTooltipText = () => {
    if (type === "overall" && verifications) {
      const verifiedCount = Object.values(verifications).filter(v => v === "verified").length;
      const pendingCount = Object.values(verifications).filter(v => v === "pending").length;
      
      if (finalStatus === "verified") {
        return `Verified Researcher (${verifiedCount}/3 credentials verified)`;
      } else if (finalStatus === "pending") {
        return `Verification in Progress (${pendingCount} pending, ${verifiedCount} verified)`;
      } else {
        return "Credentials not yet verified";
      }
    }
    
    const typeText = type !== "overall" ? t(`researchAids.verification.${type}`) : "Overall";
    const statusText = t(`researchAids.verification.${finalStatus}`);
    return `${typeText}: ${statusText}`;
  };

  const getBadgeText = () => {
    if (type === "overall") {
      switch (finalStatus) {
        case "verified":
          return "Verified";
        case "pending":
          return "Pending";
        case "unverified":
          return "Unverified";
        default:
          return "Unverified";
      }
    }
    return t(`researchAids.verification.${finalStatus}`);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={getVariant()} 
            className={`flex items-center gap-1 ${
              finalStatus === "verified" ? "bg-green-100 text-green-800 border-green-200" : 
              finalStatus === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : 
              "bg-gray-100 text-gray-600 border-gray-200"
            } ${size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1"}`}
          >
            {getIcon()}
            {size !== "sm" && (
              <span className="ml-1">
                {finalStatus === "verified" && <Shield className="h-3 w-3" />}
                {getBadgeText()}
              </span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerificationBadge;
