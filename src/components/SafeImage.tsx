import { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { EDITORIAL_EASE } from './Reveal';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  disableEntrance?: boolean;
  entranceDelay?: number;
  priority?: boolean;
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  disableEntrance = false,
  entranceDelay = 0,
  priority = false,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const [settled, setSettled] = useState(false);
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)').matches
      : false
  );
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)');
    const sync = () => setIsCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  if (failed || !src) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#161616] via-[#121212] to-[#0d0d0d] p-6 text-center text-[#a1a1a1] ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageIcon className="mb-2 h-6 w-6 opacity-50" strokeWidth={1.5} />
        {fallbackTitle && (
          <span className="text-sm font-medium tracking-[-0.02em]">{fallbackTitle}</span>
        )}
      </div>
    );
  }

  const imgElement = (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      onError={() => setFailed(true)}
      className={className}
    />
  );

  if (disableEntrance || prefersReducedMotion) {
    return imgElement;
  }

  return (
    <motion.div
      initial={
        isCompact
          ? { opacity: 0, y: 10 }
          : { opacity: 0, y: 12, scale: 1.025, filter: 'blur(6px)' }
      }
      whileInView={
        isCompact
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
      }
      viewport={{ once: true, amount: 'some' }}
      transition={{
        duration: isCompact ? 0.55 : 0.95,
        delay: isCompact ? Math.min(entranceDelay, 0.1) : entranceDelay,
        ease: EDITORIAL_EASE,
      }}
      onAnimationComplete={() => setSettled(true)}
      style={settled || isCompact ? { filter: 'none' } : undefined}
      className="h-full w-full"
    >
      {imgElement}
    </motion.div>
  );
}
