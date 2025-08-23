import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const ThreeDPortfolio = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "3D Portfolio — Anvay",
    description: "Interactive 3D portfolio (coming soon).",
    url: "/3d-portfolio",
  };

  useScrollReveal();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-cyan-950/30 via-cyan-900/15 to-cyan-800/10 animate-gradient-wave">
        <section className="section-padding">
          <div className="container-prose text-center reveal">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-cyan-400">3D Portfolio</h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">An interactive 3D showcase is on the way. In the meantime, explore my projects.</p>
            <div className="mt-6">
              <a href="/projects" className="hover-scale"><Button variant="hero">Explore Projects</Button></a>
            </div>
          </div>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
};

export default ThreeDPortfolio;
