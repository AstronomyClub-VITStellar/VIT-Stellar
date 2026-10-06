import React from 'react';
import Icon from '@/components/ui/Icon';
import { Fame } from '@/content/fame';

function FamePillMedia({ item }) {
  if (item.video) {
    return (
      <video
        src={item.video}
        poster={item.photo}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    );
  }
  return <img src={item.photo} alt={item.name} loading="lazy" />;
}

function FameSection() {
  return (
    <section className="section" id="fame">
      <div className="shell shell-narrow">

        <div className="wall-of-fame">
          <h2 className="wall-heading">Wall of Fame</h2>
          <div className="fame-cards">
            {Fame.cards.map((card) => (
              <div className="fame-card" key={card.title}>
                <div className="fame-card-tags">
                  {card.images.map((item) => (
                    <div
                      className={`fame-pill fame-pill-${item.size}${item.featured ? ' fame-pill-featured' : ''}`}
                      key={item.id}
                    >
                      <FamePillMedia item={item} />
                    </div>
                  ))}
                </div>
                <div className="fame-card-foot">
                  <div className="fame-card-text">
                    <div className="fame-card-title">{card.title}</div>
                  </div>
                  <div className="fame-card-arrow">
                    <Icon name={card.icon || "arrow_forward"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FameSection;