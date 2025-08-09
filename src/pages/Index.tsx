import Navbar from "@/components/Navbar";
import LogosMarquee from "@/components/LogosMarquee";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, User, FileText, Rocket } from "lucide-react";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Anvay",
    url: "/",
    description: "AI startup-style portfolio showcasing work, projects, and resume.",
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] flex flex-col">
        <header className="section-padding py-16 md:py-20" aria-label="Intro">
          <div className="container-prose text-center animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-wider text-red-500">
              Anvay's Portfolio
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">
              I build reliable, human-centered AI products with measurable impact. Here are my most relevant roles,
              projects, and a resume tailored for hiring teams.
            </p>
            <div className="mt-12 flex items-center justify-center gap-3 md:gap-4 flex-wrap">
              <a href="/work">
                <Button variant="outline" size="lg" className="hover-scale text-emerald-400 border-emerald-700 hover:bg-emerald-500/10">
                  <Briefcase className="mr-2" /> Work
                </Button>
              </a>
              <a href="/projects">
                <Button variant="outline" size="lg" className="hover-scale text-orange-400 border-orange-700 hover:bg-orange-500/10">
                  <Rocket className="mr-2" /> Projects
                </Button>
              </a>
              <a href="/about">
                <Button variant="outline" size="lg" className="hover-scale text-sky-400 border-sky-700 hover:bg-sky-500/10">
                  <User className="mr-2" /> About
                </Button>
              </a>
              <a href="/resume/resume_mle.pdf" target="_blank" rel="noreferrer">
                <Button variant="outline" size="lg" className="hover-scale text-red-400 border-red-700 hover:bg-red-500/10">
                  <FileText className="mr-2" /> Resume
                </Button>
              </a>
            </div>
          </div>
        </header>

        <section className="pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="container-prose">
            <Card className="w-full bg-[hsl(var(--primary)/0.08)] border-[hsl(var(--primary))]/30 shadow-[0_12px_40px_-12px_hsla(24,94%,55%,0.25)]">
              <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-semibold text-[hsl(var(--primary))]">Read my Substack</h3>
                  <p className="mt-2 text-base md:text-lg text-muted-foreground">Deep dives, build notes, and ideas. New posts occasionally.</p>
                </div>
                <a href="https://anvayvats.substack.com/" target="_blank" rel="noreferrer" className="hover-scale md:ml-auto">
                  <Button variant="hero" className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-glow">
                    Visit Substack
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </section>

        <div className="mt-auto animate-in fade-in duration-700">
          <LogosMarquee />
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
};

export default Index;
