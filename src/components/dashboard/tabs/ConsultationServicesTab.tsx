import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  DollarSign, 
  Users, 
  Settings,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Clock,
  Loader2
} from "lucide-react";
import { useConsultationServices } from "@/hooks/useConsultationServices";
import { useToast } from "@/components/ui/use-toast";
import ServiceInstructions from "../consultation-services/ServiceInstructions";
import ServiceCard from "../consultation-services/ServiceCard";
import AddServiceForm from "../consultation-services/AddServiceForm";
import ServiceManagement from "../consultation-services/ServiceManagement";
import BookingManagement from "../consultation-services/BookingManagement";

const ConsultationServicesTab = () => {
  const {
    services,
    bookings,
    loading,
    creating,
    updating,
    createService,
    updateService,
    toggleServiceStatus,
    deleteService,
    updateBookingStatus
  } = useConsultationServices();

  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("services");
  const [showAddService, setShowAddService] = useState(false);

  const activeServices = services.filter(service => service.is_active);
  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.scheduled_date) >= new Date()
  );

  // Handler to mark a booking as completed
  const handleCompleteBooking = async (bookingId: string) => {
    const success = await updateBookingStatus(bookingId, 'completed');
    if (success) {
      toast({
        title: 'Booking Completed',
        description: 'The booking has been marked as completed.',
        variant: 'success',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to complete the booking.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading consultation services...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ServiceInstructions />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Consultation Services</h2>
          <p className="text-gray-600">Manage your service offerings, pricing, and bookings</p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => setShowAddService(true)} variant="default" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Service
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge variant="outline" className="bg-green-50">
              {activeServices.length} Active Services
            </Badge>
            <Badge variant="outline" className="bg-blue-50">
              {pendingBookings.length} Pending Bookings
            </Badge>
          </div>
        </div>
      </div>

      {showAddService && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add a New Service</CardTitle>
          </CardHeader>
          <CardContent>
            <AddServiceForm
              onSubmit={async (data) => {
                await createService(data);
                setShowAddService(false);
              }}
              onCancel={() => setShowAddService(false)}
              loading={creating}
            />
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Services ({services.length})
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Bookings ({bookings.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <ServiceManagement
            services={services}
            creating={creating}
            updating={updating}
            onCreateService={createService}
            onUpdateService={updateService}
            onToggleStatus={toggleServiceStatus}
            onDeleteService={deleteService}
          />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <BookingManagement
            bookings={bookings}
            services={services}
            onUpdateBookingStatus={updateBookingStatus}
            onCompleteBooking={handleCompleteBooking}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Services</p>
                    <p className="text-2xl font-bold">{services.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Services</p>
                    <p className="text-2xl font-bold">{activeServices.length}</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
                    <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => {
                  const serviceBookings = bookings.filter(b => b.service_id === service.id);
                  const completedBookings = serviceBookings.filter(b => b.status === 'completed');
                  const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.total_price, 0);

                  return (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{service.title}</h4>
                        <p className="text-sm text-gray-600">{service.category}</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{serviceBookings.length}</p>
                          <p className="text-gray-600">Total Bookings</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{completedBookings.length}</p>
                          <p className="text-gray-600">Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{totalRevenue.toLocaleString()} XAF</p>
                          <p className="text-gray-600">Revenue</p>
                        </div>
                        <Badge 
                          variant={service.is_active ? "default" : "secondary"}
                          className={service.is_active ? "bg-green-600" : ""}
                        >
                          {service.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                
                {services.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No services created yet. Create your first service to see analytics.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsultationServicesTab;
