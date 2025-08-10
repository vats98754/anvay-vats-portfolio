import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Work from "./pages/Work";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Achievements from "./pages/Achievements";
import ThreeDPortfolio from "./pages/ThreeDPortfolio";
import NotFound from "./pages/NotFound";
import CursorFX from "@/components/CursorFX";
import Footer from "@/components/Footer";
import Dynamis from "./pages/Dynamis";
import MultithreadingBot from "./pages/MultithreadingBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/work" element={<Work />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/dynamis" element={<Dynamis />} />
          <Route path="/projects/multithreading-bot" element={<MultithreadingBot />} />
          <Route path="/about" element={<About />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/3d-portfolio" element={<ThreeDPortfolio />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <CursorFX />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
