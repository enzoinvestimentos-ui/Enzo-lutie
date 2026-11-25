import { ArrowUpRight } from 'lucide-react';
import { RollingText } from './RollingText';

interface ArrowButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'dark' | 'light';
  className?: string;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

export function ArrowButton({
  label,
  onClick,
  href,
  variant = 'dark',
  className = '',
  type = 'button',
  fullWidth = false,
}: ArrowButtonProps) {
  const baseClasses =
    variant === 'dark'
      ? 'bg-[#111111] text-[#faf7f3] hover:bg-[#1e1e1e]'
      : 'bg-[#faf7f3] text-[#111111] hover:bg-[#efeae2]';

  const circleClasses =
    variant === 'dark'
      ? 'bg-[#faf7f3] text-[#111111]'
      : 'bg-[#111111] text-[#faf7f3]';

  const content = (
    <>
      <RollingText text={label} className="text-[15px] font-medium tracking-[-0.02em]" />
      <span
        className={`relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${circleClasses}`}
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

  const sharedClasses = `group inline-flex items-center justify-between gap-4 rounded-full py-2 pl-5 pr-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb4d6d] ${baseClasses} ${
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
