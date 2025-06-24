
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ConsolidatedSignup from "./pages/ConsolidatedSignup";
import StudentDashboard from "./pages/StudentDashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import ResearchAidsDashboard from "./pages/ResearchAidsDashboard";
import ResearchAideDashboard from "./pages/ResearchAideDashboard";
import Researchers from "./pages/Researchers";
import ResearchAids from "./pages/ResearchAids";
import JobBoard from "./pages/JobBoard";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<ConsolidatedSignup />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/researcher-dashboard" element={<ResearcherDashboard />} />
              <Route path="/research-aids-dashboard" element={<ResearchAidsDashboard />} />
              <Route path="/research-aide-dashboard" element={<ResearchAideDashboard />} />
              <Route path="/researchers" element={<Researchers />} />
              <Route path="/research-aids" element={<ResearchAids />} />
              <Route path="/job-board" element={<JobBoard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
