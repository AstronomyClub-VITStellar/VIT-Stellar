import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { label: "Home",                   href: "#top"          },
  { label: "About Us",               href: "#aboutus"      },
  { label: "Team",                   href: "#team"   },
  // { label: "Merchandise 2026",       href: "#merchandise"  },
  { label: "Gravitas 2026",          href: "#fest"       },
  // { label: "Board Application 2027", href: "#board-application" },
  { label: "Events",                 href: "#events"       },
  { label: "Publications / Blogs",   href: "#publications" },
  { label: "Partners",               href: "#partners"     },
  { label: "Gallery",                href: "#gallery"      },
  { label: "Contact Us",             href: "#contactus"    },
];

// const ANNOUNCEMENT = {
//   show: true,  
//   icon: "shopping_bag",
//   text: "MERCHANDISE 2026 IS LIVE",
//   href: "#merchandise",
// };

const ANNOUNCEMENT = {
  show: true,   
  icon: "festival",
  text: "GRAVITAS 2026",
  href: "#fest",
};

// const ANNOUNCEMENT = {
//   show: true,   
//   icon: "groups",
//   text: "AEROVATE 3.0 TEAM FORMATION",
//   href: "#fest-team-registration",
// };

// const ANNOUNCEMENT = {
//   show: true,   
//   icon: "how_to_reg",
//   text: "BOARD APPLICATION 2027",
//   href: "#fest",
// };

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

/* ══════════════════════════════════════════════════════
   CSS — Header + dropdown menu, one shared stylesheet
   ══════════════════════════════════════════════════════ */
