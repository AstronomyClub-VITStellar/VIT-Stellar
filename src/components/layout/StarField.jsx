import React from 'react';

const ABOUT_BG_PLANETS = [
  { id: 'mercury', size: 16, top: '9%', left: '5%', opacity: 0.55 },
  { id: 'venus', size: 26, top: '58%', left: '3%', opacity: 0.5 },
  { id: 'earth', size: 28, top: '30%', right: '4%', opacity: 0.55 },
  { id: 'mars', size: 18, top: '80%', right: '9%', opacity: 0.55 },
  { id: 'jupiter', size: 46, top: '12%', right: '14%', opacity: 0.45 },
  {
    id: 'saturn', size: 34, top: '68%', left: '11%', opacity: 0.5,
    ring: { width: 122, height: 30, color: 'rgba(217,189,130,0.6)', tilt: -18 },
  },
  {
    id: 'uranus', size: 22, top: '5%', right: '32%', opacity: 0.5,
    ring: { width: 52, height: 52, color: 'rgba(207,240,234,0.45)', tilt: 62 },
  },
  { id: 'neptune', size: 22, top: '90%', left: '24%', opacity: 0.55 },
];

function StarField() {
  const stars = React.useMemo(() => {
    const sizeTiers = [
      { size: 1, count: 90, minOpacity: 0.25, maxOpacity: 0.7 },
      { size: 2, count: 45, minOpacity: 0.35, maxOpacity: 0.9 },
      { size: 3, count: 16, minOpacity: 0.5, maxOpacity: 1 },
    ];
    const list = [];
    sizeTiers.forEach((tier, tierIdx) => {
      for (let i = 0; i < tier.count; i++) {
        list.push({
          key: `${tierIdx}-${i}`,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: tier.size,
          opacity: tier.minOpacity + Math.random() * (tier.maxOpacity - tier.minOpacity),
          duration: 2.5 + Math.random() * 4.5,
          delay: Math.random() * 6,
        });
      }
    });
    return list;
  }, []);

  return (
    <div className="tg-starfield" aria-hidden="true">
      <div className="tg-nebula tg-nebula-1" />
      <div className="tg-nebula tg-nebula-2" />

      {ABOUT_BG_PLANETS.map((p) => (
        <div
          key={p.id}
          className={`tg-deco-planet tg-planet-${p.id}`}
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            right: p.right,
            bottom: p.bottom,
            opacity: p.opacity,
            boxShadow: `0 0 ${Math.round(p.size * 0.8)}px rgba(255,255,255,0.08)`,
          }}
        >
          {p.ring && (
            <div
              className="tg-deco-planet-ring"
              style={{
                width: p.ring.width,
                height: p.ring.height,
                borderColor: p.ring.color,
                transform: `translate(-50%, -50%) rotate(${p.ring.tilt}deg)`,
              }}
            />
          )}
        </div>
      ))}

      {stars.map((s) => (
        <span
          key={s.key}
          className="tg-star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            '--tg-star-opacity': s.opacity,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default StarField;
