import { useEffect, useRef } from "react";

const ORANGE = "24, 94%, 55%";

const CursorFX = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Hold-to-pull state
  const isHoldingRef = useRef(false);
  const holdStartRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const pulledSetRef = useRef<Set<HTMLElement>>(new Set());

  useEffect(() => {
    const dot = dotRef.current!;
    const container = containerRef.current!;

    const move = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      lastMouseRef.current = { x, y };
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    // Visual-only black hole (unchanged look)
    const spawnBlackHoleVisuals = (x: number, y: number) => {
      // Core (event horizon)
      const core = document.createElement("div");
      core.style.position = "fixed";
      core.style.left = `${x}px`;
      core.style.top = `${y}px`;
      core.style.width = `12px`;
      core.style.height = `12px`;
      core.style.borderRadius = "50%";
      core.style.transform = "translate(-50%, -50%) scale(0.6)";
      core.style.background = "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 35%, rgba(0,0,0,0.0) 70%)";
      core.style.boxShadow = "0 0 60px rgba(0,0,0,0.6), inset 0 0 24px rgba(0,0,0,0.9)";
      core.style.pointerEvents = "none";
      core.style.zIndex = "9999";
      container.appendChild(core);

      // Accretion disk (already orange-tinged)
      const disk = document.createElement("div");
      disk.style.position = "fixed";
      disk.style.left = `${x}px`;
      disk.style.top = `${y}px`;
      disk.style.width = `20px`;
      disk.style.height = `20px`;
      disk.style.borderRadius = "50%";
      disk.style.transform = "translate(-50%, -50%) rotate(0deg)";
      disk.style.pointerEvents = "none";
      disk.style.zIndex = "9998";
      disk.style.mixBlendMode = "screen";
      disk.style.background = "conic-gradient(from 0deg, rgba(255,255,255,0.25), rgba(255,165,0,0.35), rgba(255,255,255,0.15), rgba(255,165,0,0.35), rgba(255,255,255,0.25))";
      container.appendChild(disk);

      const maxScale = 12;

      const coreAnim = core.animate(
        [
          { transform: "translate(-50%, -50%) scale(0.6)", filter: "blur(0px)" },
          { transform: `translate(-50%, -50%) scale(${maxScale})`, filter: "blur(2px)" },
          { transform: `translate(-50%, -50%) scale(${maxScale * 0.9})`, filter: "blur(3px)" },
          { transform: "translate(-50%, -50%) scale(0.4)", filter: "blur(1px)" },
        ],
        { duration: 700, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" }
      );

      const diskAnim = disk.animate(
        [
          { transform: "translate(-50%, -50%) rotate(0deg) scale(0.6)", opacity: 0.6 },
          { transform: `translate(-50%, -50%) rotate(360deg) scale(${maxScale * 0.9})`, opacity: 0.9 },
          { transform: `translate(-50%, -50%) rotate(720deg) scale(${maxScale * 0.8})`, opacity: 0.0 },
        ],
        { duration: 750, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" }
      );

      diskAnim.onfinish = () => disk.remove();
      coreAnim.onfinish = () => core.remove();

      // Inward particles
      const particles = 24;
      const baseRadius = 140;
      for (let i = 0; i < particles; i++) {
        const p = document.createElement("div");
        p.style.position = "fixed";
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        const size = 3 + Math.random() * 2;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.borderRadius = "50%";
        p.style.background = `rgba(255,165,0,${0.35 + Math.random() * 0.35})`; // orange tint
        p.style.boxShadow = "0 0 8px rgba(255,165,0,0.7)";
        p.style.transform = "translate(-50%, -50%)";
        p.style.pointerEvents = "none";
        p.style.zIndex = "9997";
        container.appendChild(p);

        const angle = (Math.PI * 2 * i) / particles + Math.random() * 0.6;
        const radius = baseRadius * (0.6 + Math.random() * 0.6);
        const startX = Math.cos(angle) * radius;
        const startY = Math.sin(angle) * radius;
        const swirl = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 180);

        const anim = p.animate(
          [
            { transform: `translate(calc(-50% + ${startX}px), calc(-50% + ${startY}px)) scale(1)`, opacity: 0.9, offset: 0 },
            { transform: `translate(calc(-50% + ${startX * 0.4}px), calc(-50% + ${startY * 0.4}px)) rotate(${swirl / 2}deg) scale(0.9)`, opacity: 0.7, offset: 0.5 },
            { transform: `translate(-50%, -50%) rotate(${swirl}deg) scale(0.6)`, opacity: 0 },
          ],
          { duration: 700 + Math.random() * 200, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" }
        );
        anim.onfinish = () => p.remove();
      }
    };

    // Continuous attraction while holding
    const applyTranslate = (el: HTMLElement, x: number, y: number) => {
      // Prefer modern individual transform property to not clobber existing transforms
      (el.style as any).translate = `${x}px ${y}px`;
      el.setAttribute("data-pulled", "true");
      pulledSetRef.current.add(el);
    };

    const clearTranslateAnimated = (el: HTMLElement, duration = 260) => {
      const current = ((el.style as any).translate as string) || "0 0";
      const anim = (el as any).animate
        ? (el as any).animate(
            [{ translate: current }, { translate: "0 0" }],
            { duration, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" }
          )
        : null;
      if (anim) {
        anim.onfinish = () => {
          (el.style as any).translate = "";
          el.removeAttribute("data-pulled");
          pulledSetRef.current.delete(el);
        };
      } else {
        (el.style as any).translate = "";
        el.removeAttribute("data-pulled");
        pulledSetRef.current.delete(el);
      }
    };

    const attractionLoop = () => {
      if (!isHoldingRef.current) return;
      const { x, y } = lastMouseRef.current;

      const now = Date.now();
      const heldFor = Math.min(1500, now - holdStartRef.current); // ramp up to 1.5s
      const ramp = heldFor / 1500; // 0..1
      const strengthBoost = 0.6 + ramp * 1.6; // scales from 0.6x to 2.2x
      const baseMaxDistance = 340;
      const maxDistance = baseMaxDistance + ramp * 200; // expand reach while holding

      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>(
          'a, button, img, [data-cursor-view], .card, .Card, .shadow-elevated, [role="button"]'
        )
      );

      // Find nearest subset to limit work
      const pulls: Array<{ el: HTMLElement; dist: number; dx: number; dy: number }> = [];
      for (const el of candidates) {
        // Skip fixed overlays like our cursor container
        if (container.contains(el)) continue;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < maxDistance) pulls.push({ el, dist, dx, dy });
      }

      pulls
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 36)
        .forEach(({ el, dist, dx, dy }) => {
          const falloff = Math.max(0, 1 - dist / maxDistance);
          const pullX = dx * 0.08 * falloff * strengthBoost;
          const pullY = dy * 0.08 * falloff * strengthBoost;
          applyTranslate(el, pullX, pullY);
        });

      rafRef.current = requestAnimationFrame(attractionLoop);
    };

    const startHold = (x: number, y: number) => {
      isHoldingRef.current = true;
      holdStartRef.current = Date.now();
      lastMouseRef.current = { x, y };
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(attractionLoop);
    };

    const stopHold = () => {
      isHoldingRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // Restore all pulled elements
      pulledSetRef.current.forEach((el) => clearTranslateAnimated(el, 280));
      pulledSetRef.current.clear();
    };

    const onMouseDown = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      spawnBlackHoleVisuals(x, y);
      startHold(x, y);
    };

    const onMouseUp = () => stopHold();
    const onMouseLeave = () => stopHold();
    const onBlur = () => stopHold();

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("blur", onBlur);

    // Contextual tooltip/preview on hover
    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const projectCard = target?.closest('[data-cursor-view="project"]') as HTMLElement | null;
      const workCard = target?.closest('[data-cursor-view="work"]') as HTMLElement | null;
      const achievementCard = target?.closest('[data-cursor-view="achievement"]') as HTMLElement | null;
      const emailLink = target?.closest('[data-cursor-view="email"]') as HTMLElement | null;
      const linkedinLink = target?.closest('[data-cursor-view="linkedin"]') as HTMLElement | null;
      const githubLink = target?.closest('[data-cursor-view="github"]') as HTMLElement | null;
      
      if (projectCard) {
        const linkElement = projectCard.closest('a');
        const isExternal = linkElement?.getAttribute('target') === '_blank';
        const projectImage = projectCard.querySelector('img')?.getAttribute('src');
        
        // keep cursor orange (do not make dot transparent)
        // dot.classList.add("!bg-transparent", "!border-0");
        
        if (projectImage && projectImage !== "/placeholder.svg") {
          dot.innerHTML = `
            <div style="position:absolute; left:50%; top:50%; transform: translate(-50%, -100%); margin-top: -10px; background: white; box-shadow: 0 8px 25px rgba(0,0,0,0.15); border: 2px solid hsla(${ORANGE}, 0.8); border-radius: 8px; overflow: hidden;">
              <img src="${projectImage}" alt="project preview" style="width: 100%; height: 50%; object-fit: cover; display: block; border-radius: 6px 6px 0 0;" />
              <div class="px-3 py-2 text-center" style="background: hsla(${ORANGE}, 1); color: white;">
                <div class="flex items-center gap-1 justify-center">
                  <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7'/><circle cx='12' cy='12' r='3'/></svg>
                  <span class="text-xs font-medium">${isExternal ? 'Open in new tab' : 'View project'}</span>
                  ${isExternal ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' : ''}
                </div>
              </div>
            </div>`;
        } else {
          dot.innerHTML = `
            <div class="flex items-center gap-2 -translate-x-1/2 -translate-y-full"
                 style="position:absolute; left:50%; top:50%; background: hsla(${ORANGE}, 1); color: white; box-shadow: 0 6px 20px hsla(${ORANGE}, 0.35); border-radius: 20px; padding: 8px 12px; margin-top: -10px;">
              <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7'/><circle cx='12' cy='12' r='3'/></svg>
              <span class="text-xs font-medium whitespace-nowrap">${isExternal ? 'Open in new tab' : 'View project'}</span>
              ${isExternal ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' : ''}
            </div>`;
        }
      } else if (workCard) {
        // keep cursor orange
        // dot.classList.add("!bg-transparent", "!border-0");
        dot.innerHTML = `
          <div class="flex items-center gap-2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1"
               style="position:absolute; left:50%; top:50%; background: hsla(${ORANGE}, 1); color: white; box-shadow: 0 6px 20px hsla(${ORANGE}, 0.35)">
            <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7'/><circle cx='12' cy='12' r='3'/></svg>
            <span class="text-xs font-medium whitespace-nowrap">company webpage</span>
          </div>`;
      } else if (achievementCard) {
        // keep cursor orange
        // dot.classList.add("!bg-transparent", "!border-0");
        dot.innerHTML = `
          <div class="flex items-center gap-2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1"
               style="position:absolute; left:50%; top:50%; background: #f59e0b; color: white; box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35)">
            <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7'/><circle cx='12' cy='12' r='3'/></svg>
            <span class="text-xs font-medium whitespace-nowrap">achievement details</span>
          </div>`;
      } else if (emailLink) {
        // keep cursor orange
        // dot.classList.add("!bg-transparent", "!border-0");
        dot.innerHTML = `
          <div class="flex items-center gap-2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1"
               style="position:absolute; left:50%; top:50%; background: hsla(${ORANGE}, 1); color: white; box-shadow: 0 6px 20px hsla(${ORANGE}, 0.35)">
            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2z'/><path d='m22 6-10 7L2 6'/></svg>
            <span class="text-xs font-medium whitespace-nowrap">a7vats@uwaterloo.ca</span>
          </div>`;
      } else if (linkedinLink) {
        // keep cursor orange
        // dot.classList.add("!bg-transparent", "!border-0");
        dot.innerHTML = `
          <div class="flex items-center gap-2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1"
               style="position:absolute; left:50%; top:50%; background: #0A66C2; color: white; box-shadow: 0 6px 20px rgba(10,102,194,0.35)">
            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='white' stroke='white' stroke-width='0'>
              <path d='M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0V8.98zM8.98 8.98h4.78v2.05h.07c.67-1.26 2.3-2.6 4.73-2.6 5.06 0 5.99 3.33 5.99 7.66V24h-5v-6.73c0-1.61-.03-3.67-2.24-3.67-2.24 0-2.58 1.75-2.58 3.56V24h-5V8.98z'/>
            </svg>
            <span class="text-xs font-medium whitespace-nowrap">LinkedIn</span>
          </div>`;
      } else if (githubLink) {
        // keep cursor orange
        // dot.classList.add("!bg-transparent", "!border-0");
        dot.innerHTML = `
          <div class="flex items-center gap-2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1"
               style="position:absolute; left:50%; top:50%; background: #000; color: white; box-shadow: 0 6px 20px rgba(0,0,0,0.35)">
            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='white'>
              <path d='M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.11.8-.25.8-.56v-2.1c-3.26.71-3.95-1.57-3.95-1.57-.53-1.35-1.3-1.71-1.3-1.71-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.72 1.26 3.38.96.11-.76.41-1.26.74-1.55-2.6-.3-5.34-1.3-5.34-5.8 0-1.28.46-2.33 1.2-3.15-.12-.3-.52-1.53.11-3.18 0 0 .98-.31 3.2 1.2a11 11 0 0 1 5.82 0c2.22-1.51 3.2-1.2 3.2-1.2.63 1.65.23 2.88.11 3.18.75.82 1.2 1.87 1.2 3.15 0 4.51-2.74 5.5-5.36 5.79.42.36.79 1.08.79 2.18v3.23c0 .31.21.68.81.56A11.5 11.5 0 0 0 12 .5z'/>
            </svg>
            <span class="text-xs font-medium whitespace-nowrap">GitHub</span>
          </div>`;
      } else {
        dot.innerHTML = "";
      }
    };
    window.addEventListener("mousemove", onEnter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("mousemove", onEnter);
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 z-[60]">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full custom-cursor"
        style={{ width: 14, height: 14, background: "#ff8c00", boxShadow: "0 0 20px rgba(255, 140, 0, 0.8)", border: "none" }}
      />
    </div>
  );
};

export default CursorFX;


