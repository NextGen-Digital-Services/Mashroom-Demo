import React from 'react';

// Decorative mushroom / botanical artwork that sits BEHIND page content.
// Pure inline SVG using the existing palette tokens — no new assets,
// no network requests, scales cleanly and stays crisp at any size.
// Rules of use: always inside a `.rel-section`, always aria-hidden,
// always low opacity so text remains the strongest element.

const Mushroom = ({ x, y, s = 1, r = 0, cap = 'var(--olive)', stem = 'var(--sage)', o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <path
      d="M6 44 C6 22 24 8 50 8 C76 8 94 22 94 44 C94 48 90 51 82 51 L18 51 C10 51 6 48 6 44 Z"
      fill={cap}
    />
    <path
      d="M38 51 C38 51 35 74 33 84 C31.5 91 38 95 50 95 C62 95 68.5 91 67 84 C65 74 62 51 62 51 Z"
      fill={stem}
    />
    <path d="M20 51 C30 57 70 57 80 51" fill="none" stroke="var(--ivory)" strokeWidth="2" opacity="0.35" />
    <circle cx="36" cy="30" r="5" fill="var(--ivory)" opacity="0.28" />
    <circle cx="60" cy="24" r="3.5" fill="var(--ivory)" opacity="0.28" />
    <circle cx="72" cy="36" r="4" fill="var(--ivory)" opacity="0.22" />
  </g>
);

const Leaf = ({ x, y, s = 1, r = 0, fill = 'var(--sage)', o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <path d="M50 2 C74 26 80 60 50 98 C20 60 26 26 50 2 Z" fill={fill} />
    <path d="M50 10 L50 92" stroke="var(--ivory)" strokeWidth="2.5" opacity="0.4" />
    <path d="M50 34 L34 26 M50 34 L66 26 M50 56 L32 48 M50 56 L68 48" stroke="var(--ivory)" strokeWidth="2" opacity="0.3" />
  </g>
);

const Sprig = ({ x, y, s = 1, r = 0, fill = 'var(--olive)', o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <path d="M4 96 C24 70 44 44 60 4" stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round" />
    {[0, 1, 2, 3].map((i) => (
      <ellipse key={`l${i}`} cx={20 + i * 14} cy={78 - i * 22} rx="13" ry="7" fill={fill} transform={`rotate(${-38 + i * 4} ${20 + i * 14} ${78 - i * 22})`} />
    ))}
    {[0, 1, 2].map((i) => (
      <ellipse key={`r${i}`} cx={34 + i * 14} cy={58 - i * 22} rx="11" ry="6" fill={fill} transform={`rotate(${34 - i * 4} ${34 + i * 14} ${58 - i * 22})`} opacity="0.8" />
    ))}
  </g>
);

const variants = {
  // Hero: large cluster anchored bottom-left, leaves framing top-right.
  hero: (
    <svg viewBox="0 0 1440 640" preserveAspectRatio="xMidYMax slice" width="100%" height="100%" focusable="false">
      <Mushroom x={-40} y={430} s={1.9} r={-6} cap="var(--olive)" stem="var(--sage)" o={0.16} />
      <Mushroom x={150} y={505} s={1.15} r={5} cap="var(--terracotta)" stem="var(--sage)" o={0.14} />
      <Mushroom x={285} y={545} s={0.75} r={-4} cap="var(--gold)" stem="var(--sage)" o={0.16} />
      <Leaf x={1270} y={-40} s={2.1} r={28} fill="var(--sage)" o={0.16} />
      <Leaf x={1360} y={120} s={1.4} r={-14} fill="var(--olive)" o={0.12} />
      <Sprig x={1160} y={430} s={1.5} r={-12} fill="var(--olive)" o={0.1} />
      <Mushroom x={1310} y={470} s={1.35} r={7} cap="var(--olive-deep)" stem="var(--sage)" o={0.13} />
      <Sprig x={30} y={60} s={1.1} r={22} fill="var(--sage)" o={0.12} />
    </svg>
  ),
  // Content pages: quiet corners only, never under the reading column.
  corner: (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" focusable="false">
      <Mushroom x={-60} y={690} s={1.6} r={-8} cap="var(--olive)" stem="var(--sage)" o={0.11} />
      <Mushroom x={110} y={790} s={0.9} r={6} cap="var(--gold)" stem="var(--sage)" o={0.11} />
      <Leaf x={1310} y={-50} s={1.9} r={32} fill="var(--sage)" o={0.12} />
      <Leaf x={1390} y={150} s={1.2} r={-10} fill="var(--olive)" o={0.09} />
      <Sprig x={1240} y={640} s={1.4} r={-18} fill="var(--olive)" o={0.09} />
      <Sprig x={-20} y={80} s={1} r={28} fill="var(--sage)" o={0.1} />
    </svg>
  ),
  // Farm page: mushroom-forward band along the base.
  farm: (
    <svg viewBox="0 0 1440 720" preserveAspectRatio="xMidYMax slice" width="100%" height="100%" focusable="false">
      <Mushroom x={-50} y={520} s={2} r={-5} cap="var(--olive-deep)" stem="var(--sage)" o={0.14} />
      <Mushroom x={190} y={600} s={1.2} r={7} cap="var(--terracotta)" stem="var(--sage)" o={0.12} />
      <Mushroom x={355} y={640} s={0.8} r={-6} cap="var(--gold)" stem="var(--sage)" o={0.13} />
      <Mushroom x={1180} y={560} s={1.7} r={6} cap="var(--olive)" stem="var(--sage)" o={0.13} />
      <Mushroom x={1370} y={640} s={1} r={-8} cap="var(--terracotta)" stem="var(--sage)" o={0.12} />
      <Leaf x={1280} y={-30} s={1.8} r={26} fill="var(--sage)" o={0.13} />
      <Leaf x={-60} y={-20} s={1.5} r={-24} fill="var(--olive)" o={0.1} />
      <Sprig x={640} y={640} s={1.2} r={-6} fill="var(--olive)" o={0.08} />
    </svg>
  ),
  // Product / light sections: barely-there watermark so cards stay readable.
  light: (
    <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" focusable="false">
      <Mushroom x={-70} y={640} s={1.5} r={-6} cap="var(--sage)" stem="var(--parchment)" o={0.14} />
      <Mushroom x={1330} y={620} s={1.4} r={8} cap="var(--sage)" stem="var(--parchment)" o={0.13} />
      <Leaf x={1340} y={-40} s={1.6} r={30} fill="var(--sage)" o={0.1} />
      <Sprig x={-30} y={40} s={1} r={26} fill="var(--sage)" o={0.08} />
    </svg>
  )
};

export const BotanicalBackdrop = ({ variant = 'hero', className = '', style }) => (
  <div className={`botanical-layer ${className}`} aria-hidden="true" style={style}>
    {variants[variant] || variants.hero}
  </div>
);
