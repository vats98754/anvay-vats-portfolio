import Navbar from "@/components/Navbar";
import AboutSection from "@/components/sections/AboutSection";

const About = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "About — Anvay",
    description: "Interests, beliefs, and what drives my work.",
    url: "/about",
  };

  return (
    <>
      <Navbar />
      <main>
        <header className="section-padding pt-10 md:pt-12 pb-2 md:pb-3" aria-label="About header">
          <div className="container-prose">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-red-500">About Me</h1>
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
