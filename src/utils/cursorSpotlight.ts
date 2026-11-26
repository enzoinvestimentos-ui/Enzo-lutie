import type { MouseEvent } from 'react';

let finePointerMq: MediaQueryList | null = null;
let reducedMotionMq: MediaQueryList | null = null;

function canTrackCursor(): boolean {
  if (typeof window === 'undefined') return false;
  if (!finePointerMq) {
    finePointerMq = window.matchMedia('(hover: hover) and (pointer: fine)');
  }
  if (!reducedMotionMq) {
    reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  }
  return finePointerMq.matches && !reducedMotionMq.matches;
}

export function handleSpotlightMove<T extends HTMLElement>(e: MouseEvent<T>): void {
  if (!canTrackCursor()) return;
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  el.style.setProperty('--mx', `${x.toFixed(1)}%`);
  el.style.setProperty('--my', `${y.toFixed(1)}%`);
  el.style.setProperty('--spotlight-opacity', '1');
}

export function handleSpotlightLeave<T extends HTMLElement>(e: MouseEvent<T>): void {
  e.currentTarget.style.setProperty('--spotlight-opacity', '0');
}
