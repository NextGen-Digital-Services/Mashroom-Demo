import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { images } from '../../data/images';

const FALLBACK = images.categories['fresh-mushrooms'];

export const CategoryRail = () => {
  const { categories } = useStore();

  return (
    <div className="cat-rail" aria-label="Shop by category">
      {categories.map((cat) => (
        <Link key={cat.id || cat.slug} to={`/category/${cat.slug}`} className="cat-rail-item">
          <span className="cat-rail-ico">
            <img
              src={cat.image || FALLBACK}
              alt=""
              loading="lazy"
              onError={(e) => { if (e.target.src !== FALLBACK) e.target.src = FALLBACK; }}
            />
          </span>
          <span className="cat-rail-label">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
};
