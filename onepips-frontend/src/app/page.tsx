import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { ProofSection } from "@/components/home/proof-section";
import { ProblemSolution } from "@/components/home/problem-solution";
import { OffersSection } from "@/components/home/offers-section";
import { CTASection } from "@/components/home/cta-section";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="pt-24 min-h-screen">
        <Hero />
        <ProofSection />
        <ProblemSolution />
        <OffersSection />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
