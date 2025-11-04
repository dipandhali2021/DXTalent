import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 p-4 z-50">
        <Link to="/auth">
          <Button variant="hero" className="gap-2">
            <User className="w-4 h-4" />
            Login / Sign Up
          </Button>
        </Link>
      </nav>
      
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
    </div>
  );
};

export default Index;
