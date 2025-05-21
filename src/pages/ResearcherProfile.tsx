
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data for a researcher
const researcherData = {
  id: "1",
  name: "Dr. Sarah Johnson",
  title: "Associate Professor",
  institution: "Stanford University",
  department: "Computer Science Department",
  field: "Computer Science",
  specialties: ["Machine Learning", "AI Ethics", "Data Mining", "Neural Networks", "Computer Vision"],
  bio: "Dr. Sarah Johnson is an Associate Professor at Stanford University with over 10 years of experience in machine learning research. She leads the AI Ethics Lab, focusing on responsible AI development and algorithmic fairness. Dr. Johnson has published over 50 papers in top journals and conferences, and has worked with leading tech companies on implementing ethical AI frameworks.",
  education: [
    { degree: "Ph.D. Computer Science", institution: "MIT", year: "2010" },
    { degree: "M.S. Computer Science", institution: "Stanford University", year: "2006" },
    { degree: "B.S. Mathematics", institution: "UC Berkeley", year: "2004" }
  ],
  publications: [
    { title: "Ethical Considerations in Deep Learning Models", journal: "Nature Machine Intelligence", year: "2022" },
    { title: "Advances in Fairness-aware Machine Learning", journal: "Journal of Artificial Intelligence Research", year: "2021" },
    { title: "Interpretable AI for Healthcare Applications", journal: "IEEE Transactions on Medical Imaging", year: "2020" }
  ],
  hourlyRate: 120,
  rating: 4.9,
  reviews: [
    { name: "Alex Smith", rating: 5, comment: "Dr. Johnson provided incredibly valuable insights for my research project. Her expertise in AI ethics helped me navigate complex issues I hadn't considered." },
    { name: "Jamie Lee", rating: 5, comment: "Exceptional consultation! Dr. Johnson explained complex concepts clearly and provided practical guidance for implementing machine learning techniques in my project." },
    { name: "Taylor Wong", rating: 4, comment: "Very knowledgeable and patient. Helped me understand the limitations of my research approach and suggested alternative methodologies." },
  ],
  availableTimes: [
    { date: new Date(2025, 5, 22), slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
    { date: new Date(2025, 5, 24), slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
    { date: new Date(2025, 5, 25), slots: ["10:00 AM", "4:00 PM"] },
    { date: new Date(2025, 5, 28), slots: ["1:00 PM", "3:00 PM", "5:00 PM"] }
  ],
  imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80"
};

const ResearcherProfile = () => {
  const { id } = useParams<{ id: string }>();
  const researcher = researcherData; // In a real app, this would be fetched based on the ID
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const availableDates = researcher.availableTimes.map(item => item.date);
  
  // Function to check if a date has available slots
  const hasSlots = (date: Date) => {
    return researcher.availableTimes.some(
      item => item.date.toDateString() === date.toDateString()
    );
  };
  
  // Get available time slots for the selected date
  const getAvailableSlots = () => {
    if (!selectedDate) return [];
    
    const dateInfo = researcher.availableTimes.find(
      item => item.date.toDateString() === selectedDate.toDateString()
    );
    
    return dateInfo ? dateInfo.slots : [];
  };
  
  // Handle booking
  const handleBooking = () => {
    // In a real app, this would handle the booking process
    console.log("Booking with", researcher.name);
    console.log("Date:", selectedDate);
    console.log("Time:", selectedTime);
    setIsBookingModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-blue-600 text-white py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <img 
                    src={researcher.imageUrl} 
                    alt={researcher.name} 
                    className="w-full aspect-square object-cover rounded-lg mb-4"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-3/4">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-blue-500">{researcher.field}</Badge>
                  {researcher.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-700 border-blue-400">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold">{researcher.name}</h1>
                <p className="text-blue-100 text-lg mb-2">{researcher.title} at {researcher.institution}</p>
                <p className="text-blue-100">{researcher.department}</p>
                
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center bg-blue-700 px-4 py-2 rounded-lg">
                    <div className="mr-3">
                      <div className="text-xl font-bold">${researcher.hourlyRate}</div>
                      <div className="text-xs text-blue-200">per hour</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-blue-700 px-4 py-2 rounded-lg">
                    <div className="flex items-center">
                      {Array(5).fill(0).map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(researcher.rating) ? 'text-yellow-400' : 'text-blue-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm">{researcher.rating} ({researcher.reviews.length} reviews)</span>
                  </div>
                  
                  <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-white text-blue-700 hover:bg-blue-50">
                        Book Consultation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Book a Consultation</DialogTitle>
                        <DialogDescription>
                          Select a date and time to schedule your consultation with {researcher.name}.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-6 py-4">
                        <div>
                          <h3 className="mb-2 font-medium">Select a Date:</h3>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border"
                            disabled={date => 
                              !hasSlots(date) || 
                              date < new Date() || 
                              date > new Date(2025, 6, 31)
                            }
                          />
                        </div>
                        
                        {selectedDate && (
                          <div>
                            <h3 className="mb-2 font-medium">Select a Time:</h3>
                            <div className="grid grid-cols-3 gap-2">
                              {getAvailableSlots().map((time) => (
                                <Button
                                  key={time}
                                  variant={selectedTime === time ? "default" : "outline"}
                                  onClick={() => setSelectedTime(time)}
                                  className="text-sm"
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-4 border-t">
                          <div className="flex justify-between items-center mb-4">
                            <span>Consultation Fee:</span>
                            <span className="font-semibold">${researcher.hourlyRate}</span>
                          </div>
                          
                          <Button 
                            className="w-full" 
                            disabled={!selectedDate || !selectedTime}
                            onClick={handleBooking}
                          >
                            Complete Booking
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-12">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="mb-8 bg-gray-100">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="experience">Experience & Education</TabsTrigger>
              <TabsTrigger value="publications">Publications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-0">
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Biography</h2>
                <p className="text-gray-700 mb-6">{researcher.bio}</p>
                
                <h3 className="text-lg font-semibold mb-3">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {researcher.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="experience" className="mt-0">
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Education</h2>
                <div className="space-y-4">
                  {researcher.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-blue-600 pl-4 py-1">
                      <h3 className="font-medium">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}, {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="publications" className="mt-0">
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Selected Publications</h2>
                <div className="space-y-6">
                  {researcher.publications.map((pub, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-medium text-blue-700 hover:underline cursor-pointer">{pub.title}</h3>
                      <p className="text-gray-600 text-sm">{pub.journal}, {pub.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-0">
              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Reviews</h2>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {Array(5).fill(0).map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(researcher.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-lg font-medium">{researcher.rating}</span>
                    <span className="ml-1 text-gray-500">({researcher.reviews.length} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {researcher.reviews.map((review, index) => (
                    <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{review.name}</h3>
                        <div className="flex items-center">
                          {Array(5).fill(0).map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearcherProfile;
