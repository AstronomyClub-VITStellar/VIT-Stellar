import React, { useState, useRef, useEffect } from 'react';
import { Testimonials } from '@/content/testimonials';

const TESTIMONIAL_SCATTER = [
  { x: 90, y: 150, r: -8, z: 1 },
  { x: -10, y: 90, r: 4, z: 4 },
  { x: -110, y: 140, r: 9, z: 3 },
  { x: 70, y: -70, r: -4, z: 5 },
  { x: -15, y: -95, r: -7, z: 6 },
  { x: -90, y: -55, r: 6, z: 2 },
];

function TestimonialGridCard({ item, scatter }) {
  return (
    <div
      className={`testi-card testi-card-${item.color}`}
      style={{
        "--testi-x": `${scatter.x}px`,
        "--testi-y": `${scatter.y}px`,
        "--testi-r": `${scatter.r}deg`,
        zIndex: scatter.z,
      }}
    >
      <span className="testi-quote-mark">&#8220;</span>
      <p className="testi-quote">{item.quote}</p>
      <div className="testi-card-foot">
        <div className="testi-avatar" style={{ background: item.avatarBg }}>
          <img src={item.photo} alt={item.name} loading="lazy" />
        </div>
        <div className="testi-who">
          <div className="testi-name">{item.name}</div>
          <div className="testi-role">{item.role}</div>
        </div>
      </div>
    </div>
  );
}

function TestimonialTrailCard({ item, diff, total }) {
  const tx = diff * 26;
  const ty = diff * 22;
  const scale = Math.max(1 - diff * 0.06, 0.8);
  const opacity = diff === 0 ? 1 : diff === 1 ? 0.7 : diff === 2 ? 0.4 : 0;

  return (
    <div
      className={`testi-card testi-card-${item.color}${diff === 0 ? " testi-card-active" : ""}`}
      style={{
        "--testi-tx": `${tx}px`,
        "--testi-ty": `${ty}px`,
        "--testi-ts": scale,
        "--testi-op": opacity,
        zIndex: total - diff,
        pointerEvents: diff === 0 ? "auto" : "none",
      }}
      aria-hidden={diff !== 0}
    >
      <span className="testi-quote-mark">&#8220;</span>
      <p className="testi-quote">{item.quote}</p>
      <div className="testi-card-foot">
        <div className="testi-avatar" style={{ background: item.avatarBg }}>
          <img src={item.photo} alt={item.name} loading="lazy" />
        </div>
        <div className="testi-who">
          <div className="testi-name">{item.name}</div>
          <div className="testi-role">{item.role}</div>
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const total = Testimonials.items.length;
  const [active, setActive] = useState(0);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 10000);
    return () => clearInterval(timer);
  }, [total]); // total is stable; functional updater doesn't need active in deps

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
    if (touchDeltaX.current <= -SWIPE_THRESHOLD) {
      setActive((prev) => (prev + 1) % total);
    } else if (touchDeltaX.current >= SWIPE_THRESHOLD) {
      setActive((prev) => (prev - 1 + total) % total);
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <section className="section" id="testimonials">
      <div className="shell shell-narrow">
        <h2 className="testi-heading">Testimonials</h2>

        <div className="testi-stage testi-stage-desktop">
          <div className="testi-grid">
            {Testimonials.items.map((item, i) => (
              <TestimonialGridCard item={item} scatter={TESTIMONIAL_SCATTER[i]} key={item.name} />
            ))}
          </div>
        </div>

        <div className="testi-stage testi-stage-mobile">
          <div
            className="testi-trail"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {Testimonials.items.map((item, i) => {
              const diff = (i - active + total) % total;
              return <TestimonialTrailCard item={item} diff={diff} total={total} key={item.name} />;
            })}
          </div>

          <div className="testi-dots">
            {Testimonials.items.map((item, i) => (
              <button
                key={item.name}
                type="button"
                className={`testi-dot${i === active ? " active" : ""}`}
                aria-label={`Show testimonial from ${item.name}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;