import Section from "./Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  // Large projects (link to internal pages)
  {
    title: "Dynamis Trading System",
    description:
      "Low-latency Solana trading platform with distributed microservices, grammars → strategies, and CUDA-accelerated OCR.",
    impact: "$3.7M monthly volume; 25ms token sniper; grammar-driven agentic strategies",
    tech: ["Python", "Rust", "Redis", "JAX", "AWS"],
    href: "/projects/dynamis",
    internal: true,
    image: "/placeholder.svg",
  },
  {
    title: "Multithreading Trading Bot",
    description:
      "HFT strategies across Solana/Ethereum; multithreaded TS events, Hummingbot, Puppeteer orchestration.",
    impact: "$100k+ profit; 80% efficiency gain with event-driven threads",
    tech: ["TypeScript", "Solidity", "Puppeteer", "Hummingbot"],
    href: "/projects/multithreading-bot",
    internal: true,
    image: "/placeholder.svg",
  },
  // Smaller projects (link out to GitHub / pages)
  {
    title: "GPU‑Accelerated Financial Modeling",
    description: "CUDA implementations of Black‑Scholes, Barrier Options; real‑time OpenGL visualization.",
    impact: "Massive speedups on complex simulations; PSO‑calibrated Heston model",
    tech: ["CUDA", "C", "OpenGL"],
    href: "https://github.com/vats98754/cuda-gpu-programming-finance",
    image: "/placeholder.svg",
  },
  {
    title: "E2EE Messenger",
    description: "End‑to‑end encrypted chat to explore cryptographic protocols and UX.",
    impact: "Hands‑on with secure messaging primitives",
    tech: ["JavaScript", "WebCrypto"],
    href: "https://github.com/vats98754/e2ee-messenger",
    image: "/placeholder.svg",
  },
  {
    title: "Video Retriever",
    description: "Retrieve the exact clip segment answering a query across videos.",
    impact: "Fast knowledge extraction from long media",
    tech: ["HTML", "JS"],
    href: "https://github.com/vats98754/video-retriever",
    image: "/placeholder.svg",
  },
  {
    title: "Message Forwarder",
    description: "Bridge messages between channels (e.g., SMS ↔ email/Instagram).",
    impact: "Automates cross‑platform messaging",
    tech: ["TypeScript"],
    href: "https://github.com/vats98754/message-forwarder",
    image: "/placeholder.svg",
  },
];

const ProjectsSection = () => {
  const highlight = (text: string) => {
    const techKeywords = [
      "Python",
      "Rust",
      "Redis",
      "JAX",
      "AWS",
      "TypeScript",
      "Solidity",
      "Puppeteer",
      "Hummingbot",
      "CUDA",
      "OpenGL",
      "NATS",
      "LangGraph",
      "Helius",
    ];
    const mathKeywords = [
      "Black‑Scholes",
      "Black-Scholes",
      "Barrier Options",
      "Heston",
      "Particle Swarm Optimization",
      "PSO",
    ];
    let html = text
      .replace(/\$[0-9][\d\.,]*(?:\s?[kMB]|\s?million|\s?billion)?|\b[0-9][\d\.,]*k\+\b/gi, '<span class="text-emerald-400 font-medium">$&</span>')
      .replace(/\b\d+(?:\.\d+)?%\b/g, '<span class="text-sky-400 font-medium">$&</span>')
    techKeywords.forEach((k) => {
      const re = new RegExp(`(\\b${k.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b)`, "g");
      html = html.replace(re, '<span class="text-[hsl(var(--primary))] font-medium">$1</span>');
    });
    mathKeywords.forEach((k) => {
      const re = new RegExp(k.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "g");
      html = html.replace(re, '<span class="text-fuchsia-400 font-medium">$&</span>');
    });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };
  return (
    <Section id="projects" title="Profitable Projects" subtitle="Selected builds with real metrics and outcomes." showHeader={false} noTopPadding>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((p, idx) => (
          <a key={idx} href={p.href} aria-label={`Open ${p.title}`} className="block" target={p.internal ? undefined : "_blank"} rel={p.internal ? undefined : "noreferrer"}>
            <Card
              className="group hover:shadow-elevated transition-shadow overflow-hidden"
              data-cursor-view="project"
            >
              {p.image && (
                <img src={p.image} alt="project cover" className="h-40 w-full object-cover" />
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-[hsl(var(--primary))]"><Rocket className="h-5 w-5" /> {p.title}</CardTitle>
                <CardDescription>{highlight(p.impact)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{highlight(p.description)}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </Section>
  );
};

export default ProjectsSection;
