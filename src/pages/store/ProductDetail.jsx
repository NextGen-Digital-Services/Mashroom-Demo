import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { GalleryZoom } from '../../components/product/GalleryZoom';
import { ReviewsSection } from '../../components/product/ReviewsSection';
import { ProductCard } from '../../components/product/ProductCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { NotFoundPage } from './NotFoundPage';
import { formatCurrency } from '../../utils/formatters';
import { Heart, ShoppingBag, Truck, ShieldCheck, Star, MapPin, CheckCircle, Minus, Plus } from 'lucide-react';

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isWishlisted, shippingTax, addToast, setIsCartOpen } = useStore();

  const product = products.find((p) => p.slug === slug);
  useDocumentTitle(product ? product.name : 'Product Detail');

  const [selectedVariant, setSelectedVariant] = useState(
    product && product.variants ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  if (!product) {
    return <NotFoundPage />;
  }

  const wishlisted = isWishlisted(product.id);
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const comparePrice = selectedVariant ? selectedVariant.compareAtPrice : product.compareAtPrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      addToast('Please enter a valid 6-digit pincode', 'error');
      return;
    }
    const isServiceable = shippingTax?.pincodes ? shippingTax.pincodes.includes(pincode) : true;
    setPincodeStatus(isServiceable ? 'available' : 'unavailable');
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="section-padding">
      <div className="container">
        
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.85rem', color: '#777', marginBottom: '24px' }}>
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <Link to={`/category/${product.categorySlug}`}>{product.category}</Link> / <span style={{ color: 'var(--espresso)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Stage Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '48px', marginBottom: '64px' }}>
          
          {/* Gallery with zoom */}
          <div>
            <GalleryZoom images={product.images} />
          </div>

          {/* Details Column */}
          <div>
            {product.tags && product.tags[0] && (
              <div style={{ marginBottom: '10px' }}>
                <Badge variant={product.tags[0]}>{product.tags[0]}</Badge>
              </div>
            )}

            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', lineHeight: 1.15, marginBottom: '12px' }}>
              {product.name}
            </h1>

            {/* Rating summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '2px', color: 'var(--gold)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--gold)" color="var(--gold)" />
                ))}
              </div>
              <span style={{ fontWeight: 700 }}>{product.rating}</span>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--olive-deep)' }}>
                {formatCurrency(currentPrice)}
              </span>
              {comparePrice && comparePrice > currentPrice && (
                <span style={{ fontSize: '1.1rem', color: '#999', textDecoration: 'line-through' }}>
                  {formatCurrency(comparePrice)}
                </span>
              )}
              <span style={{ fontSize: '0.78rem', color: 'var(--sage)', fontWeight: 700, textTransform: 'uppercase', background: 'var(--parchment)', padding: '4px 8px', borderRadius: '4px' }}>
                Inclusive of all taxes
              </span>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.6, marginBottom: '24px' }}>
              {product.shortDescription}
            </p>

            {/* Variant / Weight Selector */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <label className="eyebrow">Select Pack Size / Weight</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 'var(--radius-md)',
                        border: selectedVariant?.name === v.name ? '2px solid var(--olive)' : '1px solid var(--line)',
                        background: selectedVariant?.name === v.name ? 'var(--parchment)' : 'var(--white)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {v.name} - {formatCurrency(v.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label className="eyebrow" style={{ margin: 0 }}>Quantity</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: 'var(--radius-full)', background: 'var(--white)' }}>
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={{ padding: '8px 12px', cursor: 'pointer' }}>
                  <Minus size={14} />
                </button>
                <span style={{ padding: '0 12px', fontWeight: 700, fontSize: '0.9rem' }}>{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(currentStock || 10, q + 1))} style={{ padding: '8px 12px', cursor: 'pointer' }}>
                  <Plus size={14} />
                </button>
              </div>
              <span style={{ fontSize: '0.8rem', color: currentStock > 0 ? '#137333' : 'var(--terracotta)', fontWeight: 600 }}>
                {currentStock > 0 ? `In Stock (${currentStock} left)` : 'Out of Stock'}
              </span>
            </div>

            {/* Actions: Add to Cart & Buy Now */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
              <Button onClick={handleAddToCart} variant="primary" size="lg" style={{ flex: 1 }}>
                <ShoppingBag size={18} /> Add to Basket
              </Button>
              <Button onClick={handleBuyNow} variant="accent" size="lg" style={{ flex: 1 }}>
                Buy Now
              </Button>
              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--line)',
                  background: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={wishlisted ? "Wishlisted" : "Add to wishlist"}
              >
                <Heart size={20} fill={wishlisted ? "var(--terracotta)" : "none"} color={wishlisted ? "var(--terracotta)" : "var(--espresso)"} />
              </button>
            </div>

            {/* Mock Pincode Check */}
            <div style={{ background: 'var(--parchment)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', display: 'block', marginBottom: '8px' }}>
                Delivery Pincode Checker
              </label>
              <form onSubmit={handlePincodeCheck} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter 6-digit pincode..."
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  className="form-input"
                  style={{ fontSize: '0.85rem' }}
                />
                <Button type="submit" size="sm" variant="secondary">Check</Button>
              </form>
              {pincodeStatus === 'available' && (
                <p style={{ fontSize: '0.8rem', color: '#137333', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <CheckCircle size={14} /> Express shipping available to {pincode} in 2-4 days!
                </p>
              )}
              {pincodeStatus === 'unavailable' && (
                <p style={{ fontSize: '0.8rem', color: 'var(--terracotta)', marginTop: '8px', fontWeight: 600 }}>
                  Standard delivery available via India Post courier.
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Tabbed Info Section (Description, Ingredients, Benefits, Usage, Reviews) */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', borderBottom: '2px solid var(--line)', marginBottom: '24px', overflowX: 'auto' }}>
            {[
              { id: 'description', label: 'Harvest Description' },
              { id: 'ingredients', label: 'Ingredients & Purity' },
              { id: 'benefits', label: 'Health Benefits' },
              { id: 'usage', label: 'How to Enjoy' },
              { id: 'reviews', label: `Reviews (${product.reviewCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 24px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  borderBottom: activeTab === tab.id ? '3px solid var(--olive)' : 'none',
                  color: activeTab === tab.id ? 'var(--olive-deep)' : '#888',
                  background: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--white)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            {activeTab === 'description' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '12px' }}>
                  About This Product
                </h3>
                <p style={{ lineHeight: 1.8, color: '#444' }}>{product.longDescription}</p>
                <div style={{ marginTop: '20px', fontSize: '0.88rem', color: '#666' }}>
                  <strong>SKU:</strong> {product.sku} | <strong>Shelf Life:</strong> {product.shelfLife}
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '12px' }}>
                  100% Pure & Honest Ingredients
                </h3>
                <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--olive-deep)' }}>{product.ingredients}</p>
              </div>
            )}

            {activeTab === 'benefits' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '16px' }}>
                  Key Nutritional & Wellness Benefits
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {product.benefits && product.benefits.map((b, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                      <CheckCircle size={16} color="var(--olive)" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'usage' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '12px' }}>
                  Chef Recommended Preparation
                </h3>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#333' }}>{product.usage}</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ReviewsSection productId={product.id} productName={product.name} />
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span className="eyebrow">Complementary Flavors</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)' }}>
                You May Also Enjoy
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      <div
        className="mobile-sticky-cart"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--white)',
          padding: '12px 20px',
          borderTop: '1px solid var(--line)',
          boxShadow: '0 -4px 15px rgba(0,0,0,0.1)',
          zIndex: 900,
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{product.name}</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--olive-deep)' }}>{formatCurrency(currentPrice)}</div>
        </div>
        <Button onClick={handleAddToCart} size="sm" variant="primary">
          <ShoppingBag size={14} /> Add
        </Button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-sticky-cart { display: flex !important; }
        }
      `}</style>
    </div>
  );
};
