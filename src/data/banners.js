import { images } from './images.js';

export const initialBanners = [
  {
    id: "ban-1",
    title: "Fresh Mushrooms. Healthy Life.",
    subtitle: "Cultivated, processed & packed by MANASI MUSHROOM & SPAWN PVT. LTD.",
    ctaText: "Explore Collection",
    ctaLink: "/shop",
    image: images.hero[0],
    active: true,
    position: "hero-1"
  },
  {
    id: "ban-2",
    title: "Supplying Across India With Trust.",
    subtitle: "From our farm in Odisha — guaranteed freshness & quality.",
    ctaText: "Our Farm",
    ctaLink: "/our-farm",
    image: images.hero[1],
    active: true,
    position: "hero-2"
  },
  {
    id: "ban-3",
    title: "Grow Mushrooms At Home",
    subtitle: "Home growing kits & mushroom spawn for every kind of grower",
    ctaText: "Shop Growing Supplies",
    ctaLink: "/category/home-growing-kit",
    image: images.hero[2],
    active: true,
    position: "promo-banner"
  }
];
