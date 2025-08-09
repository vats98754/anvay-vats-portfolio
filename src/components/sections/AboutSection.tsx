import Section from "./Section";
import { Badge } from "@/components/ui/badge";

const interests = ["AI Safety", "Human‑centered UX", "Evaluation", "Edge Compute", "Tooling", "Open Source"];

const AboutSection = () => {
  return (
    <Section id="about" title="About Me" subtitle="Interests, beliefs, and what drives my work." showHeader={false} noTopPadding>
      <div>
        <p className="text-base leading-relaxed text-muted-foreground">
          I believe great products emerge at the intersection of rigorous thinking and rapid iteration. I love turning
          ambiguous problems into simple, useful tools — measured by impact, not vanity metrics. My current focus: building
          reliable AI systems, strong evaluation loops, and delightful workflows that help people think and create faster.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {interests.map((i) => (
          <Badge key={i} variant="secondary">{i}</Badge>
        ))}
      </div>
    </Section>
  );
};

export default AboutSection;
