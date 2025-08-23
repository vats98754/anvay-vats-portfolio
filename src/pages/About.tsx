import Navbar from "@/components/Navbar";
import AboutSection from "@/components/sections/AboutSection";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const About = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "About — Anvay",
    description: "Interests, beliefs, and what drives my work.",
    url: "/about",
  };

  useScrollReveal();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-sky-950/40 via-sky-900/25 to-sky-800/15 animate-gradient-wave">
        <header className="section-padding pt-10 md:pt-12 pb-2 md:pb-3" aria-label="About header">
          <div className="container-prose reveal">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-cyan-400">About Me</h1>
            <p className="mt-2 text-muted-foreground">Interests, beliefs, and what drives my work.</p>
          </div>
        </header>
        <AboutSection />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
};

export default About;
