import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ArchMaskImage } from '../../components/common/ArchMaskImage';
import { BotanicalBackdrop } from '../../components/common/BotanicalBackdrop';
import { images } from '../../data/images';
import {
  Sprout, BadgeCheck, HeartHandshake, Handshake, BookOpen,
  Lightbulb, Users, MapPin, Factory, FlaskConical, UtensilsCrossed,
  ArrowRight
} from 'lucide-react';

const stats = [
  { value: '15+', label: 'Years Of Experience' },
  { value: '2026', label: 'Registered Pvt. Ltd.' },
  { value: '9', label: 'Product Categories' },
  { value: 'Pan-India', label: 'Supply With Trust' }
];

const values = [
  { name: 'Experience', text: 'Our 15-year journey gives us a practical foundation and guides every decision.', icon: Sprout },
  { name: 'Quality', text: 'Quality stays at the centre of everything we produce.', icon: BadgeCheck },
  { name: 'Dedication', text: 'Patience, attention and consistency — carried from cultivation into business.', icon: HeartHandshake },
  { name: 'Trust', text: 'Long-term relationships built through reliability and responsibility.', icon: Handshake },
  { name: 'Learning', text: 'The industry keeps evolving; continuous learning keeps us growing.', icon: BookOpen },
  { name: 'Innovation', text: 'New products and new ways to make mushrooms accessible.', icon: Lightbulb },
  { name: 'Customer Focus', text: 'Our customers\' trust is something we earn and maintain.', icon: Users }
];

const pillars = [
  { title: 'Cultivation', icon: Sprout, text: 'Hands-on mushroom cultivation at our farm in Pedagadi, Odisha — where every cycle teaches attention, patience and discipline.' },
  { title: 'Spawn Production', icon: FlaskConical, text: 'Quality mushroom spawn as the essential starting material for growers across the region.' },
  { title: 'Food Products', icon: UtensilsCrossed, text: 'Fresh mushrooms and value-added products — powder, pickle, soup mix, chutney, dried formats and growing kits.' }
];

const productRange = [
  { name: 'Fresh Mushrooms', img: images.categories['fresh-mushrooms'] },
  { name: 'Mushroom Spawn', img: images.categories['mushroom-spawn'] },
  { name: 'Sun-Dried Mushrooms', img: images.categories['sun-dried-mushrooms'] },
  { name: 'Mushroom Powder', img: images.categories['mushroom-powder'] },
  { name: 'Mushroom Pickle', img: images.categories['mushroom-pickle'] },
  { name: 'Mushroom Soup Mix', img: images.categories['mushroom-soup-mix'] },
  { name: 'Mushroom Chutney', img: images.categories['mushroom-chutney'] },
  { name: 'Home Growing Kit', img: images.categories['home-growing-kit'] },
  { name: 'Farm Combo Pack', img: images.categories['farm-combo-pack'] }
];

const timeline = [
  { year: '≈ 2011', title: 'The Passion Begins', text: 'Mrs. Manasi Pattanayak starts learning mushroom cultivation alongside everyday household responsibilities.' },
  { year: '15 Years', title: 'Hands-On Experience', text: 'Years of cultivation, handling, experimentation and continuous learning build deep practical knowledge.' },
  { year: '2026', title: 'A Company Is Born', text: 'MANASI MUSHROOM & SPAWN PVT. LTD. is officially registered — experience becomes enterprise.' },
  { year: 'Future', title: 'Across India', text: 'A trusted mushroom brand serving customers throughout India — without losing its roots.' }
];

const SectionTitle = ({ eyebrow, title, center = true }) => (
  <div style={{ textAlign: center ? 'center' : 'left', marginBottom: '36px' }}>
    <span className="eyebrow">{eyebrow}</span>
    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', color: 'var(--espresso)' }}>
      {title}
    </h2>
  </div>
);

