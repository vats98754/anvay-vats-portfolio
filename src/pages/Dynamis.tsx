import Navbar from "@/components/Navbar";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const Dynamis = () => {
  useScrollReveal();
  return (
    <>
      <Navbar />
      <main>
        <section className="section-padding">
          <div className="container-prose reveal">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-400">Dynamis Trading System</h1>
            <p className="mt-3 text-muted-foreground max-w-3xl">
              Low-latency Solana trading platform built with Python, Rust, Redis, and JAX on AWS (ECS Fargate, EC2, Secrets Manager, TGW, NATS).
              25ms token sniper, grammar-driven agentic workflows, and CUDA-accelerated OCR pipelines.
            </p>
            <ul className="mt-6 list-disc pl-6 space-y-2 text-sm">
              <li>Team of 6; full-stack lead focused on reliability and latency budgets</li>
              <li>Context-free grammars + parallel parsing → LangGraph strategy generation</li>
              <li>Distributed microservices via NATS JetStreams; Jito gRPC ingestion</li>
              <li>GPU pipelines for image/video OCR; fault-tolerant batch + streaming</li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
};

export default Dynamis;


