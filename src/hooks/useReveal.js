import { useEffect } from 'react';
import { gsap, ScrollTrigger, reducedMotion } from '../lib/motion';

const seen = new WeakSet();

function scanReveals() {
  if (reducedMotion()) return;
  const els = gsap.utils.toArray('[data-reveal], .page-hero-card').filter(
    (el) => !seen.has(el)
  );
  els.forEach((el) => {
    seen.add(el);
    const stagger = el.hasAttribute('data-reveal-stagger');
    const targets = stagger ? Array.from(el.children) : [el];
    if (!targets.length) return;
    gsap.set(targets, { opacity: 0, y: 36 });
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      stagger: stagger ? 0.09 : 0,
      clearProps: 'transform',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true
      }
    });
  });
}

// Pages lazy-load, so elements appear a tick after the route changes:
// scan a few times, the WeakSet keeps already-animated elements untouched.
export function useReveal(location) {
  useEffect(() => {
    const timers = [0, 150, 450, 900].map((ms) =>
      setTimeout(() => {
        scanReveals();
        ScrollTrigger.refresh();
      }, ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [location]);
}
