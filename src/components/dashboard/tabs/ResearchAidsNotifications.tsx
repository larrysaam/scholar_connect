
import { useState } from "react";
import NotificationHeader from "../notifications/NotificationHeader";
import NotificationFilters from "../notifications/NotificationFilters";
import NotificationCard from "../notifications/NotificationCard";
import EmptyNotifications from "../notifications/EmptyNotifications";
import { useNotifications } from "@/hooks/useNotifications";

const ResearchAidsNotifications = () => {
  const [filter, setFilter] = useState("all");
  
  const {
    handleViewJob,
    handleJoinMeeting,
    handleReply,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    getFilteredNotifications
  } = useNotifications();

  const unreadCount = getUnreadCount();
  const filteredNotifications = getFilteredNotifications(filter);

  return (
    <div className="space-y-6">
      <NotificationHeader 
        unreadCount={unreadCount}
        onMarkAllAsRead={markAllAsRead}
      />

      <NotificationFilters
        filter={filter}
        setFilter={setFilter}
        unreadCount={unreadCount}
      />

      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkAsRead={markAsRead}
            onViewJob={handleViewJob}
            onJoinMeeting={handleJoinMeeting}
            onReply={handleReply}
          />
        ))}
      </div>

      {filteredNotifications.length === 0 && <EmptyNotifications />}
    </div>
  );
};

export default ResearchAidsNotifications;
