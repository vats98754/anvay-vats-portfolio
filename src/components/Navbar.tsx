import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const items = [
    { href: "/work", label: "Work" },
    { href: "/projects", label: "Profitable Projects" },
    { href: "/about", label: "About Me" },
    { href: "/resume/resume_mle.pdf", label: "Resume", external: true },
  ] as const;

  const [brandHover, setBrandHover] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-md">
      <nav aria-label="Primary" className="container-prose flex h-16 items-center justify-between">
        <NavLink
          to="/"
          aria-label="Go to home"
          className="font-extrabold tracking-tight text-red-500 text-xl md:text-2xl transition-colors"
          onMouseEnter={() => setBrandHover(true)}
          onMouseLeave={() => setBrandHover(false)}
        >
          {brandHover ? "Home" : "Anvay"}
        </NavLink>
        <div className="hidden gap-6 md:flex">
          {items.map((item) =>
            (item as any).external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="story-link text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label={item.label}
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `story-link text-sm transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`
                }
                aria-label={item.label}
              >
                {item.label}
              </NavLink>
            )
          )}
        </div>
        <div className="flex items-center gap-2">
          <a href="mailto:a7vats@uwaterloo.ca" aria-label="Email me" className="hover-scale">
            <Button variant="hero" size="sm">Contact Me</Button>
          </a>
          <a href="/threejs/" aria-label="Open 3D portfolio" className="hover-scale">
            <Button variant="threeD" size="sm">3D portfolio</Button>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
