import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFeatures } from '@/hooks/useFeatures';
import './Header.css';

// ── Menu links ──────────────────────────────────────────────────────
// Set `show: true` to list a section in the menu, `show: false` to hide it.
// The desktop menu art has exactly 9 row slots, so keep AT MOST 9 links set
// to `show: true` (extra ones are ignored, see MAX_NAV_LINKS below).
// This only controls the menu — whether a section is rendered on the page
// itself is still decided in LandingPage.jsx / the `features` table in Supabase.
const ALL_NAV_LINKS = [
  { label: "Home",                   href: "#top",               show: true  },
  { label: "About Us",               href: "#aboutus",           show: true  },
  { label: "Team",                   href: "#team",              show: true  },
  { label: "Merchandise 2026",       href: "#merchandise",       show: false },
  { label: "Gravitas 2026",          href: "#fest",              show: true  },
  { label: "Board Application 2027", href: "#board-application", show: false },
  { label: "Domain Selection",       href: "#domain-selection",  show: false },
  { label: "Events",                 href: "#events",            show: true  },
  { label: "Publications / Blogs",   href: "#publications",      show: true  },
  { label: "Partners",               href: "#partners",          show: true  },
  { label: "Gallery",                href: "#gallery",           show: true  },
  { label: "Contact Us",             href: "#contactus",         show: true  },
];

const img = {
  heroTitle: "/assets/hero/stellar.webp",
  centerpiece: "/assets/hero/Center.webp",
  blackHole: "/assets/hero/Black Hole.webp",
  asteroid: "/assets/hero/Asteroid.webp",
  moon: "/assets/hero/Moon.webp",
  nebula: "/assets/hero/Nebula in Andromeda.webp",
  saturn: "/assets/hero/Saturn.webp",
  artemis: "/assets/hero/Artemis II.webp",
};

const ROW_SLOTS = [
  { dividerTop: 120, linkTop: 140, linkLeft: 145 },
  { dividerTop: 203, linkTop: 223, linkLeft: 145 },
  { dividerTop: 286, linkTop: 306, linkLeft: 145 },
  { dividerTop: 370, linkTop: 390, linkLeft: 145 },
  { dividerTop: 452, linkTop: 472, linkLeft: 147 },
  { dividerTop: 540, linkTop: 560, linkLeft: 146 },
  { dividerTop: 621, linkTop: 641, linkLeft: 146 },
  { dividerTop: 701, linkTop: 721, linkLeft: 145 },
  { dividerTop: 784, linkTop: 804, linkLeft: 146 },
];
const MAX_NAV_LINKS = ROW_SLOTS.length;

const VISIBLE_NAV_LINKS = ALL_NAV_LINKS.filter((link) => link.show);
if (import.meta.env.DEV && VISIBLE_NAV_LINKS.length > MAX_NAV_LINKS) {
  console.warn(
    `[Header] ${VISIBLE_NAV_LINKS.length} menu links are set to show: true, but the menu only fits ${MAX_NAV_LINKS}. ` +
    `Extra links were dropped — set show: false on some of them.`
  );
}
// Never render more rows than there are slots, so rows can't overlap.
const NAV_LINKS = VISIBLE_NAV_LINKS.slice(0, MAX_NAV_LINKS);

const CLOSING_DIVIDER_TOP = 861;
const DIVIDER_LEFT = 146;
const DIVIDER_WIDTH = 437;

// Height of the hover surface for row i = distance to the next row's
// divider (or the closing divider for the last row).
const rowHeightFor = (i) => {
  const nextTop = ROW_SLOTS[i + 1] ? ROW_SLOTS[i + 1].dividerTop : CLOSING_DIVIDER_TOP;
  return nextTop - ROW_SLOTS[i].dividerTop;
};

// Figma frame reference width (2000px) — every position/size below is
// expressed as cqw (px / 2000 * 100) so the composition scales to the
// panel's own width (via CSS container queries) rather than the full
// viewport, while keeping the exact proportions.
const FRAME_WIDTH = 2000;
const toVw = (px) => `${((px / FRAME_WIDTH) * 100).toFixed(3)}cqw`;

