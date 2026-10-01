import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ArchMaskImage } from '../../components/common/ArchMaskImage';
import { images } from '../../data/images';

export const AboutUs = () => {
  const { config } = useStore();
  useDocumentTitle('About Our Estate');

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="eyebrow">Tuscan Fungi Heritage</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-5xl)', marginBottom: '16px' }}>
            The Heritage of {config.name}
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#555', fontStyle: 'italic', fontFamily: 'var(--font-heading)' }}>
            "{config.tagline}"
          </p>
        </div>

        <ArchMaskImage src={images.hero[1]} alt="Estate Table" height="420px" className="mb-8" />

        <div style={{ lineHeight: 1.8, fontSize: '1.05rem', color: '#333' }}>
          <p style={{ marginBottom: '20px' }}>
            {config.aboutShort}
          </p>
          <p style={{ marginBottom: '20px' }}>
            {config.farmStory}
          </p>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginTop: '32px', marginBottom: '12px' }}>
            Our Three Pillars of Excellence
          </h3>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Timber Log Cultivation:</strong> Grown strictly on natural hardwood logs.</li>
            <li style={{ marginBottom: '8px' }}><strong>Solar Dehydration:</strong> Sun-cured slowly to concentrate rich guanylate umami.</li>
            <li style={{ marginBottom: '8px' }}><strong>Zero Additives:</strong> Preserved naturally in cold-pressed mustard oil with Himalayan sea salt.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
