import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { Publications } from '@/content/publications';

function PublicationCard({ pub, reverse = false, onOpen }) {
  const thumb = (
    <div
      className="pub-card-thumb"
      style={!pub.image ? { background: `radial-gradient(120% 120% at 20% 15%, ${pub.accent}33, #14141a 70%)` } : undefined}
    >
      {pub.image ? (
        <img src={pub.image} alt={pub.title} className="pub-card-thumb-img" />
      ) : (
        <Icon name={pub.icon} className="pub-card-thumb-icon" />
      )}
    </div>
  );
  const openBtn = pub.file && (
    <a
      href={pub.file}
      target="_blank"
      rel="noopener noreferrer"
      className="pub-card-open-btn"
      aria-label={`Open ${pub.title} in a new tab`}
    >
      <Icon name="north_east" />
    </a>
  );

  if (reverse) {
    return (
      <div className="pub-card pub-card-reverse">
        <h3 className="pub-card-title">{pub.title}</h3>
        {pub.author && <p className="pub-card-author">By {pub.author}</p>}
        <div className="pub-card-links">
          <button
            type="button"
            className="pub-card-open-btn"
            aria-label={`Read ${pub.title}`}
            onClick={() => onOpen && onOpen(pub)}
          >
            <Icon name="north_east" />
          </button>
        </div>
        {thumb}
      </div>
    );
  }

  return (
    <div className="pub-card">
      {thumb}
      <h3 className="pub-card-title">{pub.title}</h3>
      <p className="pub-card-desc">{pub.desc}</p>
      <div className="pub-card-links">{openBtn}</div>
    </div>
  );
}

// Desktop: scroll-linked split layout. The right-hand banner and the left-hand
// details swap to the next publication as the section scrolls through the
// viewport — the section's own height controls how much scroll each
// publication "owns" before the next one takes over.
function PublicationsSticky({ items }) {
  const total = items.length;
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [trackOffset, setTrackOffset] = useState(0);

  // Each card is shorter than the viewport on purpose, so the next card's
  // rounded top edge peeks in below the current one, with a real gap between.
  const CARD_HEIGHT = 500;
  const CARD_GAP = 32;
  const STEP = CARD_HEIGHT + CARD_GAP;

  useEffect(() => {
    let rafId;
    let lastIndex = -1;

    const tick = () => {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        if (scrollable > 0) {
          const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
          const rawOffset = Math.min(total - 1, progress * total);
          setTrackOffset(rawOffset);

          const idx = Math.min(total - 1, Math.round(rawOffset));
          if (idx !== lastIndex) {
            lastIndex = idx;
            setActiveIndex(idx);
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [total]);

  const goTo = (i) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const sectionTop = rect.top + scrollTop;
    const scrollable = rect.height - window.innerHeight;
    const target = sectionTop + (scrollable * (i + 0.5)) / total;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <div
      className="pub-sticky-desktop"
      ref={sectionRef}
      style={{ "--pub-steps": total }}
    >
      <div className="pub-sticky-view">
        <div className="pub-sticky-left">
          <h2 className="pub-heading pub-heading-left">PUBLICATIONS</h2>

          {/* Each item owns its own collapsible detail slot, directly below
              its heading. Opening it grows real layout height, so every
              heading beneath it is pushed down as it opens/closes — and the
              connector always drops from that specific heading. */}
          <ul className="pub-nav-list">
            {items.map((p, i) => {
              const isActive = i === activeIndex;
              return (
                <li
                  key={p.title + i}
                  className={"pub-nav-item" + (isActive ? " is-active" : "")}
                >
                  <div className="pub-nav-row" onClick={() => goTo(i)}>
                    <Icon name="arrow_forward" className="pub-nav-marker" />
                    {p.title}
                  </div>

                  <div className={"pub-detail-collapse" + (isActive ? " is-open" : "")}>
                    <div className="pub-detail-collapse-inner">
                      <span className="pub-connector-line" />
                      <span className="pub-connector-dot" />
                      <div className="pub-detail-slide">
                        <div className="pub-detail-text">
                          {p.author && <p className="pub-detail-author">By {p.author}</p>}
                          {p.desc && <p className="pub-detail-desc">{p.desc}</p>}
                        </div>
                        {p.file && (
                          <a
                            href={p.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pub-detail-open-btn"
                            aria-label={`Read ${p.title}`}
                          >
                            <Icon name="north_east" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="pub-sticky-right">
          <div
            className="pub-banner-track"
            style={{ transform: `translateY(${-trackOffset * STEP}px)` }}
          >
            {items.map((p, i) => (
              <div
                key={p.title + i}
                className="pub-banner-card"
                style={{ height: CARD_HEIGHT }}
              >
                {p.image ? (
                  <img src={p.image} alt={p.title} />
                ) : (
                  <Icon name={p.icon} className="pub-card-thumb-icon" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PublicationsSection() {
  const total = Publications.items.length;
  const [activePub, setActivePub] = useState(0);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const stepPub = (dir) => setActivePub((prev) => (prev + dir + total) % total);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const handleTouchEnd = () => {
    const SWIPE_THRESHOLD = 40;
    if (touchDeltaX.current <= -SWIPE_THRESHOLD) stepPub(1);
    else if (touchDeltaX.current >= SWIPE_THRESHOLD) stepPub(-1);
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <div className="pub-wrapper" id="publications">
      <PublicationsSticky items={Publications.items} />

      <div className="pub-mobile-fallback">
        <h2 className="pub-heading">PUBLICATIONS</h2>
        <div className="pub-mobile-carousel">
          <button
            type="button"
            className="gallery-nav-btn"
            onClick={() => stepPub(-1)}
            aria-label="Previous publication"
          >
            <Icon name="arrow_back" />
          </button>

          <div
            className="pub-mobile-card-slot"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <PublicationCard pub={Publications.items[activePub]} key={Publications.items[activePub].title} />
          </div>

          <button
            type="button"
            className="gallery-nav-btn"
            onClick={() => stepPub(1)}
            aria-label="Next publication"
          >
            <Icon name="arrow_forward" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublicationsSection;