import Navbar from "@/components/Navbar";
import WorkSection from "@/components/sections/WorkSection";

const Work = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Work — Anvay",
    description: "Professional experience and impact.",
    url: "/work",
  };

  return (
    <>
      <Navbar />
      <main>
        <header className="section-padding pt-10 md:pt-12 pb-2 md:pb-3" aria-label="Work header">
          <div className="container-prose">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-cyan-400">Work</h1>
            <p className="mt-2 text-muted-foreground">A track record of shipping, learning, and measurable impact.</p>
          </div>
        </header>
        <WorkSection />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
};

export default Work;
