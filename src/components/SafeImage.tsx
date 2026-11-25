import { useState } from 'react';
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
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  disableEntrance = false,
  entranceDelay = 0,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

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
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );

  if (disableEntrance || prefersReducedMotion) {
    return imgElement;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 1.025, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.95, delay: entranceDelay, ease: EDITORIAL_EASE }}
      className="h-full w-full"
    >
      {imgElement}
    </motion.div>
  );
}
