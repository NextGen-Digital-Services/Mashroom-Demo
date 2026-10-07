import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/motion';

export const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.25
      }
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        transformOrigin: 'left center',
        transform: 'scaleX(0)',
        zIndex: 1001,
        background: 'linear-gradient(90deg, var(--gold), var(--olive))',
        pointerEvents: 'none'
      }}
    />
  );
};
