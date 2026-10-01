import React from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { images } from '../../data/images';
import { Sun, Droplets, Wind, ShieldAlert } from 'lucide-react';

export const OurFarm = () => {
  useDocumentTitle('Our Estate & Cultivation Process');

  return (
    <div className="section-padding">
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="eyebrow">Log Cultivation & Harvesting</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-5xl)' }}>
            High-Altitude Mountain Estate
          </h1>
          <p style={{ color: '#555', maxWidth: '600px', margin: '12px auto 0', fontSize: '1rem' }}>
            Explore how we cultivate, mist, and solar-cure our medicinal and gourmet mushroom varieties.
          </p>
        </div>

        {/* Grid process */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', marginBottom: '64px' }}>
          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <Sun size={32} color="var(--gold)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '8px' }}>1. Natural Log Inoculation</h3>
            <p style={{ fontSize: '0.88rem', color: '#555' }}>Oak and alder timber logs are inoculated with pure grain mycelium and rested in shaded mountain ravines.</p>
          </div>

          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <Droplets size={32} color="var(--gold)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '8px' }}>2. Glacial Water Misting</h3>
            <p style={{ fontSize: '0.88rem', color: '#555' }}>Spring water misting maintains 85%+ humidity levels simulating natural mountain rainfall cycles.</p>
          </div>

          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <Wind size={32} color="var(--gold)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '8px' }}>3. Solar Indirect Drying</h3>
            <p style={{ fontSize: '0.88rem', color: '#555' }}>Whole mushrooms are solar-dried on elevated bamboo decks under controlled airflow to lock in active beta-glucans.</p>
          </div>
        </div>

        {/* Farm Images Gallery */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {images.farm.map((img, idx) => (
            <img key={idx} src={img} alt={`Farm scene ${idx + 1}`} style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>

      </div>
    </div>
  );
};
