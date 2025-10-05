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
    <div className="space-y-3 sm:space-y-4 md:space-y-6 p-2 sm:p-4 md:p-0">
      <div className="block md:hidden">
        <ServiceInstructions />
      </div>

      <div className="flex flex-col space-y-3 sm:space-y-4 md:flex-row md:justify-between md:items-start md:space-y-0">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Consultation Services</h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">Manage your service offerings, pricing, and bookings</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          
          <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 text-xs sm:text-sm">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2 py-1">
              <span className="hidden sm:inline">Active: </span>{activeServices.length}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-1">
              <span className="hidden sm:inline">Pending: </span>{pendingBookings.length}
            </Badge>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <ServiceInstructions />
      </div>

      {showAddService && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add a New Service</CardTitle>
          </CardHeader>
          <CardContent>
            <AddServiceForm
              onSubmit={async (data) => {
                // Convert ServiceFormData to CreateServiceData
                const createServiceData = {
                  category: data.category,
                  title: `${data.category} Service`, // Generate a default title
                  description: data.description,
                  duration_minutes: 60, // Default duration
                  pricing: data.academicLevelPrices.map(price => ({
                    academic_level: price.level === "Master's" ? "Masters" : price.level as any,
                    price: price.price,
                    currency: 'XAF'
                  })),
                  addons: data.addOns.map(addon => ({
                    name: addon.name,
                    description: '',
                    price: addon.price,
                    currency: 'XAF',
                    is_active: true
                  }))
                };
                await createService(createServiceData);
                setShowAddService(false);
              }}
              onCancel={() => setShowAddService(false)}
              loading={creating}
            />
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger 
            value="services" 
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5 px-1 sm:px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1">
              <span className="font-medium">Services</span>
              <span className="text-xs text-gray-500">({services.length})</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="bookings" 
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5 px-1 sm:px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1">
              <span className="font-medium">Bookings</span>
              <span className="text-xs text-gray-500">({bookings.length})</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5 px-1 sm:px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="font-medium">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-3 sm:space-y-4 md:space-y-6 mt-3 sm:mt-4 md:mt-6">
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

        <TabsContent value="bookings" className="space-y-3 sm:space-y-4 md:space-y-6 mt-3 sm:mt-4 md:mt-6">
          <BookingManagement
            bookings={bookings}
            services={services}
            onUpdateBookingStatus={updateBookingStatus}
            onCompleteBooking={handleCompleteBooking}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Services</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">{services.length}</p>
                  </div>
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-600 flex-shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Active Services</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">{activeServices.length}</p>
                  </div>
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-green-600 flex-shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Bookings</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">{bookings.length}</p>
                  </div>
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-purple-600 flex-shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Upcoming Sessions</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">{upcomingBookings.length}</p>
                  </div>
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-orange-600 flex-shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-semibold">Service Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="space-y-3 sm:space-y-4">
                {services.map((service) => {
                  const serviceBookings = bookings.filter(b => b.service_id === service.id);
                  const completedBookings = serviceBookings.filter(b => b.status === 'completed');
                  const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.total_price, 0);

                  return (
                    <div key={service.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0 mb-3 sm:mb-0 sm:mr-4">
                        <h4 className="font-medium text-sm sm:text-base text-gray-900 truncate">{service.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{service.category}</p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
                        <div className="text-center min-w-0">
                          <p className="font-semibold text-gray-900">{serviceBookings.length}</p>
                          <p className="text-gray-600 truncate">Total</p>
                        </div>
                        <div className="text-center min-w-0">
                          <p className="font-semibold text-gray-900">{completedBookings.length}</p>
                          <p className="text-gray-600 truncate">Completed</p>
                        </div>
                        <div className="text-center min-w-0">
                          <p className="font-semibold text-gray-900">{totalRevenue.toLocaleString()}</p>
                          <p className="text-gray-600 truncate">XAF</p>
                        </div>
                        <Badge 
                          variant={service.is_active ? "default" : "secondary"}
                          className={`text-xs ${service.is_active ? "bg-green-600 hover:bg-green-700" : ""} flex-shrink-0`}
                        >
                          {service.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                
                {services.length === 0 && (
                  <div className="text-center py-6 sm:py-8">
                    <div className="max-w-md mx-auto">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">No services created yet</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-4">Create your first service to start seeing analytics and performance data.</p>
                      <Button 
                        onClick={() => setShowAddService(true)} 
                        size="sm" 
                        className="text-xs sm:text-sm"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Add Your First Service
                      </Button>
                    </div>
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
