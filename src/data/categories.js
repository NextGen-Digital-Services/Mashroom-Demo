import { images } from './images';

export const initialCategories = [
  {
    id: "cat-1",
    name: "Mushroom Powder",
    slug: "mushroom-powder",
    description: "Pure, stone-ground wellness adaptogens and culinary powders.",
    image: images.categories["mushroom-powder"],
    featured: true,
    itemCount: 3
  },
  {
    id: "cat-2",
    name: "Mushroom Pickle",
    slug: "mushroom-pickle",
    description: "Handcrafted in cold-pressed mustard oil with Himalayan spices.",
    image: images.categories["mushroom-pickle"],
    featured: true,
    itemCount: 2
  },
  {
    id: "cat-3",
    name: "Sun-Dried Mushrooms",
    slug: "sun-dried-mushrooms",
    description: "Dehydrated at low heat to lock in umami and intense flavor.",
    image: images.categories["sun-dried-mushrooms"],
    featured: true,
    itemCount: 2
  },
  {
    id: "cat-4",
    name: "Farm Combo Pack",
    slug: "farm-combo-pack",
    description: "Curated gift bundles of our best-selling artisanal delicacies.",
    image: images.categories["farm-combo-pack"],
    featured: true,
    itemCount: 2
  },
  {
    id: "cat-5",
    name: "Mushroom Soup Mix",
    slug: "mushroom-soup-mix",
    description: "Gourmet instant velvety soups made with organic cream & herbs.",
    image: images.categories["mushroom-soup-mix"],
    featured: false,
    itemCount: 2
  },
  {
    id: "cat-6",
    name: "Mushroom Chutney",
    slug: "mushroom-chutney",
    description: "Tangy, spicy, and rich savories perfect with artisan bread.",
    image: images.categories["mushroom-chutney"],
    featured: false,
    itemCount: 2
  },
  {
    id: "cat-7",
    name: "Home Growing Kit",
    slug: "home-growing-kit",
    description: "Simple indoor cultivation logs for fresh, organic harvests at home.",
    image: images.categories["home-growing-kit"],
    featured: true,
    itemCount: 2
  }
];
