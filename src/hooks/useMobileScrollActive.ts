import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

type ScrollActivationMode = 'once' | 'pulse';

interface UseMobileScrollActiveOptions {
  mode?: ScrollActivationMode;
  delayMs?: number;
  pulseMs?: number;
  rootMargin?: string;
  threshold?: number;
  disabled?: boolean;
}

type ObserverCallback = (entry: IntersectionObserverEntry) => void;

const observerPool = new Map<
  string,
  { observer: IntersectionObserver; listeners: Map<Element, ObserverCallback> }
>();

function getSharedObserver(rootMargin: string, threshold: number) {
  const key = `${rootMargin}|${threshold}`;
  const existing = observerPool.get(key);
  if (existing) return existing;

  const listeners = new Map<Element, ObserverCallback>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const cb = listeners.get(entry.target);
        if (cb) cb(entry);
      }
    },
    { rootMargin, threshold }
  );

  const bundle = { observer, listeners };
  observerPool.set(key, bundle);
  return bundle;
}

function observeShared(
  el: Element,
  rootMargin: string,
  threshold: number,
  cb: ObserverCallback
) {
  const bundle = getSharedObserver(rootMargin, threshold);
  bundle.listeners.set(el, cb);
  bundle.observer.observe(el);

  return () => {
    bundle.observer.unobserve(el);
    bundle.listeners.delete(el);
    if (bundle.listeners.size === 0) {
      bundle.observer.disconnect();
      observerPool.delete(`${rootMargin}|${threshold}`);
    }
  };
}

const MOBILE_TOUCH_MEDIA = '(hover: none), (pointer: coarse), (max-width: 767px)';

export function useMobileScrollActive<T extends HTMLElement = HTMLDivElement>({
  mode = 'once',
  delayMs = 0,
  pulseMs = 1100,
  rootMargin = '-10% 0px -16% 0px',
  threshold = 0.2,
  disabled = false,
}: UseMobileScrollActiveOptions = {}) {
  const ref = useRef<T | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(false);
  const [isMobileTouch, setIsMobileTouch] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_TOUCH_MEDIA).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_TOUCH_MEDIA);
    const sync = () => setIsMobileTouch(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled || prefersReducedMotion || !isMobileTouch) {
      setIsActive(false);
      if (el) {
        el.removeAttribute('data-scroll-active');
        el.removeAttribute('data-scroll-ready');
      }
      return;
    }

    if (typeof IntersectionObserver === 'undefined') return;

    let triggered = false;
    let delayTimer: number | null = null;
    let pulseEndTimer: number | null = null;
    let readyClearTimer: number | null = null;
    let rafId = 0;

    const triggerActivation = () => {
      if (triggered) return;
      triggered = true;

      if (mode === 'pulse') {
        el.setAttribute('data-scroll-ready', 'true');
        rafId = requestAnimationFrame(() => {
          el.setAttribute('data-scroll-active', 'true');
          setIsActive(true);
        });

        pulseEndTimer = window.setTimeout(() => {
          el.setAttribute('data-scroll-active', 'false');
          setIsActive(false);
          readyClearTimer = window.setTimeout(() => {
            el.removeAttribute('data-scroll-ready');
            el.removeAttribute('data-scroll-active');
          }, 680);
        }, pulseMs);
      } else {
        el.setAttribute('data-scroll-active', 'true');
        setIsActive(true);
      }
    };

    const scheduleTrigger = () => {
      if (triggered) return;
      const introActive =
        typeof document !== 'undefined' &&
        document.documentElement.dataset.introComplete === 'false';

      if (introActive) {
        const onIntroDone = () => {
          window.removeEventListener('intro:complete', onIntroDone);
          if (delayMs > 0) {
            delayTimer = window.setTimeout(triggerActivation, delayMs);
          } else {
            triggerActivation();
          }
        };
        window.addEventListener('intro:complete', onIntroDone, { once: true });
        return;
      }

      if (delayMs > 0) {
        delayTimer = window.setTimeout(triggerActivation, delayMs);
      } else {
        triggerActivation();
      }
    };

    const unobserve = observeShared(el, rootMargin, threshold, () => {
      unobserve();
      scheduleTrigger();
    });

    return () => {
      unobserve();
      if (delayTimer !== null) window.clearTimeout(delayTimer);
      if (pulseEndTimer !== null) window.clearTimeout(pulseEndTimer);
      if (readyClearTimer !== null) window.clearTimeout(readyClearTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mode, delayMs, pulseMs, rootMargin, threshold, disabled, prefersReducedMotion, isMobileTouch]);

  return { ref, isActive };
}
