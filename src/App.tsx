
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import StudentSignup from "./pages/StudentSignup";
import ResearcherSignup from "./pages/ResearcherSignup";
import ResearchAidSignup from "./pages/ResearchAidSignup";
import ConsolidatedSignup from "./pages/ConsolidatedSignup";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import ResearchAideDashboard from "./pages/ResearchAideDashboard";
import ResearchAidsDashboard from "./pages/ResearchAidsDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Researchers from "./pages/Researchers";
import ResearcherProfile from "./pages/ResearcherProfile";
import ResearchAides from "./pages/ResearchAides";
import ResearchAids from "./pages/ResearchAids";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import Partnerships from "./pages/Partnerships";
import HowItWorks from "./pages/HowItWorks";
import Blogs from "./pages/Blogs";
import JobBoard from "./pages/JobBoard";
import CoAuthorWorkspace from "./pages/CoAuthorWorkspace";
import WorkspaceDetails from "./pages/WorkspaceDetails";
import StudentPayments from "./pages/StudentPayments";
import ProviderEarnings from "./pages/ProviderEarnings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <div className="App">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/student-signup" element={<StudentSignup />} />
                  <Route path="/researcher-signup" element={<ResearcherSignup />} />
                  <Route path="/research-aid-signup" element={<ResearchAidSignup />} />
                  <Route path="/signup" element={<ConsolidatedSignup />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/student-dashboard" element={
                    <ProtectedRoute>
                      <StudentDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/researcher-dashboard" element={
                    <ProtectedRoute>
                      <ResearcherDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/research-aide-dashboard" element={
                    <ProtectedRoute>
                      <ResearchAideDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/research-aids-dashboard" element={
                    <ProtectedRoute>
                      <ResearchAidsDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin-dashboard" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/researchers" element={<Researchers />} />
                  <Route path="/researcher/:id" element={<ResearcherProfile />} />
                  <Route path="/research-aids" element={<ResearchAides />} />
                  <Route path="/research-aids-new" element={<ResearchAids />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/partnerships" element={<Partnerships />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/job-board" element={<JobBoard />} />
                  <Route path="/co-author-workspace" element={
                    <ProtectedRoute>
                      <CoAuthorWorkspace />
                    </ProtectedRoute>
                  } />
                  <Route path="/workspace/:id" element={
                    <ProtectedRoute>
                      <WorkspaceDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/student-payments" element={
                    <ProtectedRoute>
                      <StudentPayments />
                    </ProtectedRoute>
                  } />
                  <Route path="/provider-earnings" element={
                    <ProtectedRoute>
                      <ProviderEarnings />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </div>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
