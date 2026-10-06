import React, { useState, useRef, useEffect } from 'react';
import { Events } from '@/content/events';

function PastEventRow({ event, registerImageRef, onImageLoad }) {
  const rowRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`past-event-row ${event.side}${inView ? ' in-view' : ''}`} ref={rowRef}>
      <div className="past-event-text">
        <h3 className="past-event-title">{event.title}</h3>
        <p className="past-event-desc">{event.desc}</p>
      </div>
      <div className="past-event-image" ref={registerImageRef}>
        <div className="past-event-image-inner">
          <img src={event.image} alt={event.title} onLoad={onImageLoad} />
        </div>
      </div>
    </div>
  );
}

function EventsTimeline({ events }) {
  const containerRef = useRef(null);
  const imageRefs = useRef([]);
  const [connectors, setConnectors] = useState([]);
  const [activeSet, setActiveSet] = useState(() => new Set());

  const computeConnectors = () => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const next = [];

    for (let i = 0; i < events.length - 1; i++) {
      const imgA = imageRefs.current[i];
      const imgB = imageRefs.current[i + 1];
      if (!imgA || !imgB) continue;
      const rectA = imgA.getBoundingClientRect();
      const rectB = imgB.getBoundingClientRect();

      const xA = rectA.left + rectA.width / 2 - containerRect.left;
      const yA = rectA.bottom - containerRect.top;
      const xB = rectB.left + rectB.width / 2 - containerRect.left;
      const yB = rectB.top - containerRect.top;
      const midY = (yA + yB) / 2;

      const d = `M ${xA} ${yA} L ${xA} ${midY} L ${xB} ${midY} L ${xB} ${yB}`;
      next.push({ d, cx: (xA + xB) / 2, cy: midY, key: `${i}-${i + 1}` });
    }
    setConnectors(next);
  };

  useEffect(() => {
    computeConnectors();
    const onResize = () => computeConnectors();
    window.addEventListener('resize', onResize);

    let frame;
    let elapsed = 0;
    const tick = () => {
      computeConnectors();
      elapsed += 16;
      if (elapsed < 1500) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const container = containerRef.current;
    const onTransitionEnd = () => computeConnectors();
    container?.addEventListener('transitionend', onTransitionEnd);

    let ro;
    if (typeof ResizeObserver !== 'undefined' && container) {
      ro = new ResizeObserver(() => computeConnectors());
      ro.observe(container);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
      container?.removeEventListener('transitionend', onTransitionEnd);
      ro?.disconnect();
    };
  }, [events.length]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setActiveSet(new Set(connectors.map((_, i) => i)));
      return;
    }
    const observers = connectors.map((_, i) => {
      const targetImg = imageRefs.current[i + 1];
      if (!targetImg) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSet((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
            obs.disconnect();
          }
        },
        { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
      );
      obs.observe(targetImg);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, [connectors]);

  return (
    <div className="past-events-timeline" ref={containerRef}>
      <svg className="past-events-svg" aria-hidden="true">
        {connectors.map((c, i) => (
          <g key={c.key} className={activeSet.has(i) ? 'past-events-connector active' : 'past-events-connector'}>
            <path d={c.d} className="past-events-connector-path" />
            <circle cx={c.cx} cy={c.cy} className="past-events-connector-dot" />
          </g>
        ))}
      </svg>
      {events.map((event, i) => (
        <PastEventRow
          event={event}
          key={event.title}
          registerImageRef={(el) => { imageRefs.current[i] = el; }}
          onImageLoad={computeConnectors}
        />
      ))}
    </div>
  );
}

function EventsSection() {
  return (
    <section className="section" id="events">
      <div className="shell shell-narrow">
        <h2 className="events-heading">Events</h2>

        <EventsTimeline events={Events.items} />
      </div>
    </section>
  );
}

export default EventsSection;