import type { ReactNode } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';

export const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

export const EDITORIAL_SPRING = {
  stiffness: 115,
  damping: 26,
  mass: 0.75,
} as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: number;
  duration?: number;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  y = 14,
  blur = 5,
  duration = 0.85,
  className = '',
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 'some' }}
      transition={{
        duration,
        delay,
        ease: EDITORIAL_EASE,
      }}
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
    return <div className={`h-px w-full bg-[#111111]/10 ${className}`} aria-hidden="true" />;
  }

  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0.35 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.85, delay, ease: EDITORIAL_EASE }}
      style={{ transformOrigin: 'left center' }}
      className={`h-px w-full bg-[#111111]/10 ${className}`}
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
      className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-[#eb4d6d] pointer-events-none"
    />
  );
}
