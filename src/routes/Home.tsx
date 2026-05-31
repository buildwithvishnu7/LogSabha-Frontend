import { HeroSection } from "@/components/sections/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Spacer section to test scroll behavior */}
      <section className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-400">
          Next sections will go here
        </p>
      </section>
    </>
  );
}
