import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useCounter } from '../../hooks/useCounter';
import { Button } from '../../components/common/Button';
import { ProductCard } from '../../components/product/ProductCard';
import { ArchMaskImage } from '../../components/common/ArchMaskImage';
import { images } from '../../data/images';
import { BotanicalBackdrop } from '../../components/common/BotanicalBackdrop';
import { ArrowRight, ShieldCheck, Sun, Award, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home = () => {
  const { config, products, categories, blogs } = useStore();
  useDocumentTitle('Fresh Mushrooms, Spawn & Mushroom Products');

  const bestsellers = products.filter(p => p.tags && p.tags.includes('Bestseller')).slice(0, 4);
  const featuredBlogs = blogs.slice(0, 3);
  const comboProduct = products.find(p => p.slug === 'farm-combo-pack');

  const experienceCount = useCounter(15, 2500);
  const productCount = useCounter(products.length, 2500);
  const registeredCount = useCounter(2026, 2500);

  return (
    <div style={{ overflow: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
      <section className="rel-section paper-grain" style={{ backgroundColor: 'var(--parchment)', padding: '64px 0 80px', borderBottom: '1px solid var(--line)' }}>
        <BotanicalBackdrop variant="hero" />
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">Fresh Mushrooms · Healthy Life</span>
            <h1 className="hero-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-5xl)', lineHeight: 1.1, marginBottom: '20px', color: 'var(--espresso)' }}>
              From Our Farm in Odisha to Tables Across India.
            </h1>
            <p style={{ fontSize: 'var(--text-lg)', color: '#555', marginBottom: '32px', maxWidth: '520px', lineHeight: 1.6 }}>
              {config.farmStory}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Link to="/shop" className="btn btn-primary btn-lg">
                Explore The Harvest <ArrowRight size={18} />
              </Link>
              <Link to="/our-farm" className="btn btn-secondary btn-lg">
                Our Cultivation Story
              </Link>
            </div>
            <div className="hero-trustline">
              <span>Supplying Across India With Trust</span>
              <span>Guaranteed Freshness &amp; Quality</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <ArchMaskImage src={images.hero[0]} alt="Fresh Mushrooms" height="520px" />
          </motion.div>

        </div>
      </section>

      {/* 2. BENEFITS STRIP */}
      <section style={{ backgroundColor: 'var(--olive-deep)', color: 'var(--ivory)', padding: '32px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <ShieldCheck color="var(--gold)" size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Guaranteed Freshness &amp; Quality</div>
              <div style={{ fontSize: '0.75rem', color: '#C8D1BE' }}>Careful cultivation &amp; handling</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Award color="var(--gold)" size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>15 Years of Experience</div>
              <div style={{ fontSize: '0.75rem', color: '#C8D1BE' }}>Hands-on mushroom cultivation</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Sun color="var(--gold)" size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Supplying Across India</div>
              <div style={{ fontSize: '0.75rem', color: '#C8D1BE' }}>A brand customers can trust</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Truck color="var(--gold)" size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Complimentary Delivery</div>
              <div style={{ fontSize: '0.75rem', color: '#C8D1BE' }}>On all orders above ₹{config.freeShippingThreshold}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY TILES */}
      <section className="section-padding rel-section">
        <BotanicalBackdrop variant="light" />
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="eyebrow">Explore By Pantry Type</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
              Our Product Range
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="category-tile"
                style={{
                  height: '280px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '20px'
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'relative', zIndex: 2, color: 'var(--white)' }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--ivory)', marginBottom: '4px' }}>
                    {cat.name}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#E0E0E0' }}>{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BESTSELLERS CAROUSEL / GRID */}
      <section className="section-padding" style={{ backgroundColor: 'var(--parchment)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <span className="eyebrow">Most Cherished Harvests</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
                Curated Bestsellers
              </h2>
            </div>
            <Link to="/shop" className="btn btn-secondary btn-sm">
              View Entire Shop <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. FARM TO TABLE STORY & STATS COUNTER */}
      <section className="section-padding rel-section">
        <BotanicalBackdrop variant="corner" />
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <span className="eyebrow">From Our Roots In Odisha</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', marginBottom: '20px' }}>
              Cultivated With Patience, Packed With Care.
            </h2>
            <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.7, marginBottom: '24px', maxWidth: '62ch' }}>
              Our journey began with 15 years of hands-on mushroom cultivation. Every cultivation cycle
              requires attention and proper care — from preparing the growing environment to monitoring
              mushroom growth and handling the final produce — so quality stays consistent from farm to table.
            </p>

            {/* Counter stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', borderTop: '1px solid var(--line)', paddingTop: '24px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--olive-deep)' }}>
                  {experienceCount}+
                </div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700 }}>
                  Years Of Experience
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--olive-deep)' }}>
                  {productCount}
                </div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700 }}>
                  Products In Range
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--olive-deep)' }}>
                  {registeredCount}
                </div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700 }}>
                  Registered Pvt. Ltd.
                </div>
              </div>
            </div>
          </div>

          <ArchMaskImage src={images.farm[0]} alt="Mushroom Farm In Odisha" height="480px" />
        </div>
      </section>

      {/* 6. PROMO FEATURED BANNER BOX */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--olive-deep)',
              color: 'var(--ivory)',
              borderRadius: 'var(--radius-lg)',
              padding: '48px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              alignItems: 'center'
            }}
          >
            <div>
              <span className="eyebrow" style={{ color: 'var(--gold)' }}>One Package, More To Explore</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', color: 'var(--ivory)', marginBottom: '16px' }}>
                The Farm Combo Pack
              </h2>
              <p style={{ color: '#C8D1BE', marginBottom: '24px', fontSize: '0.95rem', maxWidth: '52ch' }}>
                Selected mushroom products brought together in one convenient package — designed for
                customers who want to explore more than one product from our range.
              </p>
              <Link to="/product/farm-combo-pack" className="btn btn-accent btn-lg">
                Order Combo Pack{comboProduct ? ` (${config.currencySymbol}${comboProduct.price.toLocaleString('en-IN')})` : ''}
              </Link>
            </div>
            <img
              src={images.products.comboMaster[0]}
              alt="Farm Combo Pack"
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
            />
          </div>
        </div>
      </section>

      {/* 7. JOURNAL PREVIEW */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="eyebrow">Cultivation &amp; Kitchen Notes</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
              From Our Culinary Journal
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {featuredBlogs.map((blog) => (
              <div key={blog.id} style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {blog.category}
                  </span>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: '8px 0 10px' }}>
                    {blog.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px' }}>{blog.excerpt}</p>
                  <Link to={`/recipes/${blog.slug}`} style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--olive)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Read Journal Entry <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM GALLERY GRID */}
      <section className="section-padding" style={{ backgroundColor: 'var(--parchment)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="eyebrow">@{config.logoText}</span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)' }}>
              From Our Farm To Your Feed
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            {images.instagram.map((imgUrl, i) => (
              <a key={i} href={config.socials?.instagram} target="_blank" rel="noreferrer" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '180px' }}>
                <img src={imgUrl} alt={`Instagram ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
