import React, { useState } from 'react';
import { Faq } from '@/content/faq';

function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <section className="section" id="faq">
      <div className="shell" style={{ maxWidth: '820px' }}>

        <div className="faq-icon-circle">?</div>
        <h2 className="faq-main-title">FAQ</h2>

        <div className="faq-list">
          {Faq.items.map((f, index) => {
            const isOpen = activeFaq === index;
            return (
              <div className="faq-item" key={f.q}>
                <div className="faq-q-row" onClick={() => setActiveFaq(isOpen ? null : index)}>
                  <span className="faq-q-text">{f.q}</span>
                  <span className={`faq-toggle-btn${isOpen ? ' open' : ''}`}>+</span>
                </div>
                <div className={`faq-a-wrap${isOpen ? ' open' : ''}`}>
                  <div className="faq-a-text">{f.a}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default FaqSection;