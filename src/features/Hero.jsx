import React from 'react';
import { Hero } from '@/content/hero';

function HeroSection() {
  return (
    <header className="hero">
      <div className="stellar-hero-outer">
      <div className="stellar-hero-canvas">
        <p className="hero-office-heading">OFFICE OF STUDENTS' WELFARE</p>
        <img
          className="hero-title"
          src={Hero.titleImage.src}
          alt={Hero.titleImage.alt}
          fetchpriority="high"
        />
        <div className="hero-words-row">
          <p className="hero-word-astronomy">ASTRONOMY</p>
          <p className="hero-word-club">CLUB VIT</p>
        </div>
        <div className="hero-centerpiece">
          <img src={Hero.centerpieceImage.src} alt={Hero.centerpieceImage.alt} />
        </div>

        {Hero.planets.map((p) => (
          <React.Fragment key={p.id}>
            <div className={`deco-${p.id}`}>
              <img src={p.image} alt={p.alt} />
            </div>
            <p className={`label-${p.id}`}>{p.label}</p>
          </React.Fragment>
        ))}
      </div>
      </div>

      <div className="stellar-hero-planets-mobile">
        {Hero.planets.map((p) => (
          <div className="shp-item" key={p.id}>
            <div className="shp-img"><img src={p.image} alt={p.alt} /></div>
            <p className="shp-label">{p.label}</p>
          </div>
        ))}
      </div>
    </header>
  );
}

export default HeroSection;