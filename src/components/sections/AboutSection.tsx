import Section from "./Section";
import { Badge } from "@/components/ui/badge";

const interests = ["Computer Science", "Mathematics", "Data Science", "Cryptography", "Quantum Computing", "Fintech", "Philosophy", "Psychology"];

const AboutSection = () => {
  return (
    <Section id="about" title="About Me" subtitle="Interest, beliefs, and what drives my work." showHeader={false} noTopPadding>
      <div>
      <p className="text-base leading-relaxed text-muted-foreground">
          <strong>Beliefs:</strong>
          <li>We are shaped by evolution and daily conditions.</li>
          <li>The world is inherently absurd; we assign reasons after events occur.</li>
          <li>Experience is the brain’s construction of reality.</li>
          <br />
          <strong>Interests:</strong>
          <li>Exploring why things exist and work as they do.</li>
          <li>Computer Science, Electrical Engineering (hardware programming/VHDL on FPGA boards, parallelising code with GPU blocks/cells).</li>
          <li>Math (Statistics, Algebra, some Analysis), Quantum Computing, Psychology, and Evolutionary Biology.</li>
          <li>Computational Neuroscience, Philosophy of Mind, Epistemology, Metaphysics, Existentialism, Absurdism.</li>
          <br />
          I believe fleeting thoughts still shape our lives, but actions and our conditions define us to others.
          Our world can be reduced to sequences of actions over time and our perception of reality is built from these sequences.
          <br />
          <br />
          <b style={{ color: "#22d3ee" }}>My motivations are informed by my curiosity about the many sequences of actions unfolding within the reality I am priveleged to perceive.</b>
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
