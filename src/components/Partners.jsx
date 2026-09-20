import React from 'react';
import Icon from '../shared/Icon';
import { Partners } from '../database/Data';

// Grid has 8 units; every cell spans 2 units (same width as before).
const row = (count, r, startUnit) =>
  Array.from({ length: count }, (_, k) => ({ start: startUnit + 2 * k, row: r }));

// centered row: start = (8 - 2*count) / 2 + 1 = 5 - count
const centered = (count, r) => row(count, r, 5 - count);

function getLayout(n) {
  if (n <= 3) return centered(n, 1);                          // 1, 2, 3 -> one centered row
  if (n === 4) return [...row(2, 1, 4), ...row(2, 2, 2)];     // staggered, whole shape centered
  if (n === 5) return [...row(3, 1, 3), ...row(2, 2, 1)];     // same as before
  if (n === 6) return [...row(3, 1, 3), ...row(3, 2, 1)];     // same as before
  // 7+: rows of 4, last row centered
  const out = [];
  for (let i = 0, r = 1; i < n; i += 4, r++) {
    const count = Math.min(4, n - i);
    out.push(...(count === 4 ? row(4, r, 1) : centered(count, r)));
  }
  return out;
}

function PartnersSection() {
  const items = Partners.items;
  const layout = getLayout(items.length);

  return (
    <section className="section" id="partners">
      <h2 className="pub-heading pub-heading-wide">PARTNERS</h2>
      <div className="shell">
        <div className="partners-grid">
          {items.map((p, i) => (
            <div
              className="partners-cell"
              key={p.name}
              style={{
                gridColumn: `${layout[i].start} / span 2`,
                gridRow: layout[i].row,
              }}
            >
              <div className="partners-cell-top">
                <span className="partners-name">{p.name}</span>
              </div>
              <div className="partners-cell-logo">
                <img src={p.logo} alt={p.name} loading="lazy" />
              </div>
              <div className="partners-cell-bottom">
                {p.url && (
                  <a
                    className="partners-view-btn"
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View website <Icon name="north_east" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;