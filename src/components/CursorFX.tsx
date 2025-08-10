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

      // Create colorful sparkles
      const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
        '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
        '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24',
        '#ff3838', '#2ed573', '#1e90ff', '#ff6348'
      ];
      
      const sparkles = 15;
      for (let i = 0; i < sparkles; i++) {
        const sparkle = document.createElement("div");
        sparkle.style.position = "fixed";
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.width = "6px";
        sparkle.style.height = "6px";
        sparkle.style.borderRadius = "50%";
        sparkle.style.background = colors[i % colors.length];
        sparkle.style.boxShadow = `0 0 12px ${colors[i % colors.length]}`;
        sparkle.style.transform = "translate(-50%, -50%)";
        sparkle.style.pointerEvents = "none";
        sparkle.style.zIndex = "9999";
        container.appendChild(sparkle);
        
        const angle = (Math.PI * 2 * i) / sparkles + Math.random() * 0.5;
        const distance = 40 + Math.random() * 40;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        
        const sparkleAnim = sparkle.animate(
          [
            { 
              transform: "translate(-50%, -50%) scale(0) rotate(0deg)", 
              opacity: 1 
            },
            { 
              transform: `translate(-50%, -50%) translate(${dx * 0.5}px, ${dy * 0.5}px) scale(1.2) rotate(180deg)`, 
              opacity: 0.9 
            },
            { 
              transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(0) rotate(360deg)`, 
              opacity: 0 
            }
          ],
          { 
            duration: 800 + Math.random() * 400, 
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" 
          }
        );
        
        sparkleAnim.onfinish = () => sparkle.remove();
      }

      // Add a central burst effect
      const burstRing = document.createElement("div");
      burstRing.style.position = "fixed";
      burstRing.style.left = `${x}px`;
      burstRing.style.top = `${y}px`;
      burstRing.style.width = "4px";
      burstRing.style.height = "4px";
      burstRing.style.border = `3px solid #ff8c00`;
      burstRing.style.borderRadius = "50%";
      burstRing.style.transform = "translate(-50%, -50%) scale(0.5)";
      burstRing.style.opacity = "0.8";
      burstRing.style.pointerEvents = "none";
      burstRing.style.zIndex = "9998";
      container.appendChild(burstRing);
      
      const ringAnim = burstRing.animate(
        [
          { transform: "translate(-50%, -50%) scale(0.5)", opacity: 0.8 },
          { transform: "translate(-50%, -50%) scale(3)", opacity: 0 },
        ],
        { duration: 600, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
      );
      ringAnim.onfinish = () => burstRing.remove();
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", burst);
    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const projectCard = target?.closest('[data-cursor-view="project"]') as HTMLElement | null;
      const workCard = target?.closest('[data-cursor-view="work"]') as HTMLElement | null;
      
      if (projectCard) {
        // Check if it's an external link (will open in new tab)
        const linkElement = projectCard.closest('a');
        const isExternal = linkElement?.getAttribute('target') === '_blank';
        
        // Get the project image if available
        const projectImage = projectCard.querySelector('img')?.getAttribute('src');
        
        dot.classList.add("!bg-transparent", "!border-0");
        
        if (projectImage && projectImage !== "/placeholder.svg") {
          // Show project image with new tab indicator for external links
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
          // Fallback for projects without images
          dot.innerHTML = `
            <div class="flex items-center gap-2 -translate-x-1/2 -translate-y-full"
                 style="position:absolute; left:50%; top:50%; background: hsla(${ORANGE}, 1); color: white; box-shadow: 0 6px 20px hsla(${ORANGE}, 0.35); border-radius: 20px; padding: 8px 12px; margin-top: -10px;">
              <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7'/><circle cx='12' cy='12' r='3'/></svg>
              <span class="text-xs font-medium whitespace-nowrap">${isExternal ? 'Open in new tab' : 'View project'}</span>
              ${isExternal ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' : ''}
            </div>`;
        }
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
        className="fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full custom-cursor"
        style={{ width: 14, height: 14, background: "#ff8c00", boxShadow: "0 0 20px rgba(255, 140, 0, 0.8)", border: "none" }}
      />
    </div>
  );
};

export default CursorFX;