// Stagger timing for the nav rows cascading in on open.
const STAGGER_BASE = 0.18;
const STAGGER_STEP = 0.045;

// Stagger timing for the nav rows cascading OUT on close — reversed
// (bottom row leaves first, top row leaves last), quick and tight so the
// collapse reads as one continuous sweep rather than separate stages.
const CLOSE_STAGGER_STEP = 0.018;

// Delay (seconds) for row/divider index `i` — opening cascades top→bottom,
// closing cascades bottom→top (reversed) and faster.
const rowDelay = (i, open) =>
  open
    ? `${(STAGGER_BASE + i * STAGGER_STEP).toFixed(3)}s`
    : `${((NAV_LINKS.length - 1 - i) * CLOSE_STAGGER_STEP).toFixed(3)}s`;


/**
 * Header
 *
 * Central, reusable site header rendered as a floating pill centered at
 * the top of the page. Drop this into any page:
 *
 *   <Header
 *     onScrollToSection={(href) => ...}   // optional, defaults to scrollIntoView
 *   />
 *
 * - Renders the brand mark + wordmark on the left, and a single round
 *   hamburger trigger on the right. Clicking it opens a dropdown panel
 *   anchored directly under the pill (not a separate full-page popup) —
 *   the space-themed nav (hero art, black hole, orbiting planets +
 *   cascading links) lives inline in this same file/component, so it's
 *   structurally part of the header rather than an independent overlay.
 *   The hamburger itself morphs into an X and doubles as the close
 *   control; clicking the dimmed backdrop or pressing Escape also closes.
 * - Styling lives in ./Header.css.
 */
