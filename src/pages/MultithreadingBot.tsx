import Navbar from "@/components/Navbar";

const MultithreadingBot = () => {
  return (
    <>
      <Navbar />
      <main>
        <section className="section-padding">
          <div className="container-prose">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-red-500">Multithreading Trading Bot</h1>
            <p className="mt-3 text-muted-foreground max-w-3xl">
              HFT across Solana/Ethereum with event-driven multithreading. Orchestrated Puppeteer + Hummingbot; integrated RPCs (Helius, Raydium).
            </p>
            <ul className="mt-6 list-disc pl-6 space-y-2 text-sm">
              <li>$100k+ realized profit; 80% efficiency gain via evented thread model</li>
              <li>Strategy adapters for on-chain AMMs and centralized connectors</li>
              <li>Backtesting harness with deterministic replays</li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
};

export default MultithreadingBot;


