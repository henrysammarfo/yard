import { createFileRoute } from "@tanstack/react-router";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const services = [
  "Brand Identity",
  "App Development",
  "Visual Design",
  "Creative Video",
  "Iconography",
];

const partners = [
  "Airbnb",
  "Shopify",
  "Notion",
  "Linear",
  "Webflow",
  "Figma",
  "Slack",
  "Stripe",
  "Vercel",
  "Framer",
];

const menuLinks = ["Projects", "Plans", "Team", "FAQs", "Get in Touch"];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alwayzz — Premium Creative On Demand" },
      {
        name: "description",
        content:
          "A flexible design partnership for founders, brands, and agencies who want top craft delivered on their timeline.",
      },
      { property: "og:title", content: "Alwayzz — Premium Creative On Demand" },
      {
        property: "og:description",
        content: "Top-tier creative partnership, delivered on your timeline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function CurveLines({ position }: { position: "left" | "right" | "top" }) {
  return (
    <div className={`curve-lines curve-lines--${position}`} aria-hidden="true">
      {Array.from({ length: 20 }, (_, index) => (
        <span className={`curve-line curve-line--${index + 1}`} key={index} />
      ))}
    </div>
  );
}

function ServiceTicker() {
  const items = Array.from({ length: 4 }, () => services).flat();
  return (
    <div className="service-ticker" aria-label="Creative services">
      <div className="service-ticker__track">
        {items.map((service, index) => (
          <span className="service-ticker__item" key={`${service}-${index}`}>
            {service}
          </span>
        ))}
      </div>
    </div>
  );
}

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => document.body.classList.remove("menu-is-open");
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="wordmark" href="#hero" aria-label="Alwayzz home">
            Alwayzz<span className="wordmark__mark">®</span>
          </a>
          <Button
            className={`menu-button${menuOpen ? " menu-button--open" : ""}`}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span>{menuOpen ? "Close" : "Menu"}</span>
            <ChevronUp aria-hidden="true" />
          </Button>
        </div>
      </header>

      <div
        className={`menu-overlay${menuOpen ? " menu-overlay--open" : ""}`}
        id="site-menu"
        aria-hidden={!menuOpen}
      >
        <nav className="menu-overlay__nav" aria-label="Main navigation">
          {menuLinks.map((link) => (
            <a href="#hero" onClick={() => setMenuOpen(false)} key={link}>
              {link}
            </a>
          ))}
        </nav>
        <footer className="menu-overlay__footer">
          <span>Independent creative studio</span>
          <span>© 2026 Alwayzz</span>
        </footer>
      </div>
    </>
  );
}

function PartnerMarquee() {
  const logos = [...partners, ...partners];
  return (
    <div className="partner-marquee" aria-label="Partner companies">
      <div className="partner-marquee__track">
        {logos.map((partner, index) => (
          <span
            className={`partner-logo partner-logo--${partner.toLowerCase()}`}
            key={`${partner}-${index}`}
          >
            {partner}
          </span>
        ))}
      </div>
    </div>
  );
}

function Index() {
  return (
    <main className="landing-page">
      <Navigation />

      <section className="hero" id="hero">
        <CurveLines position="left" />
        <CurveLines position="right" />
        <CurveLines position="top" />

        <div className="hero__content">
          <ServiceTicker />
          <h1 className="hero__title">
            Premium creative <span className="hero__serif">alwayzz</span>
            <sup>®</sup> on demand.
          </h1>
          <p className="hero__subtitle">
            A flexible design partnership for founders, brands, and agencies who want top craft
            delivered on their timeline.
          </p>
          <div className="hero__actions">
            <a className="primary-cta" href="#plans">
              View Plans
            </a>
            <a className="book-cta" href="#contact">
              <img
                src="https://framerusercontent.com/images/hfneFL6CHBi5BnNvCeOaqU9HqE4.png"
                alt="Alwayzz creative director"
                width="40"
                height="40"
              />
              <span className="book-cta__copy">
                <strong>Chat for 15 minutes</strong>
                <span className="book-cta__slot">
                  <i aria-hidden="true" /> Pick a slot
                </span>
              </span>
            </a>
          </div>
        </div>
        <div className="hero__blur" aria-hidden="true" />
      </section>

      <section className="trusted" aria-label="Trusted companies">
        <div className="trusted__inner">
          <p className="trusted__label">Partnered with top-tier companies globally</p>
          <PartnerMarquee />
        </div>
      </section>
    </main>
  );
}