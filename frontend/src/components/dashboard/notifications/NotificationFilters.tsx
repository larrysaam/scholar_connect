
import { Button } from "@/components/ui/button";

interface NotificationFiltersProps {
  filter: string;
  setFilter: (filter: string) => void;
  unreadCount: number;
}

const NotificationFilters = ({ filter, setFilter, unreadCount }: NotificationFiltersProps) => {
  const filters = [
    { key: "all", label: "All" },
    { key: "unread", label: `Unread (${unreadCount})` },
    { key: "job_invitation", label: "Job Invitations" },
    { key: "payment_received", label: "Payments" },
    { key: "appointment_reminder", label: "Appointments" },
    { key: "message_received", label: "Messages" }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filterItem) => (
        <Button
          key={filterItem.key}
          variant={filter === filterItem.key ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter(filterItem.key)}
        >
          {filterItem.label}
        </Button>
      ))}
    </div>
  );
};

export default NotificationFilters;
