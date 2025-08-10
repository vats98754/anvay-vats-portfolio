import Navbar from "@/components/Navbar";
import AchievementsSection from "@/components/sections/AchievementsSection";

const Achievements = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Achievements — Anvay",
    description: "Notable international/national accomplishments and recognitions.",
    url: "/achievements",
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-amber-950/40 via-amber-900/25 to-amber-800/15 animate-gradient-wave">
        <header className="section-padding pt-10 md:pt-12 pb-2 md:pb-3" aria-label="Achievements header">
          <div className="container-prose">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-cyan-400">Achievements</h1>
            <p className="mt-2 text-muted-foreground">Notable international/national accomplishments and recognitions.</p>
          </div>
        </header>
        <AchievementsSection />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
};

export default Achievements;
