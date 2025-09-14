import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  DollarSign, 
  Video, 
  MessageSquare,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Search
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useBookingSystem } from "@/hooks/useBookingSystem";
import { AddReviewDialog } from "./AddReviewDialog";
import { Booking } from "@/types/bookings";

const MyBookingsTab = () => {
  const {
    bookings,
    loading,
    cancelBooking,
    rescheduleBooking,
    joinMeeting,
    addBookingReview,
    getAvailableSlots,
    fetchUserBookings
  } = useBookingSystem();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [cancelReason, setCancelReason] = useState("");

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = searchTerm === "" || 
        booking.service?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client_notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  // Group bookings by status
  const bookingStats = useMemo(() => {
    return {
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
  }, [bookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'no_show': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle reschedule
  const handleReschedule = async () => {
    if (!selectedBooking || !rescheduleDate || !rescheduleTime) return;

    const success = await rescheduleBooking(
      selectedBooking.id,
      format(rescheduleDate, 'yyyy-MM-dd'),
      rescheduleTime
    );

    if (success) {
      setSelectedBooking(null);
      setRescheduleDate(undefined);
      setRescheduleTime("");
    }
  };

  // Handle cancel booking
  const handleCancel = async () => {
    if (!selectedBooking) return;

    const success = await cancelBooking(selectedBooking.id, cancelReason);
    if (success) {
      setSelectedBooking(null);
      setCancelReason("");
    }
  };

  // Handle add review
  const handleAddReview = async (bookingId: string, providerId: string, rating: number, comment: string) => {
    const success = await addBookingReview(
      bookingId,
      providerId,
      rating,
      comment
    );

    if (success) {
      setSelectedBooking(null);
    }
  };

  // Load available slots for reschedule
  const loadAvailableSlots = async (date: Date) => {
    if (!selectedBooking) return;
    
    const slots = await getAvailableSlots(
      selectedBooking.provider_id,
      format(date, 'yyyy-MM-dd')
    );
    setAvailableSlots(slots);
  };
  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="hover:shadow-md transition-shadow max-w-full">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Header with badges */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-3">
              <h4 className="font-semibold text-base sm:text-lg truncate min-w-0 flex-1">
                {booking.service?.title || 'Consultation'}
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge className={`${getStatusColor(booking.status)} text-xs`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(booking.status)}
                    <span className="truncate">
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </Badge>
                <Badge className={`${getPaymentStatusColor(booking.payment_status)} text-xs`}>
                  <span className="truncate">
                    {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                  </span>
                </Badge>
              </div>
            </div>

            {/* Provider info */}
            <div className="flex items-center gap-2 mb-3 min-w-0">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-medium truncate">
                  {booking.provider?.name}
                </span>
                {booking.provider?.institution && (
                  <span className="text-xs sm:text-sm text-gray-500 ml-1 truncate">
                    at {booking.provider.institution}
                  </span>
                )}
              </div>
            </div>

            {/* Booking details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1 min-w-0">
                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">
                  {format(new Date(booking.scheduled_date), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">
                  {booking.scheduled_time} ({booking.duration_minutes}min)
                </span>
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate capitalize">{booking.academic_level}</span>
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate font-medium">
                  {booking.total_price.toLocaleString()} {booking.currency}
                </span>
              </div>
            </div>

            {/* Client notes */}
            {booking.client_notes && (
              <div className="text-xs sm:text-sm mb-3 p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-600">Notes: </span>
                <span className="text-gray-700 break-words">{booking.client_notes}</span>
              </div>
            )}

            {/* Booking time */}
            <div className="text-xs text-gray-500">
              Booked {formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row lg:flex-col gap-2 flex-wrap lg:flex-nowrap">
            {booking.status === 'confirmed' && booking.meeting_link && (
              <Button
                size="sm"
                onClick={() => joinMeeting(booking.id)}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-xs sm:text-sm"
              >
                <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Join Meeting</span>
                <span className="sm:hidden">Join</span>
              </Button>
            )}            {booking.status === 'pending' && (
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedBooking(booking)}
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Reschedule</span>
                      <span className="sm:hidden">Reschedule</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
                    <DialogHeader className="pb-3">
                      <DialogTitle className="text-base sm:text-lg">Reschedule Booking</DialogTitle>
                      <DialogDescription className="text-sm">
                        Select a new date and time for your consultation
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                      <div>
                        <Label className="text-sm font-medium">New Date</Label>
                        <Calendar
                          mode="single"
                          selected={rescheduleDate}
                          onSelect={(date) => {
                            setRescheduleDate(date);
                            if (date) loadAvailableSlots(date);
                          }}
                          disabled={(date) => date < new Date()}
                          className="rounded-md border mx-auto"
                        />
                      </div>
                      {rescheduleDate && (
                        <div>
                          <Label className="text-sm font-medium">Available Times</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                            {availableSlots.map((slot) => (
                              <Button
                                key={slot}
                                variant={rescheduleTime === slot ? "default" : "outline"}
                                onClick={() => setRescheduleTime(slot)}
                                size="sm"
                                className="text-xs"
                              >
                                {slot}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedBooking(null)}
                        className="w-full sm:w-auto text-sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleReschedule}
                        disabled={!rescheduleDate || !rescheduleTime}
                        className="w-full sm:w-auto text-sm"
                      >
                        Reschedule
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 w-full sm:w-auto text-xs sm:text-sm"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Cancel</span>
                      <span className="sm:hidden">Cancel</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[95vw] max-w-md mx-2 sm:mx-0">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-base sm:text-lg">Cancel Booking</AlertDialogTitle>
                      <AlertDialogDescription className="text-sm">
                        Are you sure you want to cancel this booking? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4">
                      <Label htmlFor="cancelReason" className="text-sm font-medium">
                        Reason for cancellation (optional)
                      </Label>
                      <Textarea
                        id="cancelReason"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Please provide a reason for cancellation..."
                        className="mt-2 text-sm"
                        rows={3}
                      />
                    </div>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                      <AlertDialogCancel 
                        onClick={() => setSelectedBooking(null)}
                        className="w-full sm:w-auto text-sm"
                      >
                        Keep Booking
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancel}
                        className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm"
                      >
                        Cancel Booking
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}            {booking.status === 'completed' && !booking.has_review && (
              <AddReviewDialog
                booking={booking}
                onAddReview={handleAddReview}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add Review</span>
                  <span className="sm:hidden">Review</span>
                </Button>
              </AddReviewDialog>
            )}

            {booking.status === 'completed' && booking.has_review && (
              <Button
                size="sm"
                variant="outline"
                disabled
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-yellow-400 fill-yellow-400" />
                <span className="hidden sm:inline">Reviewed</span>
                <span className="sm:hidden">Reviewed</span>
              </Button>
            )}

            <Button 
              size="sm" 
              variant="outline"
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Message</span>
              <span className="sm:hidden">Chat</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mr-3" />
        <span>Loading your bookings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">My Bookings</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage your consultation bookings</p>
        </div>
        <Button 
          onClick={fetchUserBookings} 
          variant="outline"
          className="w-full sm:w-auto text-xs sm:text-sm"
        >
          <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-600">{bookingStats.pending}</p>
              </div>
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Confirmed</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">{bookingStats.confirmed}</p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Completed</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">{bookingStats.completed}</p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Cancelled</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600">{bookingStats.cancelled}</p>
              </div>
              <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 sm:py-12">
              <p className="text-sm sm:text-base text-gray-500">No bookings found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        )}
      </div>

      {/* Reschedule Dialog and other modals remain the same but with responsive sizing */}
      {/* All existing Dialog components can remain as they auto-adapt to mobile */}
    </div>
  );
};

export default MyBookingsTab;