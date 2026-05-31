import { useHomeData } from "@/hooks/useHomeData";
import { HeroSection } from "@/components/sections/HeroSection";

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

      {/* Next sections will go here */}
      <section className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-400">Next sections will go here</p>
      </section>
    </>
  );
}
