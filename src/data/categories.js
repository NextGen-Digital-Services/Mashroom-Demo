import { images } from './images.js';

export const initialCategories = [
  {
    id: "cat-1",
    name: "Fresh Mushrooms",
    slug: "fresh-mushrooms",
    description: "Fresh mushrooms for everyday cooking and food preparation.",
    image: images.categories["fresh-mushrooms"],
    featured: true,
    itemCount: 2
  },
  {
    id: "cat-2",
    name: "Mushroom Spawn",
    slug: "mushroom-spawn",
    description: "The essential starting material for mushroom cultivation.",
    image: images.categories["mushroom-spawn"],
    featured: true,
    itemCount: 2
  },
  {
    id: "cat-3",
    name: "Mushroom Powder",
    slug: "mushroom-powder",
    description: "A convenient way to add mushroom flavour to cooking and recipes.",
    image: images.categories["mushroom-powder"],
    featured: true,
    itemCount: 1
  },
  {
    id: "cat-4",
    name: "Mushroom Pickle",
    slug: "mushroom-pickle",
    description: "A traditional, flavourful form — a value-added mushroom product.",
    image: images.categories["mushroom-pickle"],
    featured: true,
    itemCount: 2
  },
  {
    id: "cat-5",
    name: "Sun-Dried Mushrooms",
    slug: "sun-dried-mushrooms",
    description: "Dried for storage and use across many types of cooking.",
    image: images.categories["sun-dried-mushrooms"],
    featured: true,
    itemCount: 2
  },
  {
    id: "cat-6",
    name: "Mushroom Soup Mix",
    slug: "mushroom-soup-mix",
    description: "An easy way to prepare mushroom soup at home.",
    image: images.categories["mushroom-soup-mix"],
    featured: false,
    itemCount: 1
  },
  {
    id: "cat-7",
    name: "Mushroom Chutney",
    slug: "mushroom-chutney",
    description: "A familiar accompaniment that combines mushrooms with an everyday format.",
    image: images.categories["mushroom-chutney"],
    featured: false,
    itemCount: 1
  },
  {
    id: "cat-8",
    name: "Home Growing Kit",
    slug: "home-growing-kit",
    description: "An accessible way to experience mushroom cultivation at home.",
    image: images.categories["home-growing-kit"],
    featured: true,
    itemCount: 1
  },
  {
    id: "cat-9",
    name: "Farm Combo Pack",
    slug: "farm-combo-pack",
    description: "Selected mushroom products together in one convenient package.",
    image: images.categories["farm-combo-pack"],
    featured: true,
    itemCount: 1
  }
];
