import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ArchMaskImage } from '../../components/common/ArchMaskImage';
import { BotanicalBackdrop } from '../../components/common/BotanicalBackdrop';
import { images } from '../../data/images';

const productRange = [
  { name: 'Fresh Mushrooms', text: 'For everyday cooking and food preparation — a versatile ingredient for homes, restaurants, and food businesses.' },
  { name: 'Mushroom Spawn', text: 'The essential starting material for mushroom cultivation, intended for growers and enthusiasts.' },
  { name: 'Sun-Dried Mushrooms', text: 'A convenient way to enjoy mushrooms beyond their fresh form — stored and used across many recipes.' },
  { name: 'Mushroom Powder', text: 'An easy way to add mushroom flavour to cooking and a variety of dishes.' },
  { name: 'Mushroom Pickle', text: 'A traditional, flavourful form — one of our value-added mushroom products.' },
  { name: 'Mushroom Soup Mix', text: 'A simple, convenient way to prepare mushroom soup at home.' },
  { name: 'Mushroom Chutney', text: 'A familiar, enjoyable accompaniment that combines mushrooms with an everyday food format.' },
  { name: 'Home Growing Kit', text: 'An accessible way to experience mushroom cultivation yourself and see how mushrooms grow.' },
  { name: 'Farm Combo Pack', text: 'Selected mushroom products together in one convenient package, for exploring more than one product.' }
];

const sections = [
  {
    title: 'Our Story',
    paras: [
      'The story of MANASI MUSHROOM & SPAWN PVT. LTD. began with Mrs. Manasi Pattanayak, the founder behind our journey. With 15 years of experience in mushroom cultivation and the mushroom industry, she has developed valuable practical knowledge through years of working directly with mushrooms — cultivation, production, handling, and mushroom-based products.',
      'What started as a journey in mushroom cultivation gradually developed into a larger vision. Years of experience, learning, experimentation, and dedication created the foundation for building a professionally structured mushroom business.',
      'In 2026, this journey took an important step forward when the business was officially registered as MANASI MUSHROOM & SPAWN PVT. LTD. — combining years of practical experience with a growing vision for the future.'
    ]
  },
  {
    title: 'Our Roots',
    paras: [
      'Our roots are based in Pedagadi, Udala, Mayurbhanj, Odisha. Mushroom cultivation is at the heart of our work, and our experience in this field continues to guide the way we develop our products and serve our customers.',
      'For us, mushrooms are not simply another product. They represent years of patience, learning, hard work, and dedication — qualities that cultivation demands at every stage.',
      'Today, we continue to build on those roots while working toward creating a trusted mushroom brand that can serve customers across India.'
    ]
  },
  {
    title: 'What We Do',
    paras: [
      'MANASI MUSHROOM & SPAWN PVT. LTD. focuses on mushroom cultivation, mushroom spawn production, and mushroom-based food products.',
      'Our work covers different stages of the mushroom journey — from cultivation and spawn production to processing and creating convenient mushroom-based products for everyday use.',
      'Whether someone is looking for fresh mushrooms for cooking, spawn for cultivation, processed products for their kitchen, or a home growing kit, our range is designed to provide different ways to enjoy and explore mushrooms.'
    ]
  }
];

const closingSections = [
  {
    title: 'Our Commitment To Quality',
    highlight: 'Guaranteed Freshness & Quality.',
    paras: [
      'Quality is one of the most important values behind MANASI MUSHROOM & SPAWN PVT. LTD. We understand that customers want products they can trust, so we focus on careful cultivation, proper handling, thoughtful processing, and consistency throughout our work.',
      'Whether it is fresh mushrooms, spawn, dried mushrooms, powder, pickle, soup mix, chutney, a growing kit, or a combination of our products, we aim to maintain the same dedication and attention to quality.'
    ]
  },
  {
    title: 'Our Experience',
    paras: [
      'Our strongest foundation is experience. Fifteen years of hands-on work in mushroom cultivation has given our founder a practical understanding of the industry, built through direct involvement, continuous learning, and years of working with mushrooms.',
      'As the company moves forward, we combine this experience with modern business practices, better systems, improved product development, and a strong focus on customer satisfaction.'
    ]
  },
  {
    title: 'Our Vision',
    paras: [
      'Our vision is to develop MANASI MUSHROOM & SPAWN PVT. LTD. into a trusted mushroom company serving customers across India.',
      'We want to continue developing our products, improving our cultivation practices, expanding our reach, and creating more convenient ways for customers to access mushroom products — while contributing to greater awareness of mushroom cultivation and the possibilities it offers.'
    ]
  },
  {
    title: 'Growing Across India',
    highlight: 'Supplying Across India With Trust.',
    paras: [
      'We want to build a company that customers from different parts of India can rely on for mushroom products.',
      'As our company grows, our goal is to expand our reach while maintaining the values that have been part of our journey from the beginning — experience, quality, dedication, and trust.'
    ]
  },
  {
    title: 'Our Future',
    paras: [
      'The registration of MANASI MUSHROOM & SPAWN PVT. LTD. in 2026 marks a new chapter, but our journey does not stop here. We see the future as an opportunity to grow, learn, improve, and introduce more mushroom products — while remaining connected to the practical experience that started it all.',
      'Our past gives us experience. Our present gives us purpose. Our future gives us the opportunity to grow.'
    ]
  },
  {
    title: 'Our Promise',
    paras: [
      'At MANASI MUSHROOM & SPAWN PVT. LTD., we believe a strong company is built not only through products but also through trust. Every mushroom we cultivate, every product we prepare, and every customer we serve is part of our continuing journey.',
      'Our promise is to work with dedication, maintain our focus on quality, continue learning, and keep developing products that bring the versatility of mushrooms closer to customers.'
    ]
  },
  {
    title: 'From Our Farm To Your Table',
    paras: [
      'Our journey began with mushroom cultivation. Over the years, it has grown into a wider vision that includes fresh mushrooms, spawn, dried mushrooms, powder, pickle, soup mix, chutney, home growing solutions, and combination products.',
      'MANASI MUSHROOM & SPAWN PVT. LTD. is not simply about selling mushrooms. It is about building a journey around mushrooms — from cultivation to products, from experience to innovation, and from our roots in Odisha to customers across India.'
    ]
  }
];

const ContentSection = ({ section }) => (
  <div className="content-section">
    <h2 className="content-title">{section.title}</h2>
    {section.paras.map((para, i) => (
      <p key={i}>{para}</p>
    ))}
    {section.highlight && (
      <span className="content-highlight">{section.highlight}</span>
    )}
  </div>
);

export const AboutUs = () => {
  const { config } = useStore();
  useDocumentTitle('About Us');

  return (
    <div className="section-padding rel-section paper-grain">
      <BotanicalBackdrop variant="corner" />
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="eyebrow">About Us</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-5xl)', lineHeight: 1.1, marginBottom: '16px' }}>
            15 Years Of Experience. One Passion.
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#555', fontStyle: 'italic', fontFamily: 'var(--font-heading)' }}>
            A journey grown from the farm — from our roots in Odisha to customers across India.
          </p>
        </div>

        <ArchMaskImage src={images.hero[1]} alt="Mushroom Cultivation" height="420px" className="mb-8" />

        <p className="content-lead" style={{ marginBottom: 'var(--space-6)' }}>
          Welcome to MANASI MUSHROOM &amp; SPAWN PVT. LTD., a mushroom-focused company built on
          experience, dedication, quality, and a strong connection with mushroom cultivation. Our
          journey is rooted in practical knowledge, years of hands-on experience, and a vision to
          make quality mushroom products accessible to customers across India.
        </p>

        {sections.map((section) => (
          <ContentSection key={section.title} section={section} />
        ))}

        <div className="content-section">
          <h2 className="content-title">Our Products</h2>
          <p>Our product range represents the versatility of mushrooms and the different ways they can be used.</p>
          <div className="product-list-grid">
            {productRange.map((product) => (
              <div className="product-list-item" key={product.name}>
                <h4>{product.name}</h4>
                <p>{product.text}</p>
              </div>
            ))}
          </div>
        </div>

        {closingSections.map((section) => (
          <ContentSection key={section.title} section={section} />
        ))}

        <div className="farm-statement">
          <h2>15 Years Of Experience. One Passion. One Growing Journey.</h2>
          <p>{config.name}</p>
          <p>Supplying Across India With Trust. · Guaranteed Freshness &amp; Quality.</p>
          <p>Growing with experience. Creating with care. Building for the future.</p>
        </div>
      </div>
    </div>
  );
};
