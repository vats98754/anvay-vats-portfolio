import { useEffect, useRef } from "react";

const ORANGE = "24, 94%, 55%";

const CursorFX = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current!;
    const container = containerRef.current!;

    const move = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const burst = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      const ring = document.createElement("div");
      ring.style.position = "fixed";
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
      ring.style.width = "2px";
      ring.style.height = "2px";
      ring.style.border = `2px solid hsla(${ORANGE}, 0.6)`;
      ring.style.borderRadius = "9999px";
      ring.style.transform = "translate(-50%, -50%) scale(0.6)";
      ring.style.opacity = "0.7";
      ring.style.pointerEvents = "none";
      container.appendChild(ring);
      const ringAnim = ring.animate(
        [
          { transform: "translate(-50%, -50%) scale(0.6)", opacity: 0.7 },
          { transform: "translate(-50%, -50%) scale(2.2)", opacity: 0 },
        ],
        { duration: 500, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
      );
      ringAnim.onfinish = () => ring.remove();

      const particles = 10;
      for (let i = 0; i < particles; i++) {
        const p = document.createElement("div");
        p.style.position = "fixed";
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.width = "6px";
        p.style.height = "6px";
        p.style.borderRadius = "9999px";
        p.style.background = `hsla(${ORANGE}, 0.8)`;
        p.style.boxShadow = "0 0 10px hsla(24,94%,55%,0.6)";
        p.style.transform = "translate(-50%, -50%)";
        p.style.pointerEvents = "none";
        container.appendChild(p);
        const angle = (Math.PI * 2 * i) / particles + Math.random() * 0.5;
        const distance = 30 + Math.random() * 30;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const particleAnim = p.animate(
          [
            { transform: "translate(-50%, -50%) translate(0, 0)", opacity: 1 },
            { transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px)`, opacity: 0 },
          ],
          { duration: 500 + Math.random() * 250, easing: "ease-out" }
        );
        particleAnim.onfinish = () => p.remove();
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", burst);
    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const projectCard = target?.closest('[data-cursor-view="project"]') as HTMLElement | null;
      const workCard = target?.closest('[data-cursor-view="work"]') as HTMLElement | null;
      if (projectCard) {
        dot.classList.add("!bg-transparent", "!border-0");
        dot.innerHTML = `
          <div class="flex items-center gap-2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1"
               style="position:absolute; left:50%; top:50%; background: hsla(${ORANGE}, 1); color: white; box-shadow: 0 6px 20px hsla(${ORANGE}, 0.35)">
            <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7'/><circle cx='12' cy='12' r='3'/></svg>
            <span class="text-xs font-medium whitespace-nowrap">project demo</span>
          </div>`;
      } else if (workCard) {
        dot.classList.add("!bg-transparent", "!border-0");
        dot.innerHTML = `
          <div class="flex items-center gap-2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1"
               style="position:absolute; left:50%; top:50%; background: hsla(${ORANGE}, 1); color: white; box-shadow: 0 6px 20px hsla(${ORANGE}, 0.35)">
            <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7'/><circle cx='12' cy='12' r='3'/></svg>
            <span class="text-xs font-medium whitespace-nowrap">company webpage</span>
          </div>`;
      } else {
        dot.classList.remove("!bg-transparent", "!border-0");
        dot.innerHTML = "";
      }
    };
    window.addEventListener("mousemove", onEnter);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", burst);
      window.removeEventListener("mousemove", onEnter);
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 z-[60]">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 14, height: 14, background: "hsla(24, 94%, 55%, 0.15)", boxShadow: "0 0 30px hsla(24,94%,55%,0.35)", border: "1px solid hsla(24, 94%, 55%, 0.35)" }}
      />
    </div>
  );
};

export default CursorFX;


