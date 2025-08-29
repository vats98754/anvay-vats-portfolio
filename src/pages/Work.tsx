import Navbar from "@/components/Navbar";
import WorkSection from "@/components/sections/WorkSection";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const Work = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Work — Anvay",
    description: "Professional experience and impact.",
    url: "/work",
  };

  useScrollReveal();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-emerald-900/50 via-cyan-900/35 to-emerald-800/25 animate-gradient-wave">
        <header className="section-padding pt-10 md:pt-12 pb-2 md:pb-3" aria-label="Work header">
          <div className="container-prose reveal">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]">Work</h1>
            <p className="mt-2 text-muted-foreground/90">A track record of shipping, learning, and measurable impact.</p>
          </div>
        </header>
        <WorkSection />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
};

export default Work;
