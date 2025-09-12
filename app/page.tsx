import Features from "@/components/pages/landing/features";
import Hero from "@/components/pages/landing/hero";
import { LandingNavbar } from "@/components/pages/landing/nav";

export default function Home() {
  return (
    <div>
      <LandingNavbar />
      <Hero />
      <Features />
    </div>
  );
}
