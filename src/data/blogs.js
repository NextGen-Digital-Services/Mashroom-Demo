import { images } from './images';

export const initialBlogs = [
  {
    id: "blog-1",
    slug: "elixir-of-clarity-understanding-lions-mane",
    title: "Elixir of Clarity: The Culinary & Cognitive Art of Lion's Mane",
    excerpt: "Discover how Hericium erinaceus stimulates nerve growth factors and elevates daily culinary rituals.",
    category: "Fungi Wellness",
    author: "Elena Rossi, Master Mycologist",
    date: "Sep 18, 2026",
    readTime: "5 min read",
    image: images.recipes[0],
    featured: true,
    content: `
      <p>For centuries across traditional mountain communities, Hericium erinaceus—affectionately known as Lion's Mane—was revered both as a regal culinary ingredient and a medicine of pristine focus.</p>
      <h3>The Science of Bioactive Hericenones</h3>
      <p>Unlike common mushrooms, Lion's Mane contains active compounds known as <em>hericenones</em> and <em>erinacines</em>. These naturally occurring bio-lipids cross the blood-brain barrier to promote Nerve Growth Factor (NGF) synthesis.</p>
      <h3>Savoring Lion's Mane at Home</h3>
      <p>Our stone-ground extract is crafted at low temperature to preserve delicate enzymes. Blend 1 teaspoon into warm oat milk, morning espresso, or dark chocolate elixirs for sustained mental clarity without jitteriness.</p>
    `
  },
  {
    id: "blog-2",
    slug: "wild-foraged-guchhi-the-himalayan-gold",
    title: "Wild Foraged Guchhi: Hunting India's Most Elusive Fungi",
    excerpt: "An inside look into the high-altitude forests where local pickers gather wild Himalayan morels after spring thunderstorms.",
    category: "Farm & Field",
    author: "Karan Verma, Estate Botanist",
    date: "Sep 10, 2026",
    readTime: "7 min read",
    image: images.recipes[1],
    featured: true,
    content: `
      <p>Deep within the pine-forested slopes of the Himalayan belt, a quiet miracle unfolds each spring following the first mountain thunders. Morchella esculenta—known locally as <strong>Guchhi</strong>—sprouts amidst moist forest humus.</p>
      <h3>Why Guchhi Cannot Be Farmed</h3>
      <p>Morels form intricate symbiotic mycorrhizal associations with native tree roots. Because this natural wood network cannot be replicated in greenhouses, every single Morel mushroom must be wild-foraged by hand.</p>
      <h3>Preparing Morel Risotto</h3>
      <p>Rehydrate dried caps in warm water for 20 minutes. Sauté in cultured butter with minced shallots, garlic, and fresh thyme, finishing with arborio rice and aged Parmigiano Reggiano.</p>
    `
  },
  {
    id: "blog-3",
    slug: "kitchen-gardening-guide-to-growing-oyster-mushrooms",
    title: "Kitchen Gardening: How to Harvest Fresh Pink Oysters in 10 Days",
    excerpt: "Step-by-step instructions for getting multiple flushes from your home growing kit with zero hassle.",
    category: "Cultivation Guide",
    author: "Simran Kaur, Cultivation Specialist",
    date: "Aug 28, 2026",
    readTime: "4 min read",
    image: images.recipes[2],
    featured: false,
    content: `
      <p>Growing your own organic mushrooms indoors is one of the most rewarding culinary experiences. With our pre-inoculated substrate logs, anyone can enjoy fresh gourmet mushrooms right off the counter.</p>
      <h3>3 Simple Steps to Success</h3>
      <ol>
        <li><strong>Cut the slit:</strong> Slice an 'X' in the plastic humidity bag.</li>
        <li><strong>Mist daily:</strong> Spray clean water twice daily over the slit using the included mister.</li>
        <li><strong>Harvest at peak:</strong> Harvest when caps expand before edges turn upward.</li>
      </ol>
    `
  }
];
