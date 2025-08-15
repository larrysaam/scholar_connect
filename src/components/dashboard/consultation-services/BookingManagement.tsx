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
import { ServiceBooking, ConsultationService } from "@/hooks/useConsultationServices";
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
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogDescription>
          View and manage booking information
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-gray-600">Service</h4>
            <p className="font-medium">{getServiceTitle(booking.service_id)}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-600">Academic Level</h4>
            <p>{booking.academic_level}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-600">Date & Time</h4>
            <p>{format(new Date(booking.scheduled_date), 'PPP')} at {booking.scheduled_time}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-600">Duration</h4>
            <p>{booking.duration_minutes} minutes</p>
          </div>
        </div>

        {/* Status & Payment */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-gray-600">Status</h4>
            <Badge className={getStatusColor(booking.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(booking.status)}
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </div>
            </Badge>
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-600">Payment Status</h4>
            <Badge className={getPaymentStatusColor(booking.payment_status)}>
              {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-sm text-gray-600">Base Price</h4>
            <p className="font-medium">{booking.base_price.toLocaleString()} {booking.currency}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-600">Add-ons</h4>
            <p className="font-medium">{booking.addon_price.toLocaleString()} {booking.currency}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-600">Total</h4>
            <p className="font-medium text-lg">{booking.total_price.toLocaleString()} {booking.currency}</p>
          </div>
        </div>

        {/* Meeting Link */}
        {booking.meeting_link && (
          <div>
            <h4 className="font-medium text-sm text-gray-600">Meeting Link</h4>
            <div className="flex items-center gap-2">
              <Input value={booking.meeting_link} readOnly />
              <Button
                size="sm"
                onClick={() => window.open(booking.meeting_link, '_blank')}
              >
                <Video className="h-4 w-4 mr-1" />
                Join
              </Button>
            </div>
          </div>
        )}

        {/* Notes */}
        {booking.client_notes && (
          <div>
            <h4 className="font-medium text-sm text-gray-600">Client Notes</h4>
            <p className="text-sm bg-gray-50 p-3 rounded-lg">{booking.client_notes}</p>
          </div>
        )}

        {booking.provider_notes && (
          <div>
            <h4 className="font-medium text-sm text-gray-600">Your Notes</h4>
            <p className="text-sm bg-gray-50 p-3 rounded-lg">{booking.provider_notes}</p>
          </div>
        )}

        {/* Status Actions */}
        <div className="flex gap-2 pt-4 border-t">
          {booking.status === 'pending' && (
            <>
              <Button
                onClick={() => onUpdateBookingStatus(booking.id, 'confirmed')}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Booking
              </Button>
              <Button
                onClick={() => onUpdateBookingStatus(booking.id, 'cancelled')}
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
          
          {booking.status === 'confirmed' && (
            <>
              <Button
                onClick={() => onCompleteBooking ? onCompleteBooking(booking.id) : onUpdateBookingStatus(booking.id, 'completed')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
              <Button
                onClick={() => onUpdateBookingStatus(booking.id, 'no_show')}
                variant="outline"
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
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingBookings.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{confirmedBookings.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedBookings.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-purple-600">{upcomingBookings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search bookings by notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
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
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">
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
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{getServiceTitle(booking.service_id)}</h4>
                      <Badge className={getStatusColor(booking.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                      </Badge>
                      <Badge className={getPaymentStatusColor(booking.payment_status)}>
                        {booking.payment_status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(booking.scheduled_date), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {booking.scheduled_time} ({booking.duration_minutes}min)
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {booking.academic_level}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {booking.total_price.toLocaleString()} {booking.currency}
                      </div>
                    </div>

                    {booking.client_notes && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-600">Client Notes: </span>
                        <span className="text-gray-700">{booking.client_notes}</span>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-2">
                      Booked {formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <BookingDetailsDialog booking={booking} />
                    </Dialog>

                    {booking.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => onUpdateBookingStatus(booking.id, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateBookingStatus(booking.id, 'cancelled')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {booking.status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => onCompleteBooking ? onCompleteBooking(booking.id) : onUpdateBookingStatus(booking.id, 'completed')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Complete
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