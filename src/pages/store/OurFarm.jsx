import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { images } from '../../data/images';
import { BotanicalBackdrop } from '../../components/common/BotanicalBackdrop';
import { ArchMaskImage } from '../../components/common/ArchMaskImage';
import {
  Sprout, Eye, Package, MapPin, HeartHandshake, Users,
  Wheat, ArrowRight, ArrowDown
} from 'lucide-react';

const chain = ['Cultivation', 'Harvest', 'Handling', 'Processing', 'Product', 'Customer'];

const products = [
  'Fresh Mushrooms', 'Mushroom Spawn', 'Sun-Dried Mushrooms', 'Mushroom Powder',
  'Mushroom Pickle', 'Mushroom Soup Mix', 'Mushroom Chutney',
  'Home-Growing Kits', 'Farm Combination Packs'
];

const pillars = [
  {
    icon: Sprout,
    title: 'The Farm Is The Foundation',
    paras: [
      'When we talk about mushroom products, it is easy to focus only on what finally reaches the customer. But behind every product is a longer journey — and that journey begins with cultivation.',
      'The quality and condition of the final product are connected to the care given throughout the process. From preparation and cultivation to handling and harvesting, every stage contributes to the overall journey.'
    ],
    quote: 'Good cultivation begins with good care. And good care begins with attention.'
  },
  {
    icon: Eye,
    title: 'Cultivation Is A Process Of Patience',
    paras: [
      'Mushroom cultivation is not simply about waiting for mushrooms to grow — it is a process that requires continuous attention. The growing environment needs to be looked after throughout the cycle, and the cultivation process needs consistency.',
      'There is no shortcut to replacing experience. The more one works with cultivation, the more one learns to observe the small details that can influence the process.'
    ],
    quote: 'The field teaches patience. The cultivation process teaches discipline.'
  },
  {
    icon: Package,
    title: 'From Cultivation To Harvest',
    paras: [
      'The most rewarding moment of any cultivation cycle is the harvest. After the work, waiting and care that goes into cultivation, the crop becomes ready to move into the next stage of its journey.',
      'Harvesting is not the end. It is the point where cultivation connects with the product — from here, mushrooms begin their journey toward customers, fresh or as value-added products.'
    ],
    quote: 'What begins in cultivation can eventually become part of someone’s meal.'
  }
];

const wordChips = [
  'Cultivation', 'Care', 'Patience', 'Experience', 'Harvest', 'Possibility', 'Connection'
];

export const OurFarm = () => {
  useDocumentTitle('Our Farm');

  return (
    <div>
      {/* ── HERO ── */}
      <section className="page-hero rel-section" style={{ padding: '72px 0 80px', borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ maxWidth: '980px', textAlign: 'center' }}>
          <span className="eyebrow">Our Farm</span>
          <h1 data-reveal className="hero-title" style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.08, marginBottom: '18px', color: 'var(--espresso)' }}>
            From Our Farm:<br />How Cultivation, Care &amp; Products Come Together
          </h1>
          <p data-reveal style={{ fontSize: '1.2rem', color: '#4a4438', fontStyle: 'italic', fontFamily: 'var(--font-heading)', maxWidth: '640px', margin: '0 auto 40px' }}>
            Every product has a beginning — closer to the soil, with a place, a process, and the people who care for it.
          </p>
          <div data-reveal>
            <ArchMaskImage src={images.farm[0]} alt="Our farm in Odisha" height="400px" />
          </div>
        </div>
      </section>

      {/* ── INTRO LEAD ── */}
      <section className="section-padding" style={{ paddingBottom: 'var(--space-5)' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <p className="content-lead" data-reveal style={{ textAlign: 'center', margin: '0 auto', maxWidth: '72ch' }}>
            Before it reaches a kitchen, a market, or a customer's table, every product begins much
            closer to the soil — in our farm and cultivation environment in
            <strong> Pedagadi, Udala, Mayurbhanj, Odisha</strong>. A farm is not simply a piece of
            land; it is a living environment where every cultivation cycle requires attention,
            patience, observation and care. At MANASI MUSHROOM &amp; SPAWN PVT. LTD., the farm
            represents the foundation of that journey.
          </p>
        </div>
      </section>

      {/* ── WHERE THE JOURNEY BEGINS ── */}
      <section className="section-padding" style={{ background: 'var(--parchment)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div className="about-split">
            <div data-reveal>
              <ArchMaskImage src={images.farm[1]} alt="Where the journey begins" height="440px" />
            </div>
            <div data-reveal>
              <span className="eyebrow">Where The Journey Begins</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', marginBottom: '18px' }}>
                Rooted In Pedagadi
              </h2>
              <p style={{ color: '#444', lineHeight: 1.75, marginBottom: '14px' }}>
                Our farm is rooted in Pedagadi, Udala, Mayurbhanj, Odisha — closely connected with the
                agricultural character of the region. For us, the farm is more than a production space.
                It is where we observe. It is where we cultivate. It is where we learn. It is where
                every cycle begins again.
              </p>
              <p style={{ color: '#444', lineHeight: 1.75, marginBottom: '20px' }}>
                Each cultivation cycle brings its own requirements and its own lessons, making farming
                a continuous process rather than something that simply happens once. Every harvest
                reminds us of the importance of proper care.
              </p>
              <blockquote className="about-quote">
                “The field teaches patience. The cultivation process teaches discipline.”
              </blockquote>
              <div className="about-location" style={{ marginTop: '20px' }}>
                <MapPin size={18} /> Pedagadi, Udala, Mayurbhanj, Odisha
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS CHAIN ── */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }} data-reveal>
            <span className="eyebrow">Care Beyond The Field</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)' }}>
              One Continuous Journey
            </h2>
            <p style={{ color: '#555', maxWidth: '60ch', margin: '10px auto 0' }}>
              The farm may be where the journey begins, but our responsibility does not end at
              cultivation. Each stage connects with the next — this is how farming and products come together.
            </p>
          </div>
          <div data-reveal-stagger className="farm-chain">
            {chain.map((step, i) => (
              <React.Fragment key={step}>
                <span className="farm-chain-step">
                  <em>{String(i + 1).padStart(2, '0')}</em>
                  {step}
                </span>
                {i < chain.length - 1 && <ArrowRight className="farm-chain-arrow" size={18} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE PILLARS ── */}
      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          <div data-reveal-stagger className="about-values">
            {pillars.map((p) => (
              <div key={p.title} className="about-value" style={{ gridColumn: 'span 1' }}>
                <p.icon size={24} strokeWidth={1.7} />
                <h4>{p.title}</h4>
                {p.paras.map((para) => (
                  <p key={para.slice(0, 24)} style={{ marginBottom: '8px' }}>{para}</p>
                ))}
                <p className="about-value-quote">{p.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIELD BEHIND THE FOOD (image story) ── */}
      <section className="section-padding" style={{ background: 'var(--olive-deep)', color: 'var(--ivory)' }}>
        <div className="container">
          <div className="about-split about-split-reverse">
            <div data-reveal>
              <span className="eyebrow" style={{ color: 'var(--gold)' }}>The Field Behind The Food</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', color: 'var(--ivory)', marginBottom: '18px' }}>
                Behind Every Product, A Cultivation Story
              </h2>
              <p style={{ color: '#C8D1BE', lineHeight: 1.75, marginBottom: '14px' }}>
                When customers see a mushroom product, they may only see the finished product. But
                behind it is preparation, care, observation, waiting, harvesting — and the
                responsibility of turning that harvest into something useful for the customer.
              </p>
              <p style={{ color: '#C8D1BE', lineHeight: 1.75 }}>
                That is why we believe it is important to remember where food begins. Before the
                product reaches the table, there is a farm behind it.
              </p>
            </div>
            <div data-reveal>
              <img src={images.farm[2]} alt="Field behind the food" loading="lazy" className="about-img-card" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PEOPLE + LAND (two cards) ── */}
      <section className="section-padding">
        <div className="container">
          <div data-reveal-stagger className="about-split" style={{ gap: '24px' }}>
            <div className="about-card">
              <Users size={26} color="var(--gold)" />
              <h3>The People Behind The Cultivation</h3>
              <p>
                A farm does not work by itself. Behind every cultivation cycle are people who give
                their time, attention and effort — from preparing for cultivation to monitoring the
                process and managing the harvest. Machines and systems can support cultivation, but
                care, observation and responsibility remain essential.
              </p>
            </div>
            <div className="about-card about-card-accent">
              <Wheat size={26} color="var(--gold)" />
              <h3>Our Connection With The Land</h3>
              <p>
                Agriculture is a continuous relationship between people, cultivation and the
                environment. Every cycle brings new observations, every season brings its own
                conditions, and every harvest provides an opportunity to learn. Our roots in
                Pedagadi keep us connected with this agricultural foundation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FROM FARM TO PRODUCT ── */}
      <section className="section-padding" style={{ background: 'var(--parchment)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }} data-reveal>
            <span className="eyebrow">From Farm To Product</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)' }}>
              Mushrooms, In Many Forms
            </h2>
            <p style={{ color: '#555', maxWidth: '60ch', margin: '10px auto 0' }}>
              Different formats represent different ways of bringing mushrooms closer to customers.
              They begin with the mushroom — and behind the mushroom is cultivation.
            </p>
          </div>
          <div data-reveal-stagger className="about-values">
            {products.map((name) => (
              <div key={name} className="about-value" style={{ textAlign: 'center', padding: '18px 14px' }}>
                <Sprout size={20} strokeWidth={1.7} style={{ margin: '0 auto 10px' }} />
                <h4 style={{ marginBottom: 0 }}>{name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY FARM & FIELD MATTERS ── */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }} data-reveal>
            <span className="eyebrow">Why Farm &amp; Field Matters</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)' }}>
              The Farm Represents
            </h2>
          </div>
          <div data-reveal-stagger className="about-values" style={{ justifyContent: 'center' }}>
            {wordChips.map((word) => (
              <div key={word} className="about-value" style={{ textAlign: 'center', padding: '16px 12px', background: 'var(--ivory)' }}>
                <h4 style={{ marginBottom: 0, color: 'var(--gold)' }}>{word}</h4>
              </div>
            ))}
          </div>
          <p data-reveal style={{ textAlign: 'center', color: '#555', lineHeight: 1.75, marginTop: '26px', maxWidth: '64ch', marginLeft: 'auto', marginRight: 'auto' }}>
            A connection between the land and the product. A connection between cultivation and food.
            A connection between the farm and the customer. From Pedagadi, the vision is to take the
            products created from this cultivation journey further — because no matter how far the
            business travels, the story will always begin at the farm.
          </p>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          <div data-reveal-stagger className="about-gallery">
            {images.farm.concat(images.instagram.slice(0, 3)).map((img, idx) => (
              <img key={idx} src={img} alt={`Farm life ${idx + 1}`} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSER ── */}
      <section className="section-padding" style={{ paddingTop: 0, paddingBottom: 'var(--space-8)' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="farm-statement" data-reveal>
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>The Journey Continues</span>
            <h2>From Our Farm To Your Table.</h2>
            <p style={{ maxWidth: '58ch', color: '#DCE3D2', fontSize: '0.95rem', lineHeight: 1.7, textTransform: 'none', letterSpacing: 0 }}>
              Farm. Cultivation. Care. Harvest. Processing. Product. Table. Where cultivation meets
              care, and care becomes something you can experience. Our roots remain in Pedagadi,
              Odisha — our work begins with cultivation, and our vision continues to grow.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '22px' }}>
              <Link to="/shop" className="btn btn-accent btn-lg">
                Explore The Harvest <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn btn-lg" style={{ border: '1px solid rgba(247,241,232,0.4)', color: 'var(--ivory)' }}>
                Our Story
              </Link>
            </div>
            <p style={{ marginTop: '22px', color: '#C8D1BE' }}>MANASI MUSHROOM &amp; SPAWN PVT. LTD. · Where cultivation meets care.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
