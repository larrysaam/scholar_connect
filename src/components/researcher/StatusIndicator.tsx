
interface StatusIndicatorProps {
  isOnline: boolean;
  className?: string;
}

const StatusIndicator = ({ isOnline, className }: StatusIndicatorProps) => {
  const getStatusConfig = () => {
    if (isOnline) {
      return { color: "bg-green-500", text: "Online", textColor: "text-green-600" };
    } else {
      return { color: "bg-gray-500", text: "Offline", textColor: "text-gray-600" };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
      <span className={`text-sm font-medium ${config.textColor}`}>{config.text}</span>
    </div>
  );
};

export default StatusIndicator;
