
export const getNotificationColor = (type: string) => {
  switch (type) {
    case "job_invitation":
      return "bg-blue-100 text-blue-800";
    case "payment_received":
      return "bg-green-100 text-green-800";
    case "appointment_reminder":
      return "bg-purple-100 text-purple-800";
    case "message_received":
      return "bg-yellow-100 text-yellow-800";
    case "project_completed":
      return "bg-emerald-100 text-emerald-800";
    case "deadline_reminder":
      return "bg-red-100 text-red-800";
    case "profile_view":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return { className: "bg-red-600", text: "High" };
    case "medium":
      return { className: "bg-yellow-600", text: "Medium" };
    case "low":
      return { className: "bg-gray-400", text: "Low", variant: "secondary" as const };
    default:
      return { className: "bg-gray-400", text: "Normal", variant: "outline" as const };
  }
};
