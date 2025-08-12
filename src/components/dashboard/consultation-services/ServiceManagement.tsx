import { useState } from "react";
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
import { ConsultationService, CreateServiceData } from "@/hooks/useConsultationServices";
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

  const resetForm = () => {
    setFormData({
      category: 'General Consultation',
      title: '',
      description: '',
      duration_minutes: 60,
      pricing: [{ academic_level: 'Undergraduate', price: 0, currency: 'XAF' }],
      addons: []
    });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Service Management</h3>
          <p className="text-sm text-gray-600">Create and manage your consultation services</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
              <DialogDescription>
                Set up a new consultation service with pricing and add-ons
              </DialogDescription>
            </DialogHeader>
            <ServiceForm 
              formData={formData} 
              onFormDataChange={handleFormDataChange}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateService} disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Service'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
              <p className="text-gray-600 mb-4">Create your first consultation service to get started</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Service
              </Button>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold">{service.title}</h4>
                      <Badge variant="outline">{service.category}</Badge>
                      <Badge 
                        variant={service.is_active ? "default" : "secondary"}
                        className={service.is_active ? "bg-green-600" : ""}
                      >
                        {service.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{service.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {service.duration_minutes} minutes
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {service.pricing.length} price levels
                      </div>
                      <div className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        {service.addons.length} add-ons
                      </div>
                    </div>

                    {/* Pricing Display */}
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {service.pricing.map((price, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {price.academic_level}: {price.price.toLocaleString()} {price.currency}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleStatus(service.id, !service.is_active)}
                    >
                      {service.is_active ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>

                    <Dialog open={editingService?.id === service.id} onOpenChange={(open) => !open && setEditingService(null)}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Service</DialogTitle>
                          <DialogDescription>
                            Update your service details, pricing, and add-ons
                          </DialogDescription>
                        </DialogHeader>
                        <ServiceForm 
                          formData={formData} 
                          onFormDataChange={handleFormDataChange}
                        />
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingService(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateService} disabled={updating}>
                            {updating ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Service</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{service.title}"? This action cannot be undone.
                            All associated bookings will also be affected.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteService(service.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Service
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default ServiceManagement;