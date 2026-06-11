import { useHomeData } from "@/hooks/useHomeData";
import { HeroSection } from "@/components/sections/HeroSection";
import { PoliticalLandscapeSection } from "@/components/sections/PoliticalLandscapeSection";
import { LiveCoverageSection } from "@/components/sections/LiveCoverageSection";
import { PoliticalPartiesSection } from "@/components/sections/PoliticalPartiesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { DataInsightsSection } from "@/components/sections/DataInsightsSection";
import { RSSSection } from "@/components/sections/RSSSection";
import { LogSabhaStorySection } from "@/components/sections/LogSabhaStorySection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SocialPresenceSection } from "@/components/sections/SocialPresenceSection";
import { HinduForJusticeSection } from "@/components/sections/HinduForJusticeSection";
import { FounderEditorialSection } from "@/components/sections/FounderEditorialSection";
import { EditorialInsightsSection } from "@/components/sections/EditorialInsightsSection";
import { MediaCoverageSection, MonumentBorder } from "@/components/sections/MediaCoverageSection";
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
      <CommunitySection />
      <MonumentBorder />
      <ServicesSection data={data.services} />
      <LiveCoverageSection />
      <RSSSection />
      <LogSabhaStorySection />
      <FounderEditorialSection />
      <HinduForJusticeSection />
      <EditorialInsightsSection />
      <SocialPresenceSection />
      <MediaCoverageSection />

      <DataInsightsSection />
      <ContactSection />
      <Footer />
    </>
  );
}
