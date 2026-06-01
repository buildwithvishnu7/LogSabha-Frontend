import { useHomeData } from "@/hooks/useHomeData";
import { HeroSection } from "@/components/sections/HeroSection";
import { PoliticalLandscapeSection } from "@/components/sections/PoliticalLandscapeSection";
import { ServicesSection } from "@/components/sections/ServicesSection";

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
      <ServicesSection data={data.services} />
    </>
  );
}
