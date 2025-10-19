import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  DollarSign, 
  Clock, 
  BookOpen,
  Loader2
} from "lucide-react";
import { CreateServiceData } from "@/hooks/useConsultationServices";
import { ConsultationService } from "@/types/consultations";
import ServiceForm from "./ServiceForm";

interface ServiceManagementProps {
  services: ConsultationService[];
  creating: boolean;
  updating: boolean;
  onCreateService: (data: CreateServiceData) => Promise<boolean>;
  onUpdateService: (serviceId: string, data: Partial<CreateServiceData>) => Promise<boolean>;
  onToggleStatus: (serviceId: string, isActive: boolean) => Promise<boolean>;
  onDeleteService: (serviceId: string) => Promise<boolean>;
}

const ServiceManagement = ({
  services,
  creating,
  updating,
  onCreateService,
  onUpdateService,
  onToggleStatus,
  onDeleteService
}: ServiceManagementProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingService, setEditingService] = useState<ConsultationService | null>(null);
  const [formData, setFormData] = useState<CreateServiceData>({
    category: 'General Consultation',
    title: '',
    description: '',
    duration_minutes: 60,
    pricing: [{ academic_level: 'Undergraduate', price: 0, currency: 'XAF' }],
    addons: []
  });
  const [currentPage, setCurrentPage] = useState(1);

  const servicesPerPage = 5;

  // Helper function to format duration in a user-friendly way
  const formatDuration = (minutes: number) => {
    if (minutes >= 525600) { // 365 days or more
      const years = Math.round(minutes / 525600);
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (minutes >= 43200) { // 30 days or more
      const months = Math.round(minutes / 43200);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else if (minutes >= 1440) { // 1 day or more
      const days = Math.round(minutes / 1440);
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (minutes >= 60) { // 1 hour or more
      const hours = Math.round(minutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'General Consultation',
      title: '',
      description: '',
      duration_minutes: 60, // 1 hour default for General Consultation
      pricing: [{ academic_level: 'Undergraduate', price: 0, currency: 'XAF' }],
      addons: []
    });
  };

  const createFreeConsultationService = () => {
    setFormData({
      category: 'Free Consultation',
      title: 'Free Consultation Session',
      description: 'Complimentary consultation session to discuss your research needs and provide initial guidance.',
      duration_minutes: 60,
      pricing: [
        { academic_level: 'Undergraduate', price: 0, currency: 'XAF' },
        { academic_level: 'Masters', price: 0, currency: 'XAF' },
        { academic_level: 'PhD', price: 0, currency: 'XAF' },
        { academic_level: 'Postdoc', price: 0, currency: 'XAF' }
      ],
      addons: []
    });
    setShowCreateDialog(true);
  };

  const handleCreateService = async () => {
    const success = await onCreateService(formData);
    if (success) {
      setShowCreateDialog(false);
      resetForm();
    }
  };

  const handleEditService = (service: ConsultationService) => {
    setEditingService(service);
    setFormData({
      category: service.category,
      title: service.title,
      description: service.description,
      duration_minutes: service.duration_minutes,
      pricing: service.pricing.map(p => ({
        academic_level: p.academic_level,
        price: p.price,
        currency: p.currency
      })),
      addons: service.addons.map(a => ({
        name: a.name,
        description: a.description,
        price: a.price,
        currency: a.currency,
        is_active: a.is_active
      }))
    });
  };

  const handleUpdateService = async () => {
    if (!editingService) return;
    
    const success = await onUpdateService(editingService.id, formData);
    if (success) {
      setEditingService(null);
      resetForm();
    }
  };

  const handleFormDataChange = (newFormData: CreateServiceData) => {
    setFormData(newFormData);
  };

  // Pagination calculations
  const totalPages = Math.ceil(services.length / servicesPerPage);
  const startIndex = (currentPage - 1) * servicesPerPage;
  const endIndex = startIndex + servicesPerPage;
  const currentPageServices = services.slice(startIndex, endIndex);

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Service Management</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Create and manage your consultation services</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={createFreeConsultationService} 
            variant="outline" 
            className="w-full sm:w-auto text-sm py-2 px-3 sm:px-4 border-green-200 text-green-700 hover:bg-green-50"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Free Service
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="w-full sm:w-auto text-sm py-2 px-3 sm:px-4">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Paid Service
              </Button>
            </DialogTrigger><DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto mx-2 sm:mx-0">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-base sm:text-lg">Create New Service</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Set up a new consultation service with pricing and add-ons
              </DialogDescription>
            </DialogHeader>
            <ServiceForm 
              formData={formData} 
              onFormDataChange={handleFormDataChange}
            />            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateDialog(false)}
                className="w-full sm:w-auto text-sm order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateService} 
                disabled={creating}
                className="w-full sm:w-auto text-sm order-1 sm:order-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Service'
                )}
              </Button>
            </DialogFooter>          </DialogContent>
        </Dialog>
        </div>
      </div>
      
      {/* Services List */}
      <div className="space-y-3 sm:space-y-4">
        {currentPageServices.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 sm:py-12 px-4">
              <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No services yet</h3>              <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-md mx-auto">Create your first consultation service to get started</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button 
                  onClick={createFreeConsultationService}
                  variant="outline"
                  className="w-full sm:w-auto text-sm border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Create Free Service
                </Button>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="w-full sm:w-auto text-sm"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Create Paid Service
                </Button>
              </div>
            </CardContent>
          </Card>        ) : (
          currentPageServices.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:gap-3 mb-3">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{service.title}</h4>                      <div className="flex flex-wrap items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            service.category === 'Free Consultation' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : ''
                          }`}
                        >
                          {service.category}
                        </Badge>
                        <Badge 
                          variant={service.is_active ? "default" : "secondary"}
                          className={`text-xs ${service.is_active ? "bg-green-600" : ""}`}
                        >
                          {service.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm sm:text-base text-gray-700 mb-4 line-clamp-2 leading-relaxed">{service.description}</p>                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:gap-6 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{formatDuration(service.duration_minutes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{service.pricing.length} price levels</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{service.addons.length} add-ons</span>
                      </div>
                    </div>                    {/* Pricing Display */}
                    <div className="mt-3 sm:mt-4">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {service.category === 'Free Consultation' ? (
                          <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                            All Levels: FREE (0.00 XAF)
                          </Badge>
                        ) : (
                          <>
                            {service.pricing.slice(0, 3).map((price, index) => (
                              <Badge key={index} variant="outline" className="text-xs truncate max-w-full">
                                {price.academic_level}: {price.price.toLocaleString()} {price.currency}
                              </Badge>
                            ))}
                            {service.pricing.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{service.pricing.length - 3} more
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Add-ons Display */}
                    {service.addons.length > 0 && (
                      <div className="mt-3 sm:mt-4">
                        <h5 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Available Add-ons:</h5>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {service.addons.slice(0, 2).map((addon, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {addon.name}: {addon.price.toLocaleString()} {addon.currency}
                            </Badge>
                          ))}
                          {service.addons.length > 2 && (
                            <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                              +{service.addons.length - 2} more add-ons
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}</div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:gap-2 sm:ml-4 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleStatus(service.id, !service.is_active)}
                      className="w-full sm:w-auto text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                    >
                      {service.is_active ? (
                        <>
                          <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Deactivate</span>
                          <span className="sm:hidden">Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Activate</span>
                          <span className="sm:hidden">Show</span>
                        </>
                      )}
                    </Button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Dialog open={editingService?.id === service.id} onOpenChange={(open) => !open && setEditingService(null)}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditService(service)}
                            className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-0" />
                            <span className="sm:hidden">Edit</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto mx-2 sm:mx-0">
                          <DialogHeader className="pb-4">
                            <DialogTitle className="text-base sm:text-lg">Edit Service</DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm">
                              Update your service details, pricing, and add-ons
                            </DialogDescription>
                          </DialogHeader>                          <ServiceForm 
                            formData={formData} 
                            onFormDataChange={handleFormDataChange}
                          />
                          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingService(null)}
                              className="w-full sm:w-auto text-sm order-2 sm:order-1"
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleUpdateService} 
                              disabled={updating}
                              className="w-full sm:w-auto text-sm order-1 sm:order-2"
                            >
                              {updating ? (
                                <>
                                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                'Update Service'
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 sm:flex-none text-red-600 hover:text-red-700 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-0" />
                            <span className="sm:hidden">Delete</span>
                          </Button>
                        </AlertDialogTrigger>                        <AlertDialogContent className="w-[95vw] max-w-lg mx-2 sm:mx-0">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-base sm:text-lg">Delete Service</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">
                              Are you sure you want to delete "<span className="font-medium">{service.title}</span>"? This action cannot be undone.
                              All associated bookings will also be affected.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                            <AlertDialogCancel className="w-full sm:w-auto text-sm order-2 sm:order-1">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteService(service.id)}
                              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-sm order-1 sm:order-2"
                            >
                              Delete Service
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, services.length)} of {services.length} services
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;