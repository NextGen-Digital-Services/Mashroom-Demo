import React from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { images } from '../../data/images';
import { BotanicalBackdrop } from '../../components/common/BotanicalBackdrop';
import { Sprout, Eye, Package, MapPin } from 'lucide-react';

export const OurFarm = () => {
  useDocumentTitle('Our Farm');

  return (
    <div className="section-padding rel-section paper-grain">
      <BotanicalBackdrop variant="farm" />
      <div className="container">
        
      <div className="page-hero page-hero-card" style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span className="eyebrow">Our Farm</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-5xl)', lineHeight: 1.1 }}>
            A Place Where Experience Meets Cultivation
          </h1>
          <p style={{ color: '#555', maxWidth: '640px', margin: '16px auto 0', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Our farm is the heart of MANASI MUSHROOM &amp; SPAWN PVT. LTD. — where our journey with
            mushrooms comes to life, and where every cultivation cycle is guided by attention and proper care.
          </p>
        </div>

        {/* How the farm works */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', marginBottom: '64px' }}>
          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <Sprout size={32} color="var(--gold)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '8px' }}>1. Cultivation</h3>
            <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.7 }}>
              Good products begin with proper cultivation. Each cycle starts with preparing the growing
              environment carefully, with freshness and quality as the focus.
            </p>
          </div>

          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <Eye size={32} color="var(--gold)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '8px' }}>2. Care &amp; Monitoring</h3>
            <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.7 }}>
              Every stage of growth is monitored closely — from preparing the growing environment to
              watching mushroom growth and handling the final produce.
            </p>
          </div>

          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <Package size={32} color="var(--gold)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '8px' }}>3. Processing &amp; Products</h3>
            <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.7 }}>
              From cultivation to processing, the farm is the starting point of our fresh mushrooms,
              mushroom spawn, and mushroom-based products.
            </p>
          </div>
        </div>

        {/* Farm location */}
        <div className="farm-location">
          <MapPin size={28} color="var(--terracotta)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '8px' }}>Pedagadi, Udala, Mayurbhanj, Odisha</h3>
          <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.7, maxWidth: '52ch', margin: '0 auto' }}>
            From our farm in Odisha, we are working toward a larger vision: building a trusted mushroom
            business that can supply quality products to customers across India.
          </p>
        </div>

        {/* Farm Images Gallery */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {images.farm.map((img, idx) => (
            <img key={idx} src={img} alt={`Farm scene ${idx + 1}`} style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>

        {/* Closing statement */}
        <div className="farm-statement">
          <h2>Our Farm Is Where Experience, Care, And Cultivation Come Together.</h2>
          <p>MANASI MUSHROOM &amp; SPAWN PVT. LTD.</p>
          <p>From Our Farm. With Experience. With Care.</p>
        </div>

      </div>
    </div>
  );
};
