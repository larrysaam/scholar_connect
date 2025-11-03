
import { Bell } from "lucide-react";

const EmptyNotifications = () => {
  return (
    <div className="text-center py-8">
      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500">No notifications found for the selected filter.</p>
    </div>
  );
};

export default EmptyNotifications;
