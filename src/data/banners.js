import { images } from './images';

export const initialBanners = [
  {
    id: "ban-1",
    title: "Estate Harvested Fungi Delicacies",
    subtitle: "Artisanal Powders, Mountain Pickles & Cultivation Logs",
    ctaText: "Explore Collection",
    ctaLink: "/shop",
    image: images.hero[0],
    active: true,
    position: "hero-1"
  },
  {
    id: "ban-2",
    title: "The Himalayan Morel Collection",
    subtitle: "Wild-Foraged Guchhi Dried Under Mountain Sunlight",
    ctaText: "Discover Wild Morels",
    ctaLink: "/product/sun-dried-wild-morels-guchhi",
    image: images.hero[1],
    active: true,
    position: "hero-2"
  },
  {
    id: "ban-3",
    title: "Grow Fresh Pink Oysters At Home",
    subtitle: "Complete Gourmet Growing Kits Ready in 10 Days",
    ctaText: "Shop Grow Kits",
    ctaLink: "/category/home-growing-kit",
    image: images.hero[2],
    active: true,
    position: "promo-banner"
  }
];

export const initialFaqs = [
  {
    id: "faq-1",
    question: "How are your mushrooms cultivated and harvested?",
    answer: "Our mushrooms are grown on shade-draped timber log beds and organic substrate blocks at our high-altitude Himalayan estate. We avoid all synthetic pesticides, chemical fertilizers, and heavy processing."
  },
  {
    id: "faq-2",
    question: "How do I consume Mushroom Powders?",
    answer: "Our mushroom extract powders are fully water-soluble and hot-water extracted for maximum bioavailability. Simply stir 1 tsp into coffee, tea, warm milk, broth, or morning smoothies."
  },
  {
    id: "faq-3",
    question: "What is the shelf life of your pickles and powders?",
    answer: "Our pickles are preserved naturally in cold-pressed mustard oil with Himalayan spices and have a shelf life of 12 months. Powders and sun-dried mushrooms stay fresh for 18 to 24 months in an airtight container."
  },
  {
    id: "faq-4",
    question: "Do you ship nationwide across India?",
    answer: "Yes, we ship to over 19,000+ pincodes across India via express courier. Orders over ₹999 qualify for complimentary express delivery."
  },
  {
    id: "faq-5",
    question: "What if my Home Growing Kit does not sprout?",
    answer: "Every grow kit comes with our 100% Harvest Guarantee. If your kit fails to yield fresh mushrooms after following the misting instructions, contact our concierge for a free replacement."
  }
];