export const AboutUs = () => {
  const { config } = useStore();
  useDocumentTitle('About Us');

  return (
    <div>
      {/* ── HERO ── */}
      <section className="page-hero rel-section" style={{ padding: '72px 0 80px', borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ maxWidth: '980px', textAlign: 'center' }}>
          <span className="eyebrow">About Us</span>
          <h1 data-reveal className="hero-title" style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.08, marginBottom: '18px', color: 'var(--espresso)' }}>
            15 Years Of Experience.<br />One Passion.
          </h1>
          <p data-reveal style={{ fontSize: '1.2rem', color: '#4a4438', fontStyle: 'italic', fontFamily: 'var(--font-heading)', maxWidth: '640px', margin: '0 auto 40px' }}>
            A journey grown from the farm — from our roots in Odisha to customers across India.
          </p>
          <div data-reveal>
            <ArchMaskImage src={images.hero[1]} alt="Mushroom Cultivation" height="400px" />
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ background: 'var(--olive-deep)', color: 'var(--ivory)', padding: '34px 0' }}>
        <div className="container">
          <div data-reveal-stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))', gap: '24px', textAlign: 'center' }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: 'var(--gold)' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#C8D1BE', fontWeight: 700 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO LEAD ── */}
      <section className="section-padding" style={{ paddingBottom: 'var(--space-5)' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <p className="content-lead" data-reveal style={{ textAlign: 'center', margin: '0 auto', maxWidth: '72ch' }}>
            Welcome to <strong>MANASI MUSHROOM &amp; SPAWN PVT. LTD.</strong> — a mushroom-focused company
            built on experience, dedication, practical knowledge, quality, and a deep connection with
            mushroom cultivation. Our story is not simply the story of a newly established company; it is
            the story of a journey developed over many years through hands-on experience, continuous
            learning, cultivation, experimentation, and dedication to mushrooms.
          </p>
        </div>
      </section>

      {/* ── FOUNDER FEATURE ── */}
      <section className="section-padding" style={{ background: 'var(--parchment)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div className="about-split">
            <div data-reveal>
              <ArchMaskImage src={images.hero[0]} alt="Mrs. Manasi Pattanayak — Founder" height="460px" />
            </div>
            <div data-reveal>
              <span className="eyebrow">The Woman Behind The Journey</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', marginBottom: '18px' }}>
                Mrs. Manasi Pattanayak
              </h2>
              <p style={{ color: '#444', lineHeight: 1.75, marginBottom: '14px' }}>
                Every company has a beginning, but behind MANASI MUSHROOM &amp; SPAWN PVT. LTD. stands a
                person whose experience and dedication have shaped its foundation. Her connection with
                mushrooms has developed over approximately 15 years of practical experience — learning
                the importance of patience, observation, consistency and care throughout every
                cultivation cycle.
              </p>
              <p style={{ color: '#444', lineHeight: 1.75, marginBottom: '20px' }}>
                What began as experience in cultivation gradually became a larger vision: a
                professionally organized mushroom business bringing together cultivation, spawn
                production, fresh mushrooms, processing, value-added products and growing solutions.
                For her, mushrooms are more than an agricultural product — they represent years of
                work, learning, experimentation and commitment.
              </p>
              <blockquote className="about-quote">
                “She began with passion. She continued with experience. She grew through dedication.”
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="section-padding">
        <div className="container">
          <SectionTitle eyebrow="From Experience To Enterprise" title="A Journey In Four Chapters" />
          <div data-reveal-stagger className="about-timeline">
            {timeline.map((t) => (
              <div key={t.year} className="about-timeline-item">
                <div className="about-timeline-year">{t.year}</div>
                <h4>{t.title}</h4>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO — PILLARS ── */}
      <section className="section-padding" style={{ background: 'var(--olive-deep)', color: 'var(--ivory)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }} data-reveal>
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>What We Do</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', color: 'var(--ivory)' }}>
              Three Roots, One Company
            </h2>
          </div>
          <div data-reveal-stagger className="about-pillars">
            {pillars.map((p) => (
              <div key={p.title} className="about-pillar">
                <p.icon size={30} strokeWidth={1.6} />
                <h4>{p.title}</h4>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR ROOTS ── */}
      <section className="section-padding">
        <div className="container">
          <div className="about-split about-split-reverse">
            <div data-reveal>
              <span className="eyebrow">Our Roots</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', marginBottom: '18px' }}>
                Grounded In Odisha
              </h2>
              <p style={{ color: '#444', lineHeight: 1.75, marginBottom: '14px' }}>
                Our roots are based in Pedagadi, Udala, Mayurbhanj, Odisha — and the company remains
                connected to the agricultural environment from which its journey developed. Mushroom
                cultivation taught us that quality cannot simply be added at the end of production; it
                begins with attention, care, proper handling and consistency throughout the entire
                process.
              </p>
              <p style={{ color: '#444', lineHeight: 1.75, marginBottom: '20px' }}>
                Experience gained from the ground level has tremendous value. It helps us understand the
                real challenges of cultivation and approach our products with greater awareness. Our
                objective is not simply to become a larger business — it is to develop a trusted
                mushroom brand that stays connected to the experience and values from which it started.
              </p>
              <div className="about-location">
                <MapPin size={18} /> Pedagadi, Udala, Mayurbhanj, Odisha
              </div>
            </div>
            <div data-reveal>
              <ArchMaskImage src={images.farm[0]} alt="Our Farm In Odisha" height="440px" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT RANGE ── */}
      <section className="section-padding" style={{ background: 'var(--parchment)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <SectionTitle eyebrow="Our Product Range" title="Nine Ways To Experience Mushrooms" />
          <div data-reveal-stagger className="about-products">
            {productRange.map((p) => (
              <Link key={p.name} to="/shop" className="about-product">
                <img src={p.img} alt={p.name} loading="lazy" />
                <span>{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section-padding">
        <div className="container">
          <SectionTitle eyebrow="Our Values" title="What We Stand On" />
          <div data-reveal-stagger className="about-values">
            {values.map((v) => (
              <div key={v.name} className="about-value">
                <v.icon size={24} strokeWidth={1.7} />
                <h4>{v.name}</h4>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUALITY + VISION (two cards) ── */}
      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          <div data-reveal-stagger className="about-split" style={{ gap: '24px' }}>
            <div className="about-card">
              <span className="eyebrow">Our Commitment</span>
              <h3>Guaranteed Freshness &amp; Quality.</h3>
              <p>
                Customers want products they can trust. We focus on careful cultivation, proper
                handling, thoughtful processing and consistency — whether it is fresh mushrooms,
                spawn, dried mushrooms, powder, pickle, soup mix, chutney, a growing kit or a
                combination product.
              </p>
            </div>
            <div className="about-card about-card-accent">
              <span className="eyebrow" style={{ color: 'var(--gold)' }}>Our Vision</span>
              <h3>Supplying Across India With Trust.</h3>
              <p>
                To develop MANASI MUSHROOM &amp; SPAWN PVT. LTD. into a trusted mushroom company
                serving customers across India — improving products and cultivation practices,
                expanding reach, and growing mushrooms' place in many lifestyles, kitchens and farms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROMISE / CLOSER ── */}
      <section className="section-padding" style={{ paddingTop: 0, paddingBottom: 'var(--space-8)' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="farm-statement" data-reveal>
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>Our Promise</span>
            <h2>15 Years Of Experience. One Passion. One Growing Journey.</h2>
            <p style={{ maxWidth: '62ch', color: '#DCE3D2', fontSize: '0.95rem', lineHeight: 1.7, textTransform: 'none', letterSpacing: 0 }}>
              Every mushroom we cultivate, every product we prepare and every customer we serve becomes
              part of our continuing journey. Our promise: dedication, quality, continuous learning —
              and products that bring the versatility of mushrooms closer to you.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '22px' }}>
              <Link to="/shop" className="btn btn-accent btn-lg">
                Explore The Harvest <ArrowRight size={16} />
              </Link>
              <Link to="/our-farm" className="btn btn-lg" style={{ border: '1px solid rgba(247,243,232,0.4)', color: 'var(--ivory)' }}>
                Visit Our Farm Story
              </Link>
            </div>
            <p style={{ marginTop: '22px', color: '#C8D1BE' }}>{config.name} · Growing with experience. Creating with care. Building for the future.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
