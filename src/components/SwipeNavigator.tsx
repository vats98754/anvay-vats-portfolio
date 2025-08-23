import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Global swipe + arrow-key navigation between top-level pages
const SwipeNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Order of routes to cycle through (exclude external and deep project routes)
  const cycleRoutes = useMemo(
    () => ["/", "/work", "/projects", "/achievements", "/about"],
    []
  );

  const goto = (offset: number) => {
    const idx = cycleRoutes.indexOf(location.pathname);
    const current = idx >= 0 ? idx : 0;
    const next = (current + offset + cycleRoutes.length) % cycleRoutes.length;
    navigate(cycleRoutes[next]);
  };

  // Keyboard navigation for desktop
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goto(-1);
      if (e.key === "ArrowRight") goto(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, cycleRoutes]);

  // Touch swipe navigation for mobile
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startT = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startT = Date.now();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (startT === 0) return;
      const dt = Date.now() - startT;
      const touch = (e.changedTouches && e.changedTouches[0]) || null;
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const minDist = 60; // px
      const maxAngle = 30; // degrees allowance for vertical movement

      const angle = Math.atan2(absY, absX) * (180 / Math.PI);
      const isHorizontal = absX > minDist && angle < maxAngle;
      const isQuick = dt < 800; // quick-ish swipe

      if (isHorizontal && isQuick) {
        if (dx < 0) goto(1); // swipe left -> next
        else goto(-1); // swipe right -> prev
      }

      // reset
      startT = 0;
      startX = 0;
      startY = 0;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchend", onTouchEnd as any);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, cycleRoutes]);

  // Visual swipe/arrow indicators
  return (
    <>
      {/* Mobile swipe affordances */}
      <div className="md:hidden pointer-events-none fixed inset-y-0 left-2 z-40 flex items-center text-muted-foreground/70">
        <div className="flex items-center gap-1 rounded-full bg-background/70 backdrop-blur px-2 py-1 text-xs shadow">
          <ChevronLeft className="h-4 w-4" />
          <span>Swipe</span>
        </div>
      </div>
      <div className="md:hidden pointer-events-none fixed inset-y-0 right-2 z-40 flex items-center text-muted-foreground/70">
        <div className="flex items-center gap-1 rounded-full bg-background/70 backdrop-blur px-2 py-1 text-xs shadow">
          <span>Swipe</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>

      {/* Desktop keyboard hint */}
      <div className="hidden md:flex pointer-events-none fixed bottom-3 left-1/2 -translate-x-1/2 z-40 text-muted-foreground/70">
        <div className="rounded-full bg-background/70 backdrop-blur px-3 py-1 text-xs shadow flex items-center gap-2">
          <span className="font-mono">←</span>
          <span className="opacity-80">Press arrow keys to navigate</span>
          <span className="font-mono">→</span>
        </div>
      </div>
    </>
  );
};

export default SwipeNavigator;
