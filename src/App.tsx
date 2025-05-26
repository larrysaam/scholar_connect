
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/AboutUs";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import Researchers from "./pages/Researchers";
import ResearcherProfile from "./pages/ResearcherProfile";
import Dashboard from "./pages/Dashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import ResearchAidsDashboard from "./pages/ResearchAidsDashboard";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import ResearchAideSignup from "./pages/ResearchAideSignup";
import ResearchAidSignup from "./pages/ResearchAidSignup";
import ResearchAides from "./pages/ResearchAides";
import ResearchAids from "./pages/ResearchAids";
import Blogs from "./pages/Blogs";
import Partnerships from "./pages/Partnerships";
import CoAuthorWorkspace from "./pages/CoAuthorWorkspace";
import WorkspaceDetails from "./pages/WorkspaceDetails";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import StudentPayments from "./pages/StudentPayments";
import ProviderEarnings from "./pages/ProviderEarnings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/researchers" element={<Researchers />} />
                <Route path="/researcher/:id" element={<ResearcherProfile />} />
                <Route path="/research-aides" element={<ResearchAides />} />
                <Route path="/research-aids" element={<ResearchAids />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/partnerships" element={<Partnerships />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Register />} />
                <Route path="/research-aide-signup" element={<ResearchAideSignup />} />
                <Route path="/research-aid-signup" element={<ResearchAidSignup />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute requiredRole="student">
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/researcher-dashboard" element={
                  <ProtectedRoute requiredRole="expert">
                    <ResearcherDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/research-aids-dashboard" element={
                  <ProtectedRoute requiredRole="aid">
                    <ResearchAidsDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/co-author-workspace" element={
                  <ProtectedRoute>
                    <CoAuthorWorkspace />
                  </ProtectedRoute>
                } />
                <Route path="/workspace/:projectId" element={
                  <ProtectedRoute>
                    <WorkspaceDetails />
                  </ProtectedRoute>
                } />
                <Route path="/admin-dashboard" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
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
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
