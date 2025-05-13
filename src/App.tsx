
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VenuePage from "./pages/VenuePage";
import BookingFlow from "./pages/BookingFlow";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import LoyaltyPage from "./pages/LoyaltyPage";
import { LoyaltyProvider } from "./context/LoyaltyContext";
import InVenueExperience from "./pages/InVenueExperience";
import TableOrderingPage from "./pages/TableOrderingPage";
import InVenueCouponPage from "./pages/InVenueCouponPage";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LoyaltyProvider>
        <Router>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/venues/:venueName" element={<VenuePage />} />
            <Route path="/book/:venueName" element={<BookingFlow />} />
            <Route path="/loyalty" element={<LoyaltyPage />} />
            <Route path="/loyalty/:venueName" element={<LoyaltyPage />} />
            <Route path="/venue-experience/:venueName" element={<InVenueExperience />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/order/:venueName" element={<TableOrderingPage />} />
            <Route path="/coupons/:venueName" element={<InVenueCouponPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </LoyaltyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