export default function Header({ onScrollToSection }) {
  const location  = useLocation();
  const { announcement } = useFeatures();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  /* scroll listener — target the .tg-landing overflow container if present, else window */
  useEffect(() => {
    const container = document.querySelector(".tg-landing");
    if (container) {
      const onScroll = () => setScrolled(container.scrollTop > 5);
      container.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => container.removeEventListener("scroll", onScroll);
    }
    const onWindowScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    onWindowScroll();
    return () => window.removeEventListener("scroll", onWindowScroll);
  }, []);

  /* close menu on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /* lock page scroll while the dropdown is open */
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, [menuOpen]);

  /* close on Escape */
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const handleAnchor = (href) => {
    if (href === "#top") {
      const container = document.querySelector(".tg-landing");
      if (container) container.scrollTo({ top: 0, behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (onScrollToSection) {
      onScrollToSection(href);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleItemClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    handleAnchor(href);
  };

  /* clicking the logo/brand should always take you to the top of the
     home page — if we're already there, just smooth-scroll to top
     instead of doing nothing (or a full route no-op) */
  const handleBrandClick = (e) => {
    setMenuOpen(false);
    if (location.pathname === "/") {
      e.preventDefault();
      handleAnchor("#top");
    }
    // otherwise, let the <Link> navigate to "/" normally
  };

  return (
    <>

      {/* Dimmed backdrop behind the dropdown — click to close.
          Lives outside the transformed nav wrap so it can cover the
          full viewport correctly. */}
      <div
        className={`tgh-menu-backdrop${menuOpen ? ' tgh-menu-open' : ''}`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <div className="tgh-nav-wrap">
        <nav className={`tgh-nav${scrolled ? " scrolled" : ""}`}>

          {/* ── New VIT logo — far left, separate from the centered brand ── */}
          <span className="tgh-left-logo">
            <img src="/assets/logos/vit-logo.svg" alt="VIT logo" />
          </span>

          {/* ── Brand — center ── */}
          <Link to="/" className="tgh-brand" onClick={handleBrandClick}>
            <span className="tgh-brand-mark">
              <img src="/assets/logos/logo.webp" alt="logo" />
            </span>
            <span className="tgh-brand-name">VIT STELLAR</span>
          </Link>

          {/* ── Right trigger ── */}
          <div className="tgh-nav-cta">
            <button
              className="tgh-icon-btn"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span className={`tgh-ham-icon${menuOpen ? ' tgh-ham-open' : ''}`}>
                <span /><span /><span />
              </span>
            </button>
          </div>

        </nav>

        {/* ── Announcement capsule — docked just under the pill ── */}
        {announcement.show && (
          <>
            <span className="tgh-announce-connector" aria-hidden="true" />
            <a
              href={announcement.href}
              className="tgh-announce"
              onClick={(e) => handleItemClick(e, announcement.href)}
            >
              <span
                className="tgh-icon tgh-announce-icon"
                style={{ fontSize: "16px" }}
                aria-hidden="true"
              >
                {announcement.icon}
              </span>
              <span className="tgh-announce-text">{announcement.text}</span>
              <span className="tgh-announce-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </>
        )}

        {/* ── Dropdown panel — anchored under the pill, part of the header ── */}
        <div
          className={`tgh-menu-panel${menuOpen ? ' tgh-menu-open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-hidden={!menuOpen}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="tgm-stage">
            {/* ===== Hero background ===== */}
            <div className="tgm-hero">
              <img className="tgm-hero-title" src={img.heroTitle} alt="STELLAR" />
              <p className="tgm-hero-word-astronomy">ASTRONOMY</p>
              <p className="tgm-hero-word-club">CLUB VIT</p>

              <div className="tgm-hero-centerpiece"><img src={img.centerpiece} alt="Astronaut floating in space" /></div>

              <div className="tgm-hero-deco-blackhole"><img src={img.blackHole} alt="Black hole" /></div>
              <p className="tgm-hero-label-blackhole">Black Hole</p>

              <div className="tgm-hero-deco-asteroid"><img src={img.asteroid} alt="Asteroid" /></div>
              <p className="tgm-hero-label-asteroid">Asteroid</p>

              <div className="tgm-hero-deco-moon"><img src={img.moon} alt="Moon" /></div>
              <p className="tgm-hero-label-moon">Moon</p>

              <div className="tgm-hero-deco-nebula"><img src={img.nebula} alt="Nebula in Andromeda" /></div>
              <p className="tgm-hero-label-nebula">Nebula in Andromeda</p>

              <div className="tgm-hero-deco-saturn"><img src={img.saturn} alt="Saturn" /></div>
              <p className="tgm-hero-label-saturn">Saturn</p>

              <div className="tgm-hero-deco-artemis"><img src={img.artemis} alt="Artemis II" /></div>
              <p className="tgm-hero-label-artemis">Artemis II</p>
            </div>

            <div className="tgm-overlay" />
            <div className="tgm-vertical-line" />

            <nav className="tgm-links" aria-label="Main navigation">
              {NAV_LINKS.map((link, i) => {
                const slot = ROW_SLOTS[i];
                const delay = rowDelay(i, menuOpen);
                return (
                  <div key={link.href + link.label}>
                    <div
                      className="tgm-divider"
                      style={{
                        top: toVw(slot.dividerTop),
                        left: toVw(DIVIDER_LEFT),
                        width: toVw(DIVIDER_WIDTH),
                        transitionDelay: delay,
                      }}
                    />
                    <a
                      href={link.href}
                      className="tgm-row"
                      style={{
                        top: toVw(slot.dividerTop),
                        left: toVw(DIVIDER_LEFT),
                        width: toVw(DIVIDER_WIDTH),
                        height: toVw(rowHeightFor(i)),
                        paddingTop: toVw(slot.linkTop - slot.dividerTop),
                        transitionDelay: delay,
                      }}
                      onClick={(e) => handleItemClick(e, link.href)}
                    >
                      <span className="tgm-row-arrow" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="tgm-link">{link.label}</span>
                    </a>
                  </div>
                );
              })}
              <div
                className="tgm-divider"
                style={{
                  top: toVw(CLOSING_DIVIDER_TOP),
                  left: toVw(DIVIDER_LEFT),
                  width: toVw(DIVIDER_WIDTH),
                  transitionDelay: menuOpen
                    ? `${(STAGGER_BASE + NAV_LINKS.length * STAGGER_STEP).toFixed(3)}s`
                    : '0s',
                }}
              />
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}