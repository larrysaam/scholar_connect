import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppointmentBooking from "@/components/student/AppointmentBooking";
import StudentAppointments from "@/components/student/StudentAppointments";
import { Calendar, Search } from "lucide-react";

const StudentAppointmentsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Research Appointments</h1>
            <p className="text-gray-600">Book consultations with research experts or manage your existing appointments</p>
          </div>

          <Tabs defaultValue="book" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="book" className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Book Appointment</span>
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>My Appointments</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="book" className="space-y-6">
              <AppointmentBooking />
            </TabsContent>
            
            <TabsContent value="manage" className="space-y-6">
              <StudentAppointments />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentAppointmentsPage;