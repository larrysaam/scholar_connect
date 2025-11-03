import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Clock, Plus, X, Calendar, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface DayAvailability {
  enabled: boolean;
  slots: string[];
}

interface WeeklyAvailability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];

const DEFAULT_AVAILABILITY: WeeklyAvailability = {
  monday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
  tuesday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
  wednesday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
  thursday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
  friday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
  saturday: { enabled: false, slots: [] },
  sunday: { enabled: false, slots: [] },
};

const AvailabilitySettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [availability, setAvailability] = useState<WeeklyAvailability>(DEFAULT_AVAILABILITY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchAvailability();
    }
  }, [user]);

  const fetchAvailability = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('researcher_profiles')
        .select('availability')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching availability:', error);
        return;
      }      if (data?.availability) {
        // Ensure the availability data has the correct structure with default values
        const fetchedAvailability = data.availability as WeeklyAvailability;
        const normalizedAvailability: WeeklyAvailability = {
          monday: { enabled: true, slots: [], ...fetchedAvailability.monday },
          tuesday: { enabled: true, slots: [], ...fetchedAvailability.tuesday },
          wednesday: { enabled: true, slots: [], ...fetchedAvailability.wednesday },
          thursday: { enabled: true, slots: [], ...fetchedAvailability.thursday },
          friday: { enabled: true, slots: [], ...fetchedAvailability.friday },
          saturday: { enabled: false, slots: [], ...fetchedAvailability.saturday },
          sunday: { enabled: false, slots: [], ...fetchedAvailability.sunday },
        };
        
        // Ensure each day has a slots array
        Object.keys(normalizedAvailability).forEach(day => {
          const dayKey = day as keyof WeeklyAvailability;
          if (!normalizedAvailability[dayKey].slots) {
            normalizedAvailability[dayKey].slots = [];
          }
        });
        
        setAvailability(normalizedAvailability);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: "Error",
        description: "Failed to load availability settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDayToggle = (day: keyof WeeklyAvailability) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        slots: !prev[day].enabled ? (prev[day].slots || []) : []
      }
    }));
  };
  const handleTimeSlotToggle = (day: keyof WeeklyAvailability, timeSlot: string) => {
    setAvailability(prev => {
      const daySlots = prev[day].slots || [];
      const isSelected = daySlots.includes(timeSlot);
      
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: isSelected 
            ? daySlots.filter(slot => slot !== timeSlot)
            : [...daySlots, timeSlot].sort()
        }
      };
    });
  };
  const addCustomTimeSlot = (day: keyof WeeklyAvailability) => {
    const daySlots = availability[day].slots || [];
    if (!selectedTimeSlot || daySlots.includes(selectedTimeSlot)) {
      return;
    }

    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...(prev[day].slots || []), selectedTimeSlot].sort()
      }
    }));
    setSelectedTimeSlot('');
  };

  const removeTimeSlot = (day: keyof WeeklyAvailability, timeSlot: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: (prev[day].slots || []).filter(slot => slot !== timeSlot)
      }
    }));
  };

  const saveAvailability = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('researcher_profiles')
        .update({ availability })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Availability settings saved successfully"
      });
    } catch (error) {
      console.error('Error saving availability:', error);
      toast({
        title: "Error",
        description: "Failed to save availability settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const setQuickAvailability = (type: 'weekdays' | 'weekend' | 'all') => {
    const weekdaySlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    const weekendSlots = ['10:00', '11:00', '14:00', '15:00'];

    setAvailability(prev => {
      const newAvailability = { ...prev };
      
      if (type === 'weekdays') {
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
          newAvailability[day as keyof WeeklyAvailability] = { enabled: true, slots: weekdaySlots };
        });
        ['saturday', 'sunday'].forEach(day => {
          newAvailability[day as keyof WeeklyAvailability] = { enabled: false, slots: [] };
        });
      } else if (type === 'weekend') {
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
          newAvailability[day as keyof WeeklyAvailability] = { enabled: false, slots: [] };
        });
        ['saturday', 'sunday'].forEach(day => {
          newAvailability[day as keyof WeeklyAvailability] = { enabled: true, slots: weekendSlots };
        });
      } else if (type === 'all') {
        DAYS_OF_WEEK.forEach(({ key }) => {
          newAvailability[key] = { enabled: true, slots: weekdaySlots };
        });
      }
      
      return newAvailability;
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">Loading availability settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Availability
          </CardTitle>
          <p className="text-sm text-gray-600">
            Set your available days and time slots for consultations
          </p>
        </CardHeader>
        <CardContent>
          {/* Quick Settings */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Label className="text-sm font-medium mb-2 block">Quick Settings</Label>
            <div className="flex gap-2 flex-wrap">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setQuickAvailability('weekdays')}
              >
                Weekdays Only
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setQuickAvailability('weekend')}
              >
                Weekends Only
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setQuickAvailability('all')}
              >
                All Days
              </Button>
            </div>
          </div>

          {/* Daily Availability */}
          <div className="space-y-4">
            {DAYS_OF_WEEK.map(({ key, label }) => (
              <div key={key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={availability[key].enabled}
                      onCheckedChange={() => handleDayToggle(key)}
                    />
                    <Label className="font-medium">{label}</Label>
                  </div>
                  <Badge variant={availability[key].enabled ? "default" : "secondary"}>
                    {availability[key].enabled ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>                {availability[key].enabled && (
                  <div className="space-y-3">
                    {/* Current Time Slots */}
                    {availability[key].slots && availability[key].slots.length > 0 && (
                      <div>
                        <Label className="text-sm text-gray-600 mb-2 block">Available Times</Label>
                        <div className="flex flex-wrap gap-2">
                          {availability[key].slots.map(slot => (
                            <Badge 
                              key={slot} 
                              variant="outline" 
                              className="flex items-center gap-1"
                            >
                              <Clock className="h-3 w-3" />
                              {slot}
                              <X 
                                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                                onClick={() => removeTimeSlot(key, slot)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add Time Slots */}
                    <div>
                      <Label className="text-sm text-gray-600 mb-2 block">Add Time Slots</Label>
                      <div className="flex flex-wrap gap-2">
                        {TIME_SLOTS.filter(slot => !(availability[key].slots || []).includes(slot)).map(slot => (
                          <Button
                            key={slot}
                            size="sm"
                            variant="ghost"
                            className="text-xs"
                            onClick={() => handleTimeSlotToggle(key, slot)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button 
              onClick={saveAvailability} 
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Availability'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilitySettings;
