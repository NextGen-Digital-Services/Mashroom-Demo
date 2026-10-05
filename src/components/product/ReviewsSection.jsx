import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { FormField } from '../common/FormField';
import { formatDate } from '../../utils/formatters';

export const ReviewsSection = ({ productId, productName }) => {
  const { reviews, setReviews, addToast } = useStore();

  const productReviews = reviews.filter(
    (r) => r.productId === productId && r.status === 'approved'
  );

  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!author || !content || !title) {
      addToast('Please fill out all review fields', 'error');
      return;
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      productId,
      productName,
      author,
      rating: Number(rating),
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      status: 'approved', // Auto-approved for demo instant feedback
      title,
      content
    };

    setReviews([newRev, ...reviews]);
    addToast('Thank you! Your review has been submitted.');
    setAuthor('');
    setTitle('');
    setContent('');
    setShowForm(false);
  };

  return (
    <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '4px' }}>Customer Reviews</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>{productReviews.length} verified reviews for this harvest</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant="secondary" size="sm">
          {showForm ? 'Cancel Review' : 'Write a Review'}
        </Button>
      </div>

      {/* Write Review Form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} style={{ background: 'var(--parchment)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', border: '1px solid var(--line)' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '16px' }}>Share Your Culinary Experience</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField
              label="Your Name"
              placeholder="e.g. Dr. Ananya Iyer"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <div className="form-group">
              <label className="form-label">Rating</label>
              <select className="form-select" value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                <option value="4">★★★★☆ (4 Stars - Great)</option>
                <option value="3">★★★☆☆ (3 Stars - Average)</option>
                <option value="2">★★☆☆☆ (2 Stars - Fair)</option>
                <option value="1">★☆☆☆☆ (1 Star - Poor)</option>
              </select>
            </div>
          </div>

          <FormField
            label="Review Title"
            placeholder="e.g. Incredible flavor and rapid focus boost!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <FormField
            label="Review Comments"
            type="textarea"
            placeholder="Describe the aroma, taste, packaging or culinary pairings..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
          />

          <Button type="submit" size="sm" variant="primary">
            Submit Review
          </Button>
        </form>
      )}

      {/* Reviews List */}
      {productReviews.length === 0 ? (
        <p style={{ color: '#777', fontStyle: 'italic', fontSize: '0.9rem' }}>Be the first to leave a review for this product!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {productReviews.map((rev) => (
            <div key={rev.id} style={{ borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.author}</span>
                  {rev.verifiedPurchase && (
                    <span style={{ fontSize: '0.72rem', color: '#137333', background: '#E6F4EA', padding: '2px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={10} /> Verified Purchase
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>{formatDate(rev.date)}</span>
              </div>

              {/* Star rating */}
              <div style={{ display: 'flex', gap: '2px', color: 'var(--gold)', marginBottom: '8px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < rev.rating ? "var(--gold)" : "none"} color="var(--gold)" />
                ))}
              </div>

              <h5 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>{rev.title}</h5>
              <p style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.5 }}>{rev.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
