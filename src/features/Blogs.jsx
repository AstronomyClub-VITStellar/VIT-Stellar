import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { Blogs } from '@/content/blogs';

function BlogModal({ post, onClose }) {
  const [cachedPost, setCachedPost] = useState(post);
  const [phase, setPhase] = useState(post ? "open" : "closed");
  const rafRef = useRef(null);

  useEffect(() => {
    if (post) {
      setCachedPost(post);
      setPhase("entering");
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => setPhase("open"));
        rafRef.current = raf2;
      });
      rafRef.current = raf1;
      return () => cancelAnimationFrame(rafRef.current);
    }
    if (cachedPost) {
      setPhase("closing");
      const t = setTimeout(() => {
        setPhase("closed");
        setCachedPost(null);
      }, 420);
      return () => clearTimeout(t);
    }
  }, [post]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (phase === "closed" || !cachedPost) return null;
  const isOpen = phase === "open";

  return (
    <div
      className={"bp-modal-backdrop" + (isOpen ? " is-open" : "")}
      onClick={onClose}
    >
      <div
        className={"bp-modal" + (isOpen ? " is-open" : "")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bp-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bp-modal-header">
          <h3 id="bp-modal-title" className="bp-modal-title">{cachedPost.title}</h3>
          <div className="bp-modal-header-right">
            {cachedPost.author && <p className="bp-modal-author">By {cachedPost.author}</p>}
            <button
              type="button"
              className="bp-modal-close"
              aria-label="Close"
              onClick={onClose}
            >
              <Icon name="close" />
            </button>
          </div>
        </div>
        <div className="bp-modal-body">
          {(cachedPost.body || "").split("\n").filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogsSection() {
  const items = Blogs.items;
  const total = items.length;

  const [active, setActive] = useState(0);
  const [modalPost, setModalPost] = useState(null);

  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const step = (dir) => setActive((prev) => (prev + dir + total) % total);

  // Only autoplay while the section is actually on screen — same reasoning
  // as the gallery carousel: otherwise `active` keeps advancing while the
  // user is reading something further down the page.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || total <= 1) return;
    const id = setInterval(() => setActive((prev) => (prev + 1 + total) % total), 10000);
    return () => clearInterval(id);
  }, [total, isVisible]);

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
    if (touchDeltaX.current <= -SWIPE_THRESHOLD) step(1);
    else if (touchDeltaX.current >= SWIPE_THRESHOLD) step(-1);
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <div className="bp-wrapper" id="blogs" ref={sectionRef}>
      <div className="bp-shell">
        <div className="bp-heading-row">
          <h2 className="bp-heading">BLOGS</h2>
        </div>

        <div
          className="bp-stage"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((post, i) => {
            let offset = i - active;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
            const dist = Math.abs(offset);
            const hidden = dist > 2;
            const visualDist = Math.min(dist, 2);

            return (
              <div
                className={`bp-card${offset === 0 ? ' is-active' : ''}`}
                key={post.title}
                style={{
                  transform: `translateX(calc(-50% + ${offset * 230}px)) translateY(${visualDist * 26}px) scale(${1 - visualDist * 0.14})`,
                  zIndex: 10 - visualDist,
                  opacity: hidden ? 0 : (dist === 0 ? 1 : Math.max(1 - dist * 0.32, 0.28)),
                  visibility: hidden ? 'hidden' : 'visible',
                  pointerEvents: hidden ? 'none' : 'auto',
                }}
                onClick={() => offset !== 0 && !hidden && setActive(i)}
                aria-hidden={hidden}
              >
                <h3 className="bp-card-title">{post.title}</h3>
                {post.author && <p className="bp-card-author">By {post.author}</p>}
                <div className="bp-card-links">
                  <button
                    type="button"
                    className="bp-card-open-btn"
                    aria-label={`Read ${post.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalPost(post);
                    }}
                  >
                    <Icon name="north_east" />
                  </button>
                </div>
                <div
                  className="bp-card-thumb"
                  style={!post.image ? { background: `radial-gradient(120% 120% at 20% 15%, ${post.accent}33, #14141a 70%)` } : undefined}
                >
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="bp-card-thumb-img" />
                  ) : (
                    <Icon name={post.icon} className="bp-card-thumb-icon" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bp-nav">
          <button type="button" className="bp-nav-btn" onClick={() => step(-1)} aria-label="Previous post">
            <Icon name="arrow_back" />
          </button>
          <button type="button" className="bp-nav-btn" onClick={() => step(1)} aria-label="Next post">
            <Icon name="arrow_forward" />
          </button>
        </div>
      </div>

      <BlogModal post={modalPost} onClose={() => setModalPost(null)} />
    </div>
  );
}

export default BlogsSection;