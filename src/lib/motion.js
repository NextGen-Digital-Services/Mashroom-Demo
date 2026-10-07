import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let tickerFn = null;

export const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initMotion() {
  if (lenis || reducedMotion()) return;
  lenis = new Lenis({
    lerp: 0.11,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6
  });
  lenis.on('scroll', ScrollTrigger.update);
  tickerFn = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);
}

export function destroyMotion() {
  if (tickerFn) gsap.ticker.remove(tickerFn);
  tickerFn = null;
  if (lenis) lenis.destroy();
  lenis = null;
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

export function scrollToEl(el) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -96 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export { gsap, ScrollTrigger };
