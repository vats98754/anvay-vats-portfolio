import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, User, FileText, Rocket, Award } from "lucide-react";

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
      <main className="pt-6 md:pt-12 py-6 md:py-4 min-h-screen flex flex-col animate-homepage-gradient overflow-hidden">
          <div className="container-prose text-center animate-in fade-in slide-in-from-top-4 duration-500">

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-wider rich-gradient">
              <style>{`
                        .rich-gradient {
                          background: linear-gradient(90deg,
                          #02aab0 0%,
                          #00cdac 15%,
                          #1a2980 35%,
                          #2e4bd6 55%,
                          #3ecfdc 75%,
                          #26d0ce 100%
                          );
                          background-size: 400% 400%;
                          -webkit-background-clip: text;
                          -webkit-text-fill-color: transparent;
                          background-clip: text;
                          animation: lightGradientShift 12s ease infinite;
                          font-weight: 800;
                          letter-spacing: 0.01em;
                          text-shadow: 0 2px 8px rgba(38,208,206,0.12);
                        }

                        @keyframes lightGradientShift {
                          0% { background-position: 0% 50%; }
                          50% { background-position: 100% 50%; }
                          100% { background-position: 0% 50%; }
                        }
                        `}</style>
              Anvay's Portfolio
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">
              I have worked in teams to make{" "}
              <span className="text-green-500 font-semibold">millions of USD</span> via fast scripts on-chain for{" "}
              <span className="inline-flex items-center gap-1">
              <span
                style={{
                background: "linear-gradient(90deg, #00f2fe 0%, #008080 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                }}
              >
                {/* SOL Logo (three skewed bars) */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: "middle" }} aria-hidden>
                <defs>
                  <linearGradient id="sol-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#00f2fe" />
                  <stop offset="1" stopColor="#008080" />
                  </linearGradient>
                </defs>
                <g fill="url(#sol-grad)">
                  <rect x="1" y="3" width="20" height="3.5" rx="1.75" transform="skewX(-20 0 0)" />
                  <rect x="1" y="9" width="20" height="3.5" rx="1.75" transform="skewX(-20 0 0)" />
                  <rect x="1" y="15" width="20" height="3.5" rx="1.75" transform="skewX(-20 0 0)" />
                </g>
                </svg>
                SOL
              </span>
              {", "}
              <span
                style={{
                background: "linear-gradient(90deg, #627eea 0%, #4a90e2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                }}
              >
                {/* ETH Logo (diamond/stacked facets) */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: "middle" }} aria-hidden>
                <defs>
                  <linearGradient id="eth-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#627eea" />
                  <stop offset="1" stopColor="#4a90e2" />
                  </linearGradient>
                </defs>
                <g fill="url(#eth-grad)">
                  <path d="M12 2L5 11.5L12 9L19 11.5L12 2Z" />
                  <path d="M12 22V13L19 11.5L12 22Z" opacity="0.95" />
                  <path d="M12 22L5 11.5L12 13V22Z" opacity="0.85" />
                </g>
                </svg>
                ETH
              </span>
              {", and "}
              <span
                style={{
                background: "linear-gradient(90deg, #f7931a 0%, #ffcc80 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                }}
              >
                {/* BTC Logo (stylized B with two vertical strokes) */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: "middle" }} aria-hidden>
                <defs>
                  <linearGradient id="btc-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f7931a" />
                  <stop offset="1" stopColor="#ffcc80" />
                  </linearGradient>
                </defs>
                <g fill="url(#btc-grad)">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M13.7 8.3c.9-.3 1.6-.1 2 .2.4.3.6.9.5 1.6-.1.8-.6 1.1-1.4 1.3.9.2 1.5.7 1.7 1.6.2 1-.1 1.8-.8 2.3-.6.4-1.4.6-2.4.3-.2-.1-.6-.2-1-.3v1.9h-1.5V15.2c-.3-.1-.6-.1-.9-.2-1.1-.3-1.9-.6-2.4-1.5-.5-.9-.5-2.1.1-3 .5-.8 1.5-1.2 2.8-1.2H13c.2-.7.5-1.2 1.1-1.5zM12.1 10.3H10.7v1.1h1.3c.9 0 1.4-.3 1.4-.9 0-.6-.5-1.2-1.3-1.2-.1 0-.1 0-.1 0zm.2 4.9c.6 0 1-.2 1.2-.6.2-.4.1-1-.3-1.3-.3-.2-.7-.3-1.4-.3H10.7v2.2h1.6z" fill="#fff" opacity="0.95" transform="translate(0 -0.2)"/>
                </g>
                </svg>
                BTC
              </span>
              {"."}
              </span>
              <br />
              <br />
              I am currently project managing and lead developing large-scale agentic workflows for{" "}
              <span className="text-green-500 font-semibold">6-figure contracts</span>, and building LMs from scratch for rigorous mathematical understanding.
              <br />
              <br />
              I keep backtesting with mixtures of statistical models on streaming timeseries data to backtest hypotheses about derivatives (Q) and stocks/equities (P).
              <br />
              <br />
              <strong>My process is simple: 1. learn math for fun; 2. try to apply it.</strong>
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
              <a href="/achievements">
                <Button variant="outline" size="lg" className="hover-scale text-amber-400 border-amber-700 hover:bg-amber-500/10">
                  <Award className="mr-2" /> Achievements
                </Button>
              </a>
              <a href="/about">
                <Button variant="outline" size="lg" className="hover-scale text-sky-400 border-sky-700 hover:bg-sky-500/10">
                  <User className="mr-2" /> About
                </Button>
              </a>
              <a href="/resume/resume_mle.pdf" target="_blank" rel="noreferrer">
                <Button variant="outline" size="lg" className="hover-scale text-cyan-400 border-cyan-600 hover:bg-cyan-500/10">
                  <FileText className="mr-2" /> Resume
                </Button>
              </a>
            </div>
          </div>
          <div className="container-prose mt-2 md:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
};

export default Index;
