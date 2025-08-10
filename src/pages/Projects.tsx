import Navbar from "@/components/Navbar";
import ProjectsSection from "@/components/sections/ProjectsSection";

const Projects = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects — Anvay",
    description: "Selected builds with real metrics and outcomes.",
    url: "/projects",
  };

  return (
    <>
      <Navbar />
      <main>
        <header className="section-padding pt-10 md:pt-12 pb-2 md:pb-3" aria-label="Projects header">
          <div className="container-prose">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-cyan-400">Profitable Projects</h1>
            <p className="mt-2 text-muted-foreground">Selected builds with real metrics and outcomes.</p>
          </div>
        </header>
        <ProjectsSection />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
};

export default Projects;
