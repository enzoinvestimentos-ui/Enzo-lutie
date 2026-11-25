import type { CSSProperties } from 'react';

interface RollingTextProps {
  text: string;
  className?: string;
}

export function RollingText({ text, className = '' }: RollingTextProps) {
  const chars = Array.from(text);

  return (
    <span className={`rolling-link ${className}`} aria-label={text}>
      <span aria-hidden="true" className="inline-flex">
        {chars.map((char, index) => {
          const displayChar = char === ' ' ? '\u00A0' : char;
          return (
            <span
              key={`${index}-${char}`}
              className="rolling-char-wrap"
              style={{ '--char-index': index } as CSSProperties}
            >
              <span className="rolling-char-track">
                <span className="block leading-[1.2em]">{displayChar}</span>
                <span className="block leading-[1.2em]">{displayChar}</span>
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
