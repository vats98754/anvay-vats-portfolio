import Section from "./Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

const experiences = [
  {
    role: "Lead Developer",
    company: "Arvo AI",
    period: "August 2024 — December 2024",
    href: "https://arvoai.ca/",
    summary: "Led development of shipment logistics chatbot with agentic workflows and ML optimization systems.",
    impacts: [
      "Led team of 3 developers deploying Langgraph agentic workflow for logistics chatbot",
      "Built custom GNN for freight optimization with quantized LLMs via Ollama/llama.cpp",
      "Managed 150+ tickets in Agile Kanban sprints with comprehensive project documentation",
      "Achieved 90% accuracy, 95% recall, and 100ms response time on RAG and tool-calling tasks",
    ],
  },
  {
    role: "Quantitative Researcher",
    company: "TIW Private Equity ($200M+ AUM)",
    period: "April 2024 — August 2024",
    href: "https://tiwcg.com/",
    summary: "Developed dynamic risk optimization and high-frequency trading algorithms for quantitative strategies.",
    impacts: [
      "Implemented dynamic risk optimization reducing drawdowns by 32% while maintaining alpha",
      "Engineered high-frequency adaptive trend following with multi-asset signal processing",
      "Developed carry-enhanced strategies with LSTM-based deep diversification models",
      "Built breakout detection and mean-reversion systems with distributed Kafka streams",
    ],
  },
  {
    role: "Data Engineer",
    company: "iLoF",
    period: "January 2024 — April 2024",
    href: "https://ilof.tech/",
    summary: "Built high-performance data pipelines for photonics timeseries analysis with distributed computing.",
    impacts: [
      "Engineered sub-100ms latency pipeline for photonics data with Redis caching",
      "Implemented distributed architecture with Celery, Docker, and Probabilistic PCA",
      "Optimized model evaluation reducing inference time by 76% using async workers",
      "Increased prediction accuracy by 82% using Random Forests and XGBoost",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "MappedIn",
    period: "April 2023 — August 2023",
    href: "https://www.mappedin.com/",
    summary: "Developed 3D indoor mapping SDK used by 1000+ firms including Apple and Dubai Mall.",
    impacts: [
      "Built core SDK features for major clients using TypeScript and ThreeJS",
      "Applied Linear Algebra and Projective Geometry to optimize rendering performance",
      "Implemented EdgeGAN with GNNs to enhance cGAN-based Map Digitizer",
      "Contributed to SDK team serving 1000+ enterprise clients globally",
    ],
  },
];

const WorkSection = () => {
  return (
    <Section id="work" title="Work" subtitle="A track record of shipping, learning, and measurable impact." showHeader={false} noTopPadding>
      <ol className="relative ml-4 border-l pl-6">
        {experiences.map((exp, idx) => (
          <li key={idx} className="mb-10">
            <span className="absolute -left-2 mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary">
              <Briefcase className="h-3 w-3 text-primary" />
            </span>
            <a href={exp.href} target="_blank" rel="noreferrer" className="block" aria-label={`Open ${exp.company} website`} data-cursor-view="work">
              <Card className="hover:shadow-elevated transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-[hsl(var(--primary))]">{exp.role} · {exp.company}</CardTitle>
                <CardDescription>{exp.period}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">{exp.summary}</p>
                <ul className="list-disc space-y-2 pl-4 text-sm">
                  {exp.impacts.map((i, j) => (
                    <li key={j}>{i}</li>
                  ))}
                </ul>
              </CardContent>
              </Card>
            </a>
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default WorkSection;
