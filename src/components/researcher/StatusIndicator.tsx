
interface StatusIndicatorProps {
  status: "online" | "offline" | "in-session";
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return { color: "bg-green-500", text: "Online", textColor: "text-green-600" };
      case "offline":
        return { color: "bg-gray-500", text: "Offline", textColor: "text-gray-600" };
      case "in-session":
        return { color: "bg-yellow-500", text: "In Session", textColor: "text-yellow-600" };
      default:
        return { color: "bg-gray-500", text: "Offline", textColor: "text-gray-600" };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
      <span className={`text-sm font-medium ${config.textColor}`}>{config.text}</span>
    </div>
  );
};

export default StatusIndicator;
