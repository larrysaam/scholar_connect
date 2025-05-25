
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, Clock, XCircle, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface VerificationBadgeProps {
  type: "academic" | "publication" | "institutional";
  status: "verified" | "pending" | "unverified";
  size?: "sm" | "md" | "lg";
}

const VerificationBadge = ({ type, status, size = "sm" }: VerificationBadgeProps) => {
  const { t } = useLanguage();

  const getIcon = () => {
    switch (status) {
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
    switch (status) {
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
    const typeText = t(`researchAids.verification.${type}`);
    const statusText = t(`researchAids.verification.${status}`);
    return `${typeText}: ${statusText}`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={getVariant()} 
            className={`flex items-center gap-1 ${
              status === "verified" ? "bg-green-100 text-green-800 border-green-200" : 
              status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : 
              "bg-gray-100 text-gray-600 border-gray-200"
            } ${size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1"}`}
          >
            {getIcon()}
            {size !== "sm" && (
              <span className="ml-1">
                {status === "verified" && <Shield className="h-3 w-3" />}
                {t(`researchAids.verification.${status}`)}
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
