import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Hero animations — play immediately with a short delay, no scroll trigger
  gsap.utils.toArray<HTMLElement>('[data-animate="hero-fade-up"]').forEach((el, i) => {
    gsap.from(el, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2 + i * 0.15,
      ease: 'power2.out',
      clearProps: 'all',
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-animate="hero-scale-in"]').forEach((el) => {
    gsap.from(el, {
      scale: 0.9,
      opacity: 0,
      duration: 0.7,
      delay: 0.6,
      ease: 'power2.out',
      clearProps: 'all',
    });
  });

  // Fade up — elements slide up and fade in
  gsap.utils.toArray<HTMLElement>('[data-animate="fade-up"]').forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Fade in — elements fade in without vertical movement
  gsap.utils.toArray<HTMLElement>('[data-animate="fade-in"]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Stagger — children of this element animate in sequence
  gsap.utils.toArray<HTMLElement>('[data-animate="stagger"]').forEach((container) => {
    const children = container.children;
    gsap.from(children, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.15,
      clearProps: 'all',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Scale in — elements scale up from slightly smaller
  gsap.utils.toArray<HTMLElement>('[data-animate="scale-in"]').forEach((el) => {
    gsap.from(el, {
      scale: 0.9,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Counter — animate numbers from 0 to their target value
  gsap.utils.toArray<HTMLElement>('[data-animate="counter"]').forEach((el) => {
    const target = el.textContent || '0';
    const numericMatch = target.match(/[\d,]+/);
    if (!numericMatch) return;

    const endValue = parseInt(numericMatch[0].replace(/,/g, ''), 10);
    const prefix = target.slice(0, target.indexOf(numericMatch[0]));
    const suffix = target.slice(target.indexOf(numericMatch[0]) + numericMatch[0].length);

    const obj = { value: 0 };
    gsap.to(obj, {
      value: endValue,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        el.textContent = prefix + Math.round(obj.value).toLocaleString() + suffix;
      },
    });
  });

  // Slide in from left
  gsap.utils.toArray<HTMLElement>('[data-animate="slide-left"]').forEach((el) => {
    gsap.from(el, {
      x: -60,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Slide in from right
  gsap.utils.toArray<HTMLElement>('[data-animate="slide-right"]').forEach((el) => {
    gsap.from(el, {
      x: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}

export function destroyAnimations(): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}
