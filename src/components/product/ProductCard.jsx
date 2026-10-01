import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';

export const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);

  const mainImage = (product.images && product.images[0]) || '';
  const secondaryImage = (product.images && product.images[1]) || mainImage;
  const tag = (product.tags && product.tags[0]) || null;

  return (
    <div className="product-card">
      <div className="product-card-img-wrapper">
        <Link to={`/product/${product.slug}`}>
          <img
            src={mainImage}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
            onError={(e) => {
              e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23EFE6D2'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%234B5A34' font-family='serif' font-size='20'>[BRAND_NAME]</text></svg>";
            }}
          />
        </Link>

        {/* Tag Badges */}
        {tag && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
            <Badge variant={tag}>{tag}</Badge>
          </div>
        )}

        {/* Quick Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'var(--white)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 10
          }}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} fill={wishlisted ? "var(--terracotta)" : "none"} color={wishlisted ? "var(--terracotta)" : "var(--espresso)"} />
        </button>
      </div>

      <div className="product-card-content">
        <span className="product-card-category">{product.category}</span>
        <Link to={`/product/${product.slug}`}>
          <h4 className="product-card-title">{product.name}</h4>
        </Link>
        <p style={{ fontSize: '0.8rem', color: '#666', margin: '4px 0 10px', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.shortDescription}
        </p>

        {/* Rating stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--gold)', marginBottom: '12px' }}>
          <Star size={14} fill="var(--gold)" color="var(--gold)" />
          <span style={{ fontWeight: 700, color: 'var(--espresso)' }}>{product.rating}</span>
          <span style={{ color: '#888' }}>({product.reviewCount})</span>
        </div>

        <div className="product-card-price">
          <div>
            <span className="price-current">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="price-compare">{formatCurrency(product.compareAtPrice)}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="btn btn-primary btn-sm"
            style={{ marginLeft: 'auto', padding: '8px 12px' }}
            title="Add to cart"
          >
            <ShoppingBag size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};
