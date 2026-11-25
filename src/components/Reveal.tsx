import type { ReactNode } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, y = 18, className = '' }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{
        type: 'spring',
        duration: 0.8,
        bounce: 0.15,
        delay,
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
      initial={{ scaleX: 0, opacity: 0.4 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
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
    stiffness: 240,
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
