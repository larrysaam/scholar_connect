import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  MessageSquare, 
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit
} from "lucide-react";
import { ServiceBooking } from "@/hooks/useConsultationServices";
import { ConsultationService } from "@/types/consultations";
import { formatDistanceToNow, format } from "date-fns";

interface BookingManagementProps {
  bookings: ServiceBooking[];
  services: ConsultationService[];
  onUpdateBookingStatus: (bookingId: string, status: ServiceBooking['status']) => Promise<boolean>;
  onCompleteBooking?: (bookingId: string) => Promise<void>;
}

const BookingManagement = ({
  bookings,
  services,
  onUpdateBookingStatus,
  onCompleteBooking
}: BookingManagementProps) => {
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesSearch = searchTerm === "" || 
      booking.client_notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Group bookings by status
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const upcomingBookings = bookings.filter(b => 
    b.status === 'confirmed' && new Date(b.scheduled_date) >= new Date()
  );

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

  const getServiceTitle = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.title || 'Unknown Service';
  };

  const BookingDetailsDialog = ({ booking }: { booking: ServiceBooking }) => (
    <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto mx-2 sm:mx-0">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-base sm:text-lg">Booking Details</DialogTitle>
        <DialogDescription className="text-xs sm:text-sm">
          View and manage booking information
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 sm:space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="min-w-0">
            <h4 className="font-medium text-xs sm:text-sm text-gray-600">Service</h4>
            <p className="font-medium text-sm sm:text-base truncate">{getServiceTitle(booking.service_id)}</p>
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-xs sm:text-sm text-gray-600">Academic Level</h4>
            <p className="text-sm sm:text-base truncate">{booking.academic_level}</p>
          </div>
          <div className="min-w-0 sm:col-span-2">
            <h4 className="font-medium text-xs sm:text-sm text-gray-600">Date & Time</h4>
            <p className="text-sm sm:text-base">{format(new Date(booking.scheduled_date), 'PPP')} at {booking.scheduled_time}</p>
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-xs sm:text-sm text-gray-600">Duration</h4>
            <p className="text-sm sm:text-base">{booking.duration_minutes} minutes</p>
          </div>
        </div>

        {/* Status & Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="min-w-0">
            <h4 className="font-medium text-xs sm:text-sm text-gray-600">Status</h4>
            <Badge className={`${getStatusColor(booking.status)} text-xs`}>
              <div className="flex items-center gap-1">
                {getStatusIcon(booking.status)}
                <span className="truncate">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
              </div>
            </Badge>
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-xs sm:text-sm text-gray-600">Payment Status</h4>
            <Badge className={`${getPaymentStatusColor(booking.payment_status)} text-xs`}>
              <span className="truncate">{booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}</span>
            </Badge>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="min-w-0">
            <h4 className="font-medium text-xs sm:text-sm text-gray-600">Base Price</h4>
            <p className="font-medium text-sm sm:text-base truncate">{booking.base_price.toLocaleString()} {booking.currency}</p>
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-xs sm:text-sm text-gray-600">Add-ons</h4>
            <p className="font-medium text-sm sm:text-base truncate">{booking.addon_price.toLocaleString()} {booking.currency}</p>
          </div>
          <div className="min-w-0 col-span-2 sm:col-span-1">
            <h4 className="font-medium text-xs sm:text-sm text-gray-600">Total</h4>
            <p className="font-medium text-base sm:text-lg truncate">{booking.total_price.toLocaleString()} {booking.currency}</p>
          </div>
        </div>

        {/* Meeting Link */}
        {booking.meeting_link && (
          <div>
            <h4 className="font-medium text-xs sm:text-sm text-gray-600">Meeting Link</h4>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Input value={booking.meeting_link} readOnly className="flex-1 text-xs sm:text-sm" />
              <Button
                size="sm"
                onClick={() => window.open(booking.meeting_link, '_blank')}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Join Meeting
              </Button>
            </div>
          </div>
        )}

        {/* Notes */}
        {booking.client_notes && (
          <div>
            <h4 className="font-medium text-xs sm:text-sm text-gray-600">Client Notes</h4>
            <p className="text-xs sm:text-sm bg-gray-50 p-2 sm:p-3 rounded-lg break-words">{booking.client_notes}</p>
          </div>
        )}

        {booking.provider_notes && (
          <div>
            <h4 className="font-medium text-xs sm:text-sm text-gray-600">Your Notes</h4>
            <p className="text-xs sm:text-sm bg-gray-50 p-2 sm:p-3 rounded-lg break-words">{booking.provider_notes}</p>
          </div>
        )}

        {/* Status Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          {booking.status === 'pending' && (
            <>
              <Button
                onClick={() => onUpdateBookingStatus(booking.id, 'confirmed')}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
              >
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Confirm Booking
              </Button>
              <Button
                onClick={() => onUpdateBookingStatus(booking.id, 'cancelled')}
                variant="outline"
                className="w-full sm:w-auto text-red-600 hover:text-red-700 text-xs sm:text-sm"
              >
                <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
          
          {booking.status === 'confirmed' && (
            <>
              <Button
                onClick={() => onCompleteBooking ? onCompleteBooking(booking.id) : onUpdateBookingStatus(booking.id, 'completed')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
              >
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Mark Complete
              </Button>
              <Button
                onClick={() => onUpdateBookingStatus(booking.id, 'no_show')}
                variant="outline"
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Mark No Show
              </Button>
            </>
          )}
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-0">
      {/* Header with Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-600">{pendingBookings.length}</p>
              </div>
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Confirmed</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">{confirmedBookings.length}</p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Completed</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">{completedBookings.length}</p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Upcoming</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-600">{upcomingBookings.length}</p>
              </div>
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm"
                />
              </div>
            </div>
            <div className="w-full sm:w-auto md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 sm:py-12 px-4">
              <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                {bookings.length === 0 
                  ? "You don't have any bookings yet. Once students book your services, they'll appear here."
                  : "No bookings match your current filters."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:gap-3 mb-3">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{getServiceTitle(booking.service_id)}</h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={`${getStatusColor(booking.status)} text-xs`}>
                          <div className="flex items-center gap-1">
                            <span className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0">{getStatusIcon(booking.status)}</span>
                            <span className="truncate">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                          </div>
                        </Badge>
                        <Badge className={`${getPaymentStatusColor(booking.payment_status)} text-xs`}>
                          <span className="truncate">{booking.payment_status}</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1 min-w-0">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{format(new Date(booking.scheduled_date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{booking.scheduled_time} ({booking.duration_minutes}min)</span>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{booking.academic_level}</span>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{booking.total_price.toLocaleString()} {booking.currency}</span>
                      </div>
                    </div>

                    {booking.client_notes && (
                      <div className="text-xs sm:text-sm mb-2">
                        <span className="font-medium text-gray-600">Client Notes: </span>
                        <span className="text-gray-700 line-clamp-2 leading-relaxed">{booking.client_notes}</span>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Booked {formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:gap-2 sm:ml-4 w-full sm:w-auto">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full sm:w-auto text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">Details</span>
                        </Button>
                      </DialogTrigger>
                      <BookingDetailsDialog booking={booking} />
                    </Dialog>

                    {booking.status === 'pending' && (
                      <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                        <Button
                          size="sm"
                          onClick={() => onUpdateBookingStatus(booking.id, 'confirmed')}
                          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                        >
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-0" />
                          <span className="sm:hidden">Confirm</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateBookingStatus(booking.id, 'cancelled')}
                          className="flex-1 sm:flex-none text-red-600 hover:text-red-700 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                        >
                          <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-0" />
                          <span className="sm:hidden">Cancel</span>
                        </Button>
                      </div>
                    )}

                    {booking.status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => onCompleteBooking ? onCompleteBooking(booking.id) : onUpdateBookingStatus(booking.id, 'completed')}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                      >
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-0" />
                        <span className="hidden sm:inline">Complete</span>
                        <span className="sm:hidden">Mark Complete</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingManagement;