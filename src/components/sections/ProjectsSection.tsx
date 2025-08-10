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
    tech: ["Python", "Rust", "Redis", "JAX", "AWS", "NATS", "LangGraph", "Helius", "Solana", "Microservices"],
    href: "/projects/dynamis",
    internal: true,
    image: "/projects/dynamis.png",
  },
  {
    title: "Multithreading Trading Bot",
    description:
      "HFT strategies across Solana/Ethereum; multithreaded TS events, Hummingbot, Puppeteer orchestration.",
    impact: "$100k+ profit; 80% efficiency gain with event-driven threads",
    tech: ["TypeScript", "Solidity", "Puppeteer", "Hummingbot", "Solana", "Ethereum", "HFT", "Event-driven"],
    href: "/projects/multithreading-bot",
    internal: true,
    image: "/projects/multithreading-bot.png",
  },
  // Smaller projects (link out to GitHub / pages)
  {
    title: "GPU‑Accelerated Financial Modeling",
    description: "CUDA implementations of Black‑Scholes, Barrier Options; real‑time OpenGL visualization.",
    impact: "Massive speedups on complex simulations; PSO‑calibrated Heston model",
    tech: ["CUDA", "C", "OpenGL", "Black-Scholes", "Barrier Options", "Heston Model", "PSO", "Financial Modeling"],
    href: "https://github.com/vats98754/cuda-gpu-programming-finance",
    internal: false,
    image: "/projects/gpu-finance.png",
  },
  {
    title: "E2EE Messenger",
    description: "End‑to‑end encrypted chat to explore cryptographic protocols and UX.",
    impact: "Hands‑on with secure messaging primitives",
    tech: ["JavaScript", "WebCrypto", "End-to-End Encryption", "Cryptography", "Real-time Chat"],
    href: "https://vats98754.github.io/e2ee-messenger/",
    internal: false,
    image: "/projects/e2ee-messenger.png",
  },
  {
    title: "Every Audiobook",
    description: "GUI application to find books and convert them to audiobooks using text-to-speech.",
    impact: "Automated audiobook creation from any book",
    tech: ["Python", "Tkinter", "gTTS", "pygame", "libgen-api", "GUI", "Text-to-Speech"],
    href: "https://vats98754.github.io/every-audiobook/",
    internal: false,
    image: "/projects/every-audiobook.png",
  },
  {
    title: "Document Scanner",
    description: "Web-based document scanner with real-time border detection and shearing transformations.",
    impact: "Real-time document processing and enhancement",
    tech: ["Python", "Jupyter Notebook", "Computer Vision", "OpenCV", "Real-time Processing", "Document Tracking"],
    href: "https://vats98754.github.io/document-scanner/",
    internal: false,
    image: "/projects/document-scanner.png",
  },
  {
    title: "Video Retriever",
    description: "Retrieve the exact clip segment answering a query across videos.",
    impact: "Fast knowledge extraction from long media",
    tech: ["HTML", "JavaScript", "Video Processing", "Content Retrieval", "Media Search"],
    href: "https://video-retriever.onrender.com/",
    internal: false,
    image: "/projects/video-retriever.png",
  },
  {
    title: "Message Forwarder",
    description: "Bridge messages between channels (e.g., SMS ↔ email/Instagram).",
    impact: "Automates cross‑platform messaging",
    tech: ["TypeScript", "Node.js", "SMS Gateway", "Email Integration", "Social Media APIs", "Automation"],
    href: "https://vats98754.github.io/message-forwarder/",
    internal: false,
    image: "/projects/message-forwarder.png",
  },
];

const ProjectsSection = () => {
  const highlight = (text: string) => {
    const techKeywords = [
      "Python", "Rust", "Redis", "JAX", "AWS", "TypeScript", "Solidity", "Puppeteer", "Hummingbot",
      "CUDA", "OpenGL", "NATS", "LangGraph", "Helius", "Solana", "Ethereum", "HFT", "Event-driven",
      "Microservices", "Black-Scholes", "Barrier Options", "Heston Model", "PSO", "Financial Modeling",
      "End-to-End Encryption", "Cryptography", "Real-time Chat", "Tkinter", "gTTS", "pygame", "libgen-api",
      "GUI", "Text-to-Speech", "Computer Vision", "OpenCV", "Real-time Processing", "Document Tracking",
      "Video Processing", "Content Retrieval", "Media Search", "Node.js", "SMS Gateway", "Email Integration",
      "Social Media APIs", "Automation", "JavaScript", "HTML", "C", "Go", "C++", "Java", "R"
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
