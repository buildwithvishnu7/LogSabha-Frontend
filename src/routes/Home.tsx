import { useHomeData } from "@/hooks/useHomeData";
import { HeroSection } from "@/components/sections/HeroSection";
import { PoliticalLandscapeSection } from "@/components/sections/PoliticalLandscapeSection";
import { ScrollReveal, ScrollRevealText, ScrollRevealLine } from "@/components/motion/ScrollReveal";

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

      {/* Placeholder — demonstrates scroll animations for future sections */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <ScrollRevealLine delay={0} className="mb-6 h-[2px] w-16 bg-amber-500" />
        <ScrollRevealText
          text="More Sections"
          highlight="Coming Soon"
          className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl"
          highlightClassName="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent"
          delay={0.1}
        />
        <ScrollReveal delay={0.4}>
          <p className="mt-4 max-w-md text-center text-gray-500">
            Each section will animate in as you scroll — text reveals word by
            word, elements slide up with blur-to-sharp transitions.
          </p>
        </ScrollReveal>
      </section>
    </>
  );
}
