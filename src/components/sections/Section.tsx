import { ReactNode } from "react";

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  showHeader?: boolean;
  noTopPadding?: boolean;
}

const Section = ({ id, title, subtitle, children, showHeader = true, noTopPadding = false }: SectionProps) => {
  return (
    <section id={id} className={`section-padding reveal ${noTopPadding ? "pt-0 md:pt-0" : ""}`}>
      <div className="container-prose">
        {showHeader && (
          <header className="mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-muted-foreground max-w-2xl">{subtitle}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
