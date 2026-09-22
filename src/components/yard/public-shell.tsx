import { Link } from "@tanstack/react-router";
import { ChevronUp } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { YardMark } from "./brand";

const links = [
  ["Projects", "/projects"],
  ["Plans", "/plans"],
  ["Team", "/team"],
  ["FAQs", "/faqs"],
] as const;

export function PublicShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);
  return (
    <div className="public-page">
      <header className="site-header">
        <div className="site-header__inner">
          <YardMark />
          <Button
            className={`menu-button${open ? " menu-button--open" : ""}`}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(!open)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <ChevronUp />
          </Button>
        </div>
      </header>
      <div
        className={`menu-overlay${open ? " menu-overlay--open" : ""}`}
        id="site-menu"
        aria-hidden={!open}
      >
        <nav className="menu-overlay__nav" aria-label="Main navigation">
          {links.map(([label, to]) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setOpen(false)}>
            Get in Touch
          </Link>
        </nav>
        <footer className="menu-overlay__footer">
          <span>Live procurement for everyday buyers</span>
          <span>© 2026 YARD</span>
        </footer>
      </div>
      {children}
      <footer className="site-footer">
        <div className="site-footer__top">
          <YardMark />
          <p>
            Mail in. Market checked.
            <br />
            Good buying decisions out.
          </p>
        </div>
        <div className="site-footer__grid">
          <div>
            <span>Product</span>
            <Link to="/projects">Projects</Link>
            <Link to="/plans">Plans</Link>
            <Link to="/how-it-works">How it works</Link>
          </div>
          <div>
            <span>Company</span>
            <Link to="/about">About</Link>
            <Link to="/team">Team</Link>
            <Link to="/contact">Get in touch</Link>
          </div>
          <div>
            <span>Resources</span>
            <Link to="/faqs">FAQs</Link>
            <Link to="/help">Help centre</Link>
            <Link to="/hackathon">Build log</Link>
          </div>
          <div>
            <span>Workspace</span>
            <Link to="/auth">Sign in</Link>
            <Link to="/dashboard">Live board</Link>
            <Link to="/security">Security</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>Built in Accra, Ghana</span>
          <span>© 2026 YARD</span>
        </div>
      </footer>
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <section className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{copy}</p>
    </section>
  );
}
