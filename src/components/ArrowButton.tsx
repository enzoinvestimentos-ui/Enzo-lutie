import { ArrowUpRight } from 'lucide-react';
import { RollingText } from './RollingText';

interface ArrowButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'dark' | 'light' | 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
  adaptToCardHover?: boolean;
}

export function ArrowButton({
  label,
  onClick,
  href,
  variant = 'primary',
  className = '',
  type = 'button',
  fullWidth = false,
  adaptToCardHover = false,
}: ArrowButtonProps) {
  const isSecondary = variant === 'secondary';

  const baseClasses = isSecondary
    ? 'border border-[#2a2a2a] bg-transparent text-[#f2f2f2]'
    : adaptToCardHover
      ? 'bg-[#f2f2f2] text-[#080808] group-hover/card:bg-[#111111] group-hover/card:text-[#f1efe9]'
      : 'bg-[#f2f2f2] text-[#080808]';

  const circleClasses = isSecondary
    ? 'bg-[#f2f2f2] text-[#080808]'
    : adaptToCardHover
      ? 'bg-[#080808] text-[#f2f2f2] group-hover/card:bg-[#f1efe9] group-hover/card:text-[#111111]'
      : 'bg-[#080808] text-[#f2f2f2]';

  const content = (
    <>
      <RollingText text={label} className="text-[15px] font-medium tracking-[-0.02em]" />
      <span
        className={`btn-interactive-badge relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full transition-colors duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${circleClasses}`}
        aria-hidden="true"
      >
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-5 group-hover:-translate-y-5"
          strokeWidth={2}
        />
        <ArrowUpRight
          className="absolute h-4 w-4 -translate-x-5 translate-y-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0"
          strokeWidth={2}
        />
      </span>
    </>
  );

  const sharedClasses = `btn-interactive group inline-flex items-center justify-between gap-4 rounded-full py-2 pl-5 pr-2 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer ${baseClasses} ${
    fullWidth ? 'w-full' : ''
  } ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={sharedClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={sharedClasses}>
      {content}
    </button>
  );
}
