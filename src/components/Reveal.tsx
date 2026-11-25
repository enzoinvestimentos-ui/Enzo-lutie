import { useEffect, useState, type ReactNode } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';

export const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

export const EDITORIAL_SPRING = {
  stiffness: 115,
  damping: 26,
  mass: 0.75,
} as const;

export function useIsCompactMotion() {
  const [compact, setCompact] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)').matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)');
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return compact;
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: number;
  initialOpacity?: number;
  duration?: number;
  amount?: 'some' | 'all' | number;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  y = 18,
  blur = 7,
  initialOpacity = 0.18,
  duration = 0.82,
  amount = 0.12,
  className = '',
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const isCompact = useIsCompactMotion();
  const [settled, setSettled] = useState(false);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const effectiveBlur = isCompact ? 0 : blur;
  const effectiveY = isCompact ? Math.min(y, 12) : y;
  const effectiveDuration = isCompact ? Math.min(duration, 0.56) : duration;

  return (
    <motion.div
      initial={{
        opacity: initialOpacity,
        y: effectiveY,
        filter: effectiveBlur > 0 ? `blur(${effectiveBlur}px)` : 'none',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: effectiveBlur > 0 ? 'blur(0px)' : 'none',
      }}
      viewport={{ once: true, amount }}
      transition={{
        duration: effectiveDuration,
        delay: isCompact ? Math.min(delay, 0.12) : Math.min(delay, 0.24),
        ease: EDITORIAL_EASE,
      }}
      onAnimationComplete={() => setSettled(true)}
      style={settled || effectiveBlur === 0 ? { filter: 'none' } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HairlineRule({
  className = '',
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={`h-px w-full bg-[#252525] ${className}`} aria-hidden="true" />;
  }

  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0.35 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.85, delay, ease: EDITORIAL_EASE }}
      style={{ transformOrigin: 'left center' }}
      className={`h-px w-full bg-[#252525] ${className}`}
      aria-hidden="true"
    />
  );
}

export function ScrollProgressBar() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: 'left center' }}
      className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-[#f2f2f2]/80 pointer-events-none"
    />
  );
}