const HEADER_CSS = `
  @import url("https://fonts.googleapis.com/css2?family=Gruppo&display=swap");

  /* Stara-Medium is a licensed/free-for-personal font, not on Google Fonts.
     Download it (Medium weight) into /assets/fonts and this @font-face
     will pick it up. Until then it falls back to Poppins. */
  @font-face {
    font-family: 'Stara-Medium', 'Stara', 'Poppins', sans-serif;
    src: url("/assets/fonts/Stara-Medium.woff2") format("woff2"),
      url("/assets/fonts/Stara-Medium.otf") format("opentype");
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  /* ── Shared icon render ── */
  .tgh-icon {
    font-family: 'Material Icons Round';
    font-weight: normal;
    font-style: normal;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    -webkit-font-smoothing: antialiased;
    user-select: none;
  }

  /* ── Floating pill wrapper — also the anchor for the dropdown below ── */
  .tgh-nav-wrap {
    position: fixed;
    top: 18px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    pointer-events: none;
  }

  /* ── Pill ── */
  .tgh-nav {
    pointer-events: auto;
    position: relative;
    display: grid;
    grid-template-columns: 44px 1fr 44px;
    align-items: center;
    column-gap: 18px;
    width: min(560px, 92vw);
    height: 56px;
    padding: 6px 8px 6px 16px;
    border-radius: 999px;
    font-family: 'Poppins', sans-serif;
    background: rgba(14, 14, 17, 0.82);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 8px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04);
    box-sizing: border-box;
    transition: box-shadow 0.35s ease, border-color 0.35s ease;
  }
  .tgh-nav.scrolled {
    box-shadow: 0 10px 36px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.13);
  }

  /* ══════════════════════════════════════════════════════
     ANNOUNCEMENT CAPSULE — docked under the nav pill.
     Same glass/blur/border language as the pill above it (.tgh-nav),
     so it reads as one continuous floating unit rather than a
     separate banner. No hover states — static, matching the pill.
     ══════════════════════════════════════════════════════ */
  .tgh-announce-connector {
    width: 2px;
    height: 7px;
    flex-shrink: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.22), rgba(216,150,158,0.6));
    pointer-events: none;
  }

  .tgh-announce {
    pointer-events: auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    max-width: min(480px, 90vw);
    padding: 7px 8px 7px 15px;
    border-radius: 999px;
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    background: rgba(14, 14, 17, 0.82);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 8px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04);
    box-sizing: border-box;
  }

  .tgh-announce-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: #d9959e;
    flex-shrink: 0;
  }
  .tgh-announce-icon svg { width: 16px; height: 16px; }

  .tgh-announce-text {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.045em;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
  }

  .tgh-announce-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    color: #fff;
    flex-shrink: 0;
  }
  .tgh-announce-arrow svg { width: 12px; height: 12px; }

  @media (max-width: 420px) {
    .tgh-announce { padding: 6px 7px 6px 12px; gap: 8px; }
    .tgh-announce-text { font-size: 10.5px; }
    .tgh-announce-arrow { width: 22px; height: 22px; }
  }

  /* ── New VIT logo — far left, overlaid on the pill so its size isn't
     constrained by the 44px grid track (which still reserves balancing
     space so the centered brand doesn't shift) ── */
  .tgh-left-logo {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 96px;
    flex-shrink: 0;
    pointer-events: none;
    z-index: 1;
  }
  .tgh-left-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  /* ── Brand / logo — left ── */
  .tgh-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    justify-self: center;
    grid-column: 2;
    gap: 9px;
    flex-shrink: 0;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }
  .tgh-brand-mark {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .tgh-brand-mark img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .tgh-brand-name {
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.015em;
    white-space: nowrap;
  }

  /* ── Right side — icon-only trigger ── */
  .tgh-nav-cta {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    justify-self: end;
    grid-column: 3;
    gap: 8px;
    flex-shrink: 0;
  }

  .tgh-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: transparent;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s ease, transform 0.1s ease;
  }
  .tgh-icon-btn:hover  { background: rgba(255,255,255,0.08); }
  .tgh-icon-btn:active { transform: scale(0.94); }
  .tgh-icon-btn .tgh-icon { font-size: 18px; color: #fff; }

  .tgh-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.06);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.1);
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 0 16px;
    height: 44px;
    border-radius: 999px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s ease, border-color 0.15s ease;
  }
  .tgh-back-btn:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.2); }
  .tgh-back-btn .tgh-icon { font-size: 15px; }

  /* ── Hamburger glyph (drawn, not text) — morphs into an X when open,
     since it now doubles as the close control for the dropdown ── */
  .tgh-ham-icon {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    align-items: flex-end;
    width: 28px;
    height: 14px;
  }
  .tgh-ham-icon span {
    display: block;
    height: 2px;
    background: #fff;
    border-radius: 2px;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s ease, opacity 0.2s ease;
  }
  .tgh-ham-icon span:nth-child(1) { width: 28px; }
  .tgh-ham-icon span:nth-child(2) { width: 19px; }
  .tgh-ham-icon span:nth-child(3) { width: 24px; }

  .tgh-ham-icon.tgh-ham-open span {
    width: 24px;
  }
  .tgh-ham-icon.tgh-ham-open span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .tgh-ham-icon.tgh-ham-open span:nth-child(2) {
    opacity: 0;
  }
  .tgh-ham-icon.tgh-ham-open span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  /* ── Dimmed backdrop behind the dropdown — click to close.
     Sits outside the (transformed) nav wrap so it can cover the
     full viewport; the panel itself lives inside the wrap so it's
     truly anchored to the header, not a free-floating modal. ── */
  .tgh-menu-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1950;
    background: rgba(8, 8, 10, 0.55);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear 0.4s;
  }
  .tgh-menu-backdrop.tgh-menu-open {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear 0s;
  }

  /* ── Dropdown panel — anchored directly under the pill, inside the
     same fixed/centered wrap, so it moves and centers with the header
     instead of behaving like a separate popup window. ── */
  .tgh-menu-panel {
    position: absolute;
    top: calc(100% + 12px);
    left: 50%;
    width: min(940px, 92vw);
    z-index: 2000;
    container-type: inline-size;
    border-radius: 26px;
    overflow: hidden;
    background-color: #1e1e1e;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.07);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform-origin: top center;
    transform: translateX(-50%) translateY(-14px) scaleY(0.95);
    filter: blur(4px);
    /* Closing ("dropup") — a standard, continuous ease (no dead-stop
       start/end) with only a light delay so the panel starts folding
       almost right alongside the row cascade instead of visibly pausing
       and then moving. visibility flips once the whole cascade is done. */
    transition:
      opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.06s,
      transform 0.32s cubic-bezier(0.4, 0, 0.2, 1) 0.06s,
      filter 0.3s ease 0.06s,
      visibility 0s linear 0.39s;
  }
  .tgh-menu-panel.tgh-menu-open {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0) scaleY(1);
    filter: blur(0px);
    transition-delay: 0.05s;
    transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      filter 0.35s ease;
  }
  @media (max-width: 480px) {
    .tgh-menu-panel { width: 94vw; }
  }

  /* ── Stage — the Figma 2000:954 composition, scaled to the panel ──
     Background image: drop your file at /assets/bg/bg.jpg (or update
     the path below to match whatever you name it). background-color
     stays as a fallback while the image loads / if it's missing. */
  .tgm-stage {
    position: relative;
    width: 100%;
    aspect-ratio: 2000 / 954;
    overflow: hidden;
    background-color: #1e1e1e;
  }

  /* ── Hero background — positions/assets ported 1:1 from the real
     .stellar-hero-canvas in Main.jsx (2000px-wide reference frame,
     same px/2000*100 → cqw conversion used there), so this dropdown's
     art matches the actual page hero exactly. No starfield layers or
     hairline divider here — the real hero doesn't have them either,
     it's just these images over the flat page background. ── */
  .tgm-hero {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    filter: blur(0.5cqw);
    transform: scale(1.03) translateY(-11%);
  }
  .tgm-hero-title {
    position: absolute;
    left: 31.7cqw;
    top: 15.15cqw;
    width: 38.8cqw;
    height: 17.65cqw;
    object-fit: contain;
    mix-blend-mode: screen;
  }
  .tgm-hero-word-astronomy {
    position: absolute;
    left: 32.05cqw;
    top: 31.5cqw;
    margin: 0;
    font-family: 'Gruppo', sans-serif;
    font-size: 1.4cqw;
    color: #fff;
    letter-spacing: 0.07cqw;
    white-space: nowrap;
  }
  .tgm-hero-word-club {
    position: absolute;
    left: 63.5cqw;
    top: 31.5cqw;
    margin: 0;
    font-family: 'Gruppo', sans-serif;
    font-size: 1.4cqw;
    color: #fff;
    letter-spacing: 0.07cqw;
    white-space: nowrap;
  }
  .tgm-hero-centerpiece {
    position: absolute;
    left: 10.5cqw;
    top: 12.5cqw;
    width: 84.3cqw;
    height: 40.2cqw;
  }
  .tgm-hero-centerpiece img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: bottom;
    max-width: none;
  }
  .tgm-hero-deco-blackhole { position: absolute; right: 4.75cqw; top: 14cqw; width: 4.9cqw; height: 5.75cqw; overflow: hidden; }
  .tgm-hero-deco-blackhole img { position: absolute; left: 0; top: -19.31%; width: 100%; height: 119.33%; max-width: none; }
  .tgm-hero-label-blackhole { position: absolute; left: 90.3cqw; top: 20.25cqw; margin: 0; font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 1cqw; color: #fff; white-space: nowrap; }

  .tgm-hero-deco-asteroid { position: absolute; right: 16cqw; top: 23cqw; width: 5.3cqw; height: 7.05cqw; }
  .tgm-hero-deco-asteroid img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; max-width: none; }
  .tgm-hero-label-asteroid { position: absolute; left: 79.25cqw; top: 30.25cqw; margin: 0; font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 1cqw; color: #fff; white-space: nowrap; }

  .tgm-hero-deco-moon { position: absolute; left: 17.85cqw; top: 25.5cqw; width: 4.85cqw; height: 4.85cqw; }
  .tgm-hero-deco-moon img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: bottom; max-width: none; }
  .tgm-hero-label-moon { position: absolute; left: 19cqw; top: 30.5cqw; margin: 0; font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 1cqw; color: #fff; white-space: nowrap; }

  .tgm-hero-deco-nebula { position: absolute; left: 4.95cqw; top: 13.35cqw; width: 5.6cqw; height: 6.8cqw; overflow: hidden; }
  .tgm-hero-deco-nebula img { position: absolute; left: -9.43%; top: -19.7%; width: 113.76%; height: 149.43%; max-width: none; }
  .tgm-hero-label-nebula { position: absolute; left: 3cqw; top: 20.45cqw; margin: 0; font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 1cqw; color: #fff; white-space: nowrap; }

  .tgm-hero-deco-saturn { position: absolute; right: 4.75cqw; top: 35cqw; width: 5.3cqw; height: 5.35cqw; }
  .tgm-hero-deco-saturn img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: bottom; max-width: none; }
  .tgm-hero-label-saturn { position: absolute; left: 91.25cqw; top: 40.5cqw; margin: 0; font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 1cqw; color: #fff; white-space: nowrap; }

  .tgm-hero-deco-artemis { position: absolute; left: 4.95cqw; top: 35cqw; width: 5.45cqw; height: 5.75cqw; }
  .tgm-hero-deco-artemis img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: bottom; max-width: none; }
  .tgm-hero-label-artemis { position: absolute; left: 5.25cqw; top: 41cqw; margin: 0; font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 1cqw; color: #fff; white-space: nowrap; }

  /* gradient + inner shadow overlay */
  .tgm-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: linear-gradient(
      115.1059889185485deg,
      rgba(0, 0, 0, 0.3) 27.251%,
      rgba(30, 0, 1, 0.3) 77.656%
    );
    box-shadow: inset 0px 0.2cqw 9cqw 0px rgba(23, 23, 23, 0.08);
  }

  /* big rotated divider separating nav column from hero art */
  .tgm-vertical-line {
    position: absolute;
    top: 2.25cqw;
    left: 39cqw;
    width: 0.05cqw;
    height: 43.2cqw;
    background-color: rgba(255, 255, 255, 0.4);
    pointer-events: none;
  }

  .tgm-links {
    position: absolute;
    inset: 0;
  }

  /* dividers — fade/expand in, staggered per-row via inline transitionDelay */
  .tgm-divider {
    position: absolute;
    height: 0.05cqw;
    background-color: rgba(255, 255, 255, 0.4);
    pointer-events: none;
    opacity: 0;
    transform: scaleX(0);
    transform-origin: left center;
    /* closing — quick, continuous collapse (standard ease, not a hard accelerate) */
    transition: opacity 0.2s ease, transform 0.24s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .tgh-menu-panel.tgh-menu-open .tgm-divider {
    opacity: 1;
    transform: scaleX(1);
    transition: opacity 0.4s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* row — the hoverable strip for one nav item. Slides/fades in on open
     (staggered via inline transitionDelay). No background change on
     hover — only the arrow icon grows in from the left, pushing the
     label rightward. */
  .tgm-row {
    position: absolute;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
    opacity: 0;
    transform: translateX(-1cqw);
    /* closing — quick, continuous retreat (standard ease, not a hard accelerate) */
    transition:
      opacity 0.22s ease,
      transform 0.26s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .tgh-menu-panel.tgh-menu-open .tgm-row {
    opacity: 1;
    transform: translateX(0);
    transition:
      opacity 0.45s ease,
      transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* arrow icon — collapsed to zero width by default (label sits flush
     left); on hover it grows in, pushing the label to the right */
  .tgm-row-arrow {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 0;
    margin-right: 0;
    overflow: hidden;
    color: #ffffff;
    opacity: 0;
    transition:
      width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
      margin-right 0.35s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.25s ease;
  }
  .tgm-row-arrow svg {
    display: block;
    width: 1.1cqw;
    height: 1.1cqw;
    flex: 0 0 auto;
  }
  .tgm-row:hover .tgm-row-arrow,
  .tgm-row:focus-visible .tgm-row-arrow {
    width: 1.1cqw;
    margin-right: 0.5cqw;
    opacity: 1;
  }

  /* label */
  .tgm-link {
    display: block;
    font-family: 'Stara-Medium', 'Stara', 'Poppins', sans-serif;
    font-weight: 500;
    font-style: normal;
    font-size: 1.6cqw;
    line-height: normal;
    color: #ffffff;
    white-space: nowrap;
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .tgh-nav { gap: 10px; padding: 6px 6px 6px 12px; }
    .tgh-brand-name { font-size: 14px; }
    .tgh-brand { margin-left: 38px; }
  }
  @media (max-width: 360px) {
    .tgh-brand-name { display: none; }
    .tgh-brand { margin-left: 20px; }
  }

  /* ── Mobile dropdown — the desktop layout locks the panel to a fixed
     2000:954 aspect ratio and positions every row with Figma pixel
     coordinates converted to cqw, which is great for the wide desktop
     composition but crushes the nav rows into a sliver of vertical space
     on narrow screens (rows + text shrink together with the width).
     Below 768px we drop the aspect-ratio lock entirely: the hero art
     collapses into a short static banner, the nav rows fall into a
     normal stacked flex column, and the panel grows to whatever height
     the content needs (scrolling internally if it's taller than the
     viewport). !important is required here because the row/divider
     positions above are set via inline styles (top/left/width/height),
     which only a stylesheet !important rule can override. ── */
  @media (max-width: 768px) {
    .tgh-menu-panel { width: 92vw; }

    .tgm-stage {
      aspect-ratio: unset !important;
      height: auto !important;
      max-height: calc(100vh - 110px);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }

    /* Hero art removed entirely on mobile — no title graphic, no
       astronaut centerpiece, no orbiting decor, no overlay/divider.
       The dropdown is just the nav list, so the panel stays compact
       and there's nothing competing with the links for attention. */
    .tgm-hero,
    .tgm-overlay,
    .tgm-vertical-line {
      display: none !important;
    }

    /* Panel background swaps from the flat #1e1e1e to the hero art
       itself, dimmed with a dark gradient so the nav text stays legible
       on top of it. */
    .tgm-stage {
      background-image:
        linear-gradient(180deg, rgba(10, 10, 14, 0.65), rgba(10, 10, 14, 0.9)),
        url("/assets/hero/Center.webp");
      background-size: cover;
      background-position: center top;
      background-repeat: no-repeat;
    }

    /* Nav rows — from absolutely-positioned Figma slots to a plain
       stacked column, each row given real height/padding so the label
       and tap target are both comfortably legible/reachable. */
    .tgm-links {
      position: static !important;
      display: flex !important;
      flex-direction: column !important;
      padding: 2px 0 10px !important;
    }
    .tgm-divider {
      position: static !important;
      top: auto !important;
      left: auto !important;
      width: calc(100% - 40px) !important;
      height: 1px !important;
      margin: 0 20px !important;
    }
    .tgm-row {
      position: static !important;
      top: auto !important;
      left: auto !important;
      width: 100% !important;
      height: auto !important;
      min-height: 58px !important;
      padding: 16px 20px !important;
      box-sizing: border-box !important;
    }
    .tgm-link { font-size: 16px !important; }
    .tgm-row-arrow {
      width: 16px !important;
      margin-right: 10px !important;
      opacity: 0.75 !important;
    }
    .tgm-row-arrow svg { width: 16px !important; height: 16px !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    .tgh-menu-backdrop, .tgh-menu-panel, .tgm-divider, .tgm-row, .tgm-row-arrow, .tgm-link {
      transition-duration: 0.01ms !important;
      transition-delay: 0s !important;
      filter: none !important;
      transform: none !important;
    }
  }
`;

