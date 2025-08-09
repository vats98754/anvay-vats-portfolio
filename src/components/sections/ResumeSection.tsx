import Section from "./Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "sonner";

const ResumeSection = () => {
  const handleResumeClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      const res = await fetch("/resume/resume_mle.pdf", { method: "HEAD" });
      if (!res.ok) {
        e.preventDefault();
        toast("Resume not found yet", { description: "Add /resume/resume_mle.pdf to the public folder to enable download." });
      }
    } catch {
      e.preventDefault();
      toast("Resume not available", { description: "Please try again later." });
    }
  };

  return (
    <Section id="resume" title="Resume" subtitle="One page snapshot of my experience and impact.">
      <Card className="bg-gradient-primary animate-shine-bg bg-[length:200%_200%]">
        <CardHeader>
          <CardTitle className="text-xl">Interested in working together?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <a href="/resume/resume_mle.pdf" onClick={handleResumeClick} target="_blank" rel="noreferrer" aria-label="Download resume">
            <Button variant="hero"><FileText className="mr-2" /> Download Resume</Button>
          </a>
          <p className="text-sm text-primary-foreground/90">Updated regularly • PDF • 1 page</p>
        </CardContent>
      </Card>
    </Section>
  );
};

export default ResumeSection;
