import React from 'react';
import Icon from '@/components/ui/Icon';
import { Gallery } from '@/content/gallery';

function GalleryCard({ item, cut, keyPrefix, index }) {
  return (
    <div className={`gm-card gm-card-cut-${cut}`} key={`${keyPrefix}-${index}`}>
      <div className="gm-card-media">
        <img src={item.src} alt={item.alt} loading="lazy" />
      </div>
      {item.hasPlay && (
        <span className="gm-card-play">
          <Icon name="play_arrow" />
        </span>
      )}
    </div>
  );
}

function GalleryTray({ items, direction, cut }) {
  // Duplicate the list so the CSS marquee can loop seamlessly at -50%.
  const loopItems = [...items, ...items];

  return (
    <div className={`gm-tray gm-tray-${direction}`}>
      <div className={`gm-track gm-track-${direction}`}>
        {loopItems.map((item, i) => (
          <GalleryCard item={item} cut={cut} keyPrefix={direction} index={i} key={`${direction}-${item.src}-${i}`} />
        ))}
      </div>
    </div>
  );
}

function GallerySection() {
  const items = Gallery.items;

  return (
    <section className="section gm-section" id="gallery">
      {/* Top tray: bottom-left corner folded */}
      <GalleryTray items={items} direction="right" cut="bl" />

      <div className="shell shell-narrow gm-heading-row">
        <h2 className="gm-heading">GALLERY</h2>
      </div>

      {/* Bottom tray: top-right corner folded */}
      <GalleryTray items={items} direction="left" cut="tr" />
    </section>
  );
}

export default GallerySection;