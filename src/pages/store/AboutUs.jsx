import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ArchMaskImage } from '../../components/common/ArchMaskImage';
import { BotanicalBackdrop } from '../../components/common/BotanicalBackdrop';
import { images } from '../../data/images';

const productRange = [
  { name: 'Fresh Mushrooms', text: 'One of the most important parts of our range — intended for everyday cooking and food preparation. Mushrooms are versatile ingredients for homes, restaurants and food businesses, and our focus is to make quality mushrooms accessible while maintaining freshness and careful handling.' },
  { name: 'Mushroom Spawn', text: 'The essential starting material for mushroom cultivation, and an important product for growers and people interested in mushroom farming. Our own experience in cultivation gives this category special importance within the company.' },
  { name: 'Sun-Dried Mushrooms', text: 'Another way to enjoy mushrooms beyond their fresh form. Drying provides a convenient alternative — usable across different recipes and a practical option for storing mushrooms long-term.' },
  { name: 'Mushroom Powder', text: 'A convenient way to use mushrooms in different foods and recipes — incorporated into cooking as another form through which customers enjoy mushroom-based products.' },
  { name: 'Mushroom Pickle', text: 'Mushrooms in a traditional and flavourful food format — a value-added product that reflects our aim to explore possibilities beyond fresh mushrooms.' },
  { name: 'Mushroom Soup Mix', text: 'Designed for customers looking for a convenient mushroom-based food option — an easy way to prepare mushroom soup while bringing the flavour of mushrooms into a simple format.' },
  { name: 'Mushroom Chutney', text: 'A value-added product that combines mushrooms with a familiar food format — served as an accompaniment with meals and adding variety to our range.' },
  { name: 'Home Growing Kit', text: 'For people interested in experiencing mushroom cultivation themselves — an accessible way to understand the growing process and the journey from growing to harvesting.' },
  { name: 'Farm Combo Pack', text: 'Selected mushroom products together in one convenient package — designed for customers who want to explore more than one product from our range.' }
];

const values = [
  { name: 'Experience', text: 'Our 15-year journey gives us a practical foundation and helps guide our decisions.' },
  { name: 'Quality', text: 'We want quality to remain at the centre of everything we produce.' },
  { name: 'Dedication', text: 'Cultivation requires patience, attention and consistency — we carry these into our business.' },
  { name: 'Trust', text: 'A long-term business relationship is built through reliability and responsibility.' },
  { name: 'Learning', text: 'The mushroom industry continues to develop, and we believe continuous learning is essential.' },
  { name: 'Innovation', text: 'We explore new mushroom products and new ways of making mushrooms accessible to customers.' },
  { name: 'Customer Focus', text: 'Our customers are an important part of our journey, and their trust is something we earn and maintain.' }
];

const sections = [
  {
    title: 'The Woman Behind the Journey — Mrs. Manasi Pattanayak',
    paras: [
      'Every company has a beginning, but behind MANASI MUSHROOM & SPAWN PVT. LTD. stands a person whose experience and dedication have shaped its foundation. Mrs. Manasi Pattanayak is the founder and the inspiration behind this journey.',
      'Her connection with mushrooms has developed over approximately 15 years of practical experience. During this journey, she has gained knowledge not only from working with mushrooms but also from understanding the importance of patience, observation, consistency, care, and attention throughout the cultivation process.',
      'Mushroom cultivation is a field where practical experience matters greatly. It requires careful observation of cultivation conditions, proper handling, disciplined processes, and continuous attention. Over the years, Mrs. Manasi Pattanayak has developed her understanding through direct involvement — what began as experience in mushroom cultivation gradually became a larger vision: a professionally organized mushroom business bringing together cultivation, spawn production, fresh mushrooms, processing, value-added products, and convenient mushroom-growing solutions.',
      'For her, mushrooms are more than an agricultural product. They represent years of work, learning, experimentation, responsibility, and commitment. Her experience is now being carried forward into the company.'
    ]
  },
  {
    title: 'From Experience to Enterprise',
    paras: [
      'The foundation of MANASI MUSHROOM & SPAWN PVT. LTD. was not created overnight. It was built through years of practical exposure to mushroom cultivation and the understanding that comes from working directly with the cultivation process.',
      'Over time, experience created confidence. Learning created knowledge. And knowledge created a vision for something larger. That vision eventually became MANASI MUSHROOM & SPAWN PVT. LTD.',
      'In 2026, the business took an important step by becoming an officially registered private limited company. This represented more than a change in business structure — it represented the beginning of a new phase focused on professional development, product expansion, stronger systems, wider reach, and long-term growth. The company now aims to combine the practical experience developed over 15 years with modern business practices and an organized approach to mushroom cultivation and mushroom-based products.'
    ]
  },
  {
    title: 'Our Roots',
    paras: [
      'Our roots are based in Pedagadi, Udala, Mayurbhanj, Odisha. The company remains connected to the agricultural environment and practical cultivation experience from which its journey developed.',
      'Mushroom cultivation is at the heart of our work. It has taught us that quality is not something that can simply be added at the end of production — it begins with attention, care, proper handling, consistency, and responsibility throughout the entire process.',
      'We believe that experience gained from the ground level has tremendous value. Practical knowledge helps us understand the real challenges involved in cultivation and allows us to approach our products with greater awareness. Our objective is not simply to become a larger business — it is to develop a trusted mushroom brand that remains connected to the experience and values from which it started.'
    ]
  },
  {
    title: 'What We Do',
    paras: [
      'MANASI MUSHROOM & SPAWN PVT. LTD. focuses on mushroom cultivation, mushroom spawn production, and mushroom-based food products. Our work covers different stages of the mushroom journey — from cultivation and spawn production to processing and the development of convenient mushroom-based products.',
      'Our product vision is designed to serve different types of customers. Some may be looking for fresh mushrooms for everyday cooking. Others may be growers searching for mushroom spawn. Some may prefer dried mushrooms, powder, pickle, soup mix, or chutney. Others may be interested in experiencing mushroom cultivation themselves through a home growing kit.',
      'Our objective is to create different ways for customers to connect with mushrooms.'
    ]
  }
];

const closingSections = [
  {
    title: 'Our Commitment To Quality',
    highlight: 'Guaranteed Freshness & Quality.',
    paras: [
      'Quality is one of the most important values behind MANASI MUSHROOM & SPAWN PVT. LTD. Our commitment is simple: customers want products they can trust. For this reason, we focus on careful cultivation, proper handling, thoughtful processing, consistency, and attention to the details that influence the final product.',
      'Our goal is that the experience and effort behind our products should be reflected in what customers receive — whether it is fresh mushrooms, spawn, dried mushrooms, powder, pickle, soup mix, chutney, a growing kit, or a combination product.'
    ]
  },
  {
    title: 'Our Experience — 15 Years',
    paras: [
      'Experience is one of the strongest foundations of our company. For 15 years, Mrs. Manasi Pattanayak has been connected with mushroom cultivation and the mushroom industry — through direct involvement, practical learning, cultivation, handling, experimentation, and continuous exposure to the mushroom-growing process.',
      'We believe that experience and modern practices can work together. As the company develops, we combine the practical knowledge gained over the years with better systems, improved processes, product development, organized operations, and a strong focus on customer satisfaction.'
    ]
  },
  {
    title: 'Our Vision',
    paras: [
      'Our vision is to develop MANASI MUSHROOM & SPAWN PVT. LTD. into a trusted mushroom company serving customers across India. We want to continue developing our products, improving cultivation practices, expanding our reach, and creating convenient ways for customers to access mushroom products.',
      'We also want to contribute to greater awareness of mushroom cultivation and the opportunities connected with mushrooms. From fresh mushrooms and spawn to processed products and home-growing solutions, we believe mushrooms can become part of many different lifestyles, kitchens, farms, and businesses.'
    ]
  },
  {
    title: 'Supplying Across India With Trust',
    highlight: 'Supplying Across India With Trust.',
    paras: [
      'Our goal is to build a company that customers from different parts of India can rely on for mushroom products. The journey may have started from our roots in Odisha, but our vision extends beyond one location.',
      'We want to gradually develop our reach and establish a strong identity in the mushroom industry while maintaining the values that have guided us from the beginning — experience, quality, dedication, and trust.'
    ]
  },
  {
    title: 'Our Future',
    paras: [
      'The registration of MANASI MUSHROOM & SPAWN PVT. LTD. in 2026 marks a new beginning, but it is not the beginning of our experience — our experience started much earlier. The future represents an opportunity to take that experience forward.',
      'We want to continue learning, improving our cultivation practices, developing new products, strengthening our operations, and reaching more customers — growing responsibly while remaining connected to its original foundation. Our future vision includes continued development in mushroom cultivation, spawn production, value-added products, customer-focused solutions, and wider distribution.'
    ]
  },
  {
    title: 'Our Promise',
    paras: [
      'At MANASI MUSHROOM & SPAWN PVT. LTD., we believe that a strong company is built not only through products but also through trust. Every mushroom we cultivate, every product we prepare, and every customer we serve becomes part of our continuing journey.',
      'Our promise is to work with dedication, maintain our focus on quality, continue learning, and keep developing products that bring the versatility of mushrooms closer to customers. We want every stage of our journey to reflect the experience and values behind the company.'
    ]
  },
  {
    title: 'Our Journey Continues',
    highlight: '15 Years of Experience. One Passion. One Growing Journey.',
    paras: [
      'From the experience of Mrs. Manasi Pattanayak to the formation of MANASI MUSHROOM & SPAWN PVT. LTD., our journey reflects the development of a passion into a larger vision.',
      'We are proud of our roots. We value our experience. We believe in quality. We work with dedication. And we look forward to building trust with customers across India.'
    ]
  }
];

const ContentSection = ({ section }) => (
  <div className="content-section" data-reveal>
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
      <div className="page-hero page-hero-card" data-reveal style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span className="eyebrow">About Us</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-5xl)', lineHeight: 1.1, marginBottom: '16px' }}>
            15 Years Of Experience. One Passion.
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#555', fontStyle: 'italic', fontFamily: 'var(--font-heading)' }}>
            A journey grown from the farm — from our roots in Odisha to customers across India.
          </p>
        </div>

        <ArchMaskImage src={images.hero[1]} alt="Mushroom Cultivation" height="420px" className="mb-8" />

        <p className="content-lead" data-reveal style={{ marginBottom: 'var(--space-6)' }}>
          Welcome to MANASI MUSHROOM &amp; SPAWN PVT. LTD., a mushroom-focused company built on
          experience, dedication, practical knowledge, quality, and a deep connection with mushroom
          cultivation. Our story is not simply the story of a newly established company — it is the
          story of a journey developed over many years through hands-on experience, continuous
          learning, cultivation, experimentation, and dedication to mushrooms.
        </p>

        {sections.map((section) => (
          <ContentSection key={section.title} section={section} />
        ))}

        <div className="content-section" data-reveal>
          <h2 className="content-title">Our Products</h2>
          <p>Our product range represents the versatility of mushrooms and the many ways they can be experienced — from the farm to the kitchen.</p>
          <div className="product-list-grid">
            {productRange.map((product) => (
              <div className="product-list-item" key={product.name}>
                <h4>{product.name}</h4>
                <p>{product.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="content-section" data-reveal>
          <h2 className="content-title">Our Values</h2>
          <p>Our company is built around a few fundamental values that guide every decision we make.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginTop: '20px' }}>
            {values.map((value) => (
              <div
                key={value.name}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderTop: '3px solid var(--olive)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px 18px'
                }}
              >
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--olive-deep)', marginBottom: '6px' }}>
                  {value.name}
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.65, margin: 0 }}>{value.text}</p>
              </div>
            ))}
          </div>
        </div>

        {closingSections.map((section) => (
          <ContentSection key={section.title} section={section} />
        ))}

        <div className="farm-statement" data-reveal>
          <h2>15 Years Of Experience. One Passion. One Growing Journey.</h2>
          <p>{config.name}</p>
          <p>Supplying Across India With Trust. · Guaranteed Freshness &amp; Quality.</p>
          <p>Growing with experience. Creating with care. Building for the future.</p>
        </div>
      </div>
    </div>
  );
};