/**
 * Header
 *
 * Central, reusable site header rendered as a floating pill centered at
 * the top of the page. Drop this into any page:
 *
 *   <Header
 *     onTrySudarshanaa={() => navigate('/signup')}
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
 * - Automatically swaps the hamburger for a "Back to Home" pill on
 *   /login and /signup routes.
 * - Fully self-contained styling (no external CSS files needed).
 */
export default function Header({ onTrySudarshanaa, onScrollToSection }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  const isLoginPage = location.pathname === "/login" || location.pathname === "/signup";

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
      <style>{HEADER_CSS}</style>

      {/* Dimmed backdrop behind the dropdown — click to close.
          Lives outside the transformed nav wrap so it can cover the
          full viewport correctly. */}
      {!isLoginPage && (
        <div
          className={`tgh-menu-backdrop${menuOpen ? ' tgh-menu-open' : ''}`}
          aria-hidden={!menuOpen}
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="tgh-nav-wrap">
        <nav className={`tgh-nav${scrolled ? " scrolled" : ""}`}>

          {/* ── New VIT logo — far left, separate from the centered brand ── */}
          <span className="tgh-left-logo">
            <img src="/assets/vit-logo.svg" alt="VIT logo" />
          </span>

          {/* ── Brand — center ── */}
          <Link to="/" className="tgh-brand" onClick={handleBrandClick}>
            <span className="tgh-brand-mark">
              <img src="/assets/logo.webp" alt="logo" />
            </span>
            <span className="tgh-brand-name">VIT STELLAR</span>
          </Link>

          {/* ── Right trigger ── */}
          <div className="tgh-nav-cta">
            {isLoginPage ? (
              <button className="tgh-back-btn" onClick={() => navigate("/")}>
                <span className="tgh-icon" style={{ fontSize: "14px" }}>arrow_back</span>
                Back to Home
              </button>
            ) : (
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
            )}
          </div>

        </nav>

        {/* ── Announcement capsule — docked just under the pill ── */}
        {!isLoginPage && ANNOUNCEMENT.show && (
          <>
            <span className="tgh-announce-connector" aria-hidden="true" />
            <a
              href={ANNOUNCEMENT.href}
              className="tgh-announce"
              onClick={(e) => handleItemClick(e, ANNOUNCEMENT.href)}
            >
              <span
                className="tgh-icon tgh-announce-icon"
                style={{ fontSize: "16px" }}
                aria-hidden="true"
              >
                {ANNOUNCEMENT.icon}
              </span>
              <span className="tgh-announce-text">{ANNOUNCEMENT.text}</span>
              <span className="tgh-announce-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </>
        )}

        {/* ── Dropdown panel — anchored under the pill, part of the header ── */}
        {!isLoginPage && (
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
                  const slot = ROW_SLOTS[i % ROW_SLOTS.length];
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
                          height: toVw(rowHeightFor(i % ROW_SLOTS.length)),
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
        )}
      </div>
    </>
  );
}