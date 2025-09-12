import { Button } from "@/components/ui/button";
import { ArrowRight, Cloud, Shield, Users } from "lucide-react";
import heroImage from "@/public/hero-cloud.jpg";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-animation absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="floating-delayed absolute top-40 right-20 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
        <div className="floating-animation absolute bottom-32 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="slide-up">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Your files,
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {" "}
                  everywhere
                </span>
              </h1>
            </div>

            <div className="fade-in-delayed">
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Store, sync, and share your files securely across all devices.
                Experience seamless collaboration with lightning-fast
                performance.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 fade-in-delayed">
              <Button variant="outline" size="lg" className="group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="default" size="lg">
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="fade-in-delayed">
              <div className="flex items-center space-x-8 pt-8">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Enterprise Security
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    10M+ Users
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Cloud className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    99.9% Uptime
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="slide-up">
              <Image
                src={heroImage}
                alt="Cloud Storage Dashboard"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Floating UI Elements */}
            <div className="absolute -top-4 -right-4 glass-effect p-4 rounded-xl floating-animation">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Syncing...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
