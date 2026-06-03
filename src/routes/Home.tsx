import { useHomeData } from "@/hooks/useHomeData";
import { HeroSection } from "@/components/sections/HeroSection";
import { PoliticalLandscapeSection } from "@/components/sections/PoliticalLandscapeSection";
import { PoliticalPartiesSection } from "@/components/sections/PoliticalPartiesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { DataInsightsSection } from "@/components/sections/DataInsightsSection";
import { RSSSection } from "@/components/sections/RSSSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  const { data, isLoading } = useHomeData();

  if (isLoading || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <HeroSection data={data.hero} />
      <PoliticalLandscapeSection data={data.politicalLandscape} />
      <PoliticalPartiesSection />
      <ServicesSection data={data.services} />
      <DataInsightsSection />
      <RSSSection />
      <CommunitySection />
      <ContactSection />
      <Footer />
    </>
  );
}
