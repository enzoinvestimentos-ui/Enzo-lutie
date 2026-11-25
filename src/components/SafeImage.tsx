import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function SafeImage({ src, alt, className = '', fallbackTitle }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#e9e4dc] via-[#dfd8cd] to-[#d5cdc0] p-6 text-center text-[#111111]/70 ${className}`}
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

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
