import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useCounter } from '../../hooks/useCounter';
import { Button } from '../../components/common/Button';
import { ProductCard } from '../../components/product/ProductCard';
import { ArchMaskImage } from '../../components/common/ArchMaskImage';
import { images } from '../../data/images';
import { ArrowRight, ShieldCheck, Sun, Award, Truck, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home = () => {
  const { config, products, categories, blogs } = useStore();
  useDocumentTitle('Artisan Mushroom Delicacies & Gourmet Cultivation');

  const bestsellers = products.filter(p => p.tags && p.tags.includes('Bestseller')).slice(0, 4);
  const featuredBlogs = blogs.slice(0, 3);

  const farmerCount = useCounter(120, 2500);
  const harvestCount = useCounter(15000, 2500);
  const reviewCount = useCounter(4800, 2500);

  return (
    <div style={{ overflow: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ backgroundColor: 'var(--parchment)', padding: '64px 0 80px', position: 'relative', borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">Estate-Grown & Foraged Fine Fungi</span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-5xl)', lineHeight: 1.1, marginBottom: '20px', color: 'var(--espresso)' }}>
              Artisan Delicacies from Mountain Log to Gourmet Table.
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
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <ArchMaskImage src={images.hero[0]} alt="Artisan Mushroom Dish" height="520px" />
          </motion.div>

        </div>
      </section>

      {/* 2. BENEFITS STRIP */}
      <section style={{ backgroundColor: 'var(--olive-deep)', color: 'var(--ivory)', padding: '32px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Sun color="var(--gold)" size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Solar Slow-Dried</div>
              <div style={{ fontSize: '0.75rem', color: '#C8D1BE' }}>Preserves natural umami</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <ShieldCheck color="var(--gold)" size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>100% Organic & Pure</div>
              <div style={{ fontSize: '0.75rem', color: '#C8D1BE' }}>Zero synthetic chemicals</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Award color="var(--gold)" size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Lab Tested Potency</div>
              <div style={{ fontSize: '0.75rem', color: '#C8D1BE' }}>Bioactive batch reports</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Truck color="var(--gold)" size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Complimentary Delivery</div>
              <div style={{ fontSize: '0.75rem', color: '#C8D1BE' }}>On all orders above ₹999</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY TILES */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="eyebrow">Explore By Pantry Type</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
              Artisanal Fungi Categories
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                style={{
                  position: 'relative',
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
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, filter: 'brightness(0.7)', transition: 'transform 0.4s ease' }}
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
      <section className="section-padding">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <span className="eyebrow">Centuries of Fungi Wisdom</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', marginBottom: '20px' }}>
              Cultivated in High-Altitude Himalayan Mist.
            </h2>
            <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.7, marginBottom: '24px' }}>
              Our estate logs rest under dense oak foliage where cool air currents encourage deep mushroom cap density. Every jar of our pickle and powder contains pure mountain vitality harvested at peak maturity.
            </p>

            {/* Counter stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', borderTop: '1px solid var(--line)', paddingTop: '24px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--olive-deep)' }}>
                  {farmerCount}+
                </div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700 }}>
                  Artisan Growers
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--olive-deep)' }}>
                  {harvestCount.toLocaleString()}+
                </div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700 }}>
                  Jars Shipped
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--olive-deep)' }}>
                  {reviewCount.toLocaleString()}+
                </div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700 }}>
                  5-Star Ratings
                </div>
              </div>
            </div>
          </div>

          <ArchMaskImage src={images.farm[0]} alt="Himalayan Mushroom Farm" height="480px" />
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
              <span className="eyebrow" style={{ color: 'var(--gold)' }}>Exclusive Tasting Bundle</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', color: 'var(--ivory)', marginBottom: '16px' }}>
                The Estate Grand Reserve Gift Box
              </h2>
              <p style={{ color: '#C8D1BE', marginBottom: '24px', fontSize: '0.95rem' }}>
                Includes Lion's Mane Powder, Spiced Oyster Pickle, Sun-Dried Shiitake, and a custom hand-carved wood tasting spoon.
              </p>
              <Link to="/product/estate-grand-reserve-combo-pack" className="btn btn-accent btn-lg">
                Order Tasting Bundle (₹1,899)
              </Link>
            </div>
            <img
              src={images.products.comboMaster[0]}
              alt="Grand Reserve Combo"
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
            />
          </div>
        </div>
      </section>

      {/* 7. JOURNAL PREVIEW */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="eyebrow">Italian Fungi Culture</span>
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
            <span className="eyebrow">@BrandName Estate</span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)' }}>
              Follow The Tuscan Fungi Journey
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
