import React from 'react';
import Icon from '@/components/ui/Icon';
import { AboutUs } from '@/content/aboutUs';

function AboutUsSection({ scrollToSection }) {
  const handleQuickLink = (e, href) => {
    e.preventDefault();
    if (scrollToSection) scrollToSection(href);
    else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section" id="aboutus">
      <div className="shell shell-narrow">
        <div className="about-header">
          <h2 className="about-heading">ABOUT US</h2>
        </div>

        <div className="about-grid">
          <div className="about-card about-card-hero">
            <img src={AboutUs.hero.image} alt={AboutUs.hero.title} loading="lazy" />
          </div>

          <div className="about-card about-card-featured">
            <h3 className="about-featured-title">{AboutUs.featured.title}</h3>
            <p className="about-featured-desc">
              {AboutUs.featured.desc}{" "}
              <a href="#" className="about-more-link">{AboutUs.featured.moreLabel}</a>
            </p>
            <div className="about-quicklinks">
              {AboutUs.featured.quickLinks.map((q) => (
                <a
                  href={q.href}
                  className="about-quicklink"
                  key={q.label}
                  onClick={(e) => handleQuickLink(e, q.href)}
                >
                  <span>{q.label}</span>
                  <Icon name="arrow_forward" />
                </a>
              ))}
            </div>
          </div>

          <div className="about-card about-card-side">
            <a href="#" className="about-card-arrow" aria-label="Our mission"><Icon name="rocket_launch" /></a>
            <span className="about-pillar-title about-pillar-title-mission">{AboutUs.pillars.mission.title[0]}<br />{AboutUs.pillars.mission.title[1]}</span>
            <p className="about-pillar-desc about-pillar-desc-mission">{AboutUs.pillars.mission.desc}</p>
          </div>

          <div className="about-card about-card-video">
            <a href="#" className="about-card-arrow" aria-label="Our vision"><Icon name="visibility" /></a>
            <span className="about-pillar-title about-pillar-title-vision">{AboutUs.pillars.vision.title[0]}<br />{AboutUs.pillars.vision.title[1]}</span>
            <p className="about-pillar-desc about-pillar-desc-vision">{AboutUs.pillars.vision.desc}</p>
          </div>

          <div className="about-card about-card-categories">
            <a href="#" className="about-card-arrow about-values-arrow" aria-label="Our values">
              <Icon name="diversity_3" />
            </a>
            <span className="about-pillar-title about-pillar-title-values">{AboutUs.pillars.values.title[0]}<br />{AboutUs.pillars.values.title[1]}</span>
            <p className="about-pillar-desc about-pillar-desc-values">{AboutUs.pillars.values.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUsSection;