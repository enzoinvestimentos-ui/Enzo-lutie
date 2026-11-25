import { useEffect, useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { VALUE_PERSPECTIVES, type ValuePerspectiveItem } from '../data/portfolioData';
import { Reveal, EDITORIAL_EASE } from './Reveal';

function PerspectiveMark({ id }: { id: ValuePerspectiveItem['iconId'] }) {
  switch (id) {
    case 'site':
      return (
        <svg viewBox="0 0 120 32" className="h-7 w-auto text-[#111111]" fill="none" aria-hidden="true">
          <rect x="4" y="6" width="22" height="20" rx="3" stroke="currentColor" strokeWidth="2.2" />
          <line x1="4" y1="12" x2="26" y2="12" stroke="currentColor" strokeOpacity="0.55" strokeWidth="2.2" />
          <text x="36" y="21" fill="currentColor" fontSize="15" fontWeight="700" fontFamily="Archivo, sans-serif">
            Site
          </text>
        </svg>
      );
    case 'crm':
      return (
        <svg viewBox="0 0 120 32" className="h-7 w-auto text-[#111111]" fill="none" aria-hidden="true">
          <circle cx="10" cy="16" r="5" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="24" cy="16" r="5" stroke="currentColor" strokeOpacity="0.55" strokeWidth="2.2" />
          <text x="38" y="21" fill="currentColor" fontSize="15" fontWeight="700" fontFamily="Archivo, sans-serif">
            CRM
          </text>
        </svg>
      );
    case 'automation':
      return (
        <svg viewBox="0 0 140 32" className="h-7 w-auto text-[#111111]" fill="none" aria-hidden="true">
          <path
            d="M4 16H14L19 8L24 24L29 16H36"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="44" y="21" fill="currentColor" fontSize="15" fontWeight="700" fontFamily="Archivo, sans-serif">
            Fluxos
          </text>
        </svg>
      );
    case 'strategy':
      return (
        <svg viewBox="0 0 140 32" className="h-7 w-auto text-[#111111]" fill="none" aria-hidden="true">
          <path
            d="M4 22L13 13L19 19L28 9"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="28" cy="9" r="3" fill="currentColor" />
          <text x="40" y="21" fill="currentColor" fontSize="15" fontWeight="700" fontFamily="Archivo, sans-serif">
            Negócios
          </text>
        </svg>
      );
  }
}

function PerspectiveCard({ item }: { item: ValuePerspectiveItem }) {
  const [flipped, setFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const hoverTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setIsFinePointer(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => {
      mq.removeEventListener('change', update);
      if (hoverTimerRef.current !== null) {
        window.clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isFinePointer) return;
    setIsHovered(true);
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
    }
    // Pequeno atraso de intenção evita giros acidentais quando o cursor passa rápido pelos cartões
    hoverTimerRef.current = window.setTimeout(() => {
      setFlipped(true);
    }, 95);
  };

  const handleMouseLeave = () => {
    if (!isFinePointer) return;
    setIsHovered(false);
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = window.setTimeout(() => {
      setFlipped(false);
    }, 75);
  };

  const isActive = (isFinePointer && isHovered) || flipped;

  return (
    <div className="perspective-[1400px] h-[340px] w-full">
      <motion.button
        type="button"
        onClick={() => setFlipped((prev) => !prev)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={`${item.pillarTitle}. Alternar cartão para visualizar síntese.`}
        animate={{
          rotateY: flipped ? 180 : 0,
          y: isActive && !prefersReducedMotion ? -2 : 0,
        }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : {
                rotateY: { duration: 1.05, ease: EDITORIAL_EASE },
                y: { duration: 0.45, ease: EDITORIAL_EASE },
              }
        }
        className="preserve-3d relative h-full w-full cursor-pointer rounded-2xl text-left shadow-[0_14px_34px_-18px_rgba(0,0,0,0.65)] transition-shadow duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_24px_54px_-22px_rgba(0,0,0,0.9)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2f2f2]"
      >
        {/* Face Frontal: Título-âncora claro seguido pela declaração */}
        <div
          style={{ transform: 'rotateY(0deg) translateZ(1px)' }}
          className={`backface-hidden absolute inset-0 flex flex-col justify-between rounded-2xl border p-6 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isActive
              ? 'border-[#e2dfd7] bg-[#f1efe9] text-[#111111]'
              : 'border-[#252525] bg-[#121212] text-[#f2f2f2]'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-[12px] font-medium tracking-[0.02em] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive ? 'text-[#52524e]' : 'text-[#8e8e8e]'
              }`}
            >
              Perspectiva de valor
            </span>
            <RotateCw
              className={`h-3.5 w-3.5 shrink-0 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive ? 'text-[#111111]' : 'text-[#a1a1a1]/60'
              }`}
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <h3
              className={`text-[19px] font-semibold leading-[1.25] tracking-[-0.02em] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive ? 'text-[#111111]' : 'text-[#f2f2f2]'
              }`}
            >
              {item.pillarTitle}
            </h3>
            <p
              className={`text-[15px] font-normal leading-[1.52] tracking-[-0.012em] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive ? 'text-[#2a2a28]' : 'text-[#a1a1a1]'
              }`}
            >
              {item.statement}
            </p>
          </div>

          <div
            className={`border-t pt-4 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isActive ? 'border-[#d5d1c7]' : 'border-[#252525]'
            }`}
          >
            <p
              className={`text-[13px] font-medium transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive ? 'text-[#444440]' : 'text-[#8e8e8e]'
              }`}
            >
              {item.pillarSubtitle}
            </p>
          </div>
        </div>

        {/* Face Traseira: Síntese em off-white quente #F1EFE9 */}
        <div
          className="backface-hidden absolute inset-0 flex flex-col items-start justify-between rounded-2xl border border-[#e2dfd7] bg-[#f1efe9] p-6 text-[#111111]"
          style={{ transform: 'rotateY(180deg) translateZ(1px)' }}
        >
          <span className="text-[12px] font-medium tracking-[0.02em] text-[#52524e]">
            {item.pillarTitle}
          </span>

          <div className="my-auto">
            <PerspectiveMark id={item.iconId} />
          </div>

          <div className="flex w-full items-center justify-between gap-2 border-t border-[#d5d1c7] pt-4">
            <span className="text-[13px] font-medium text-[#3f3f3c]">{item.pillarSubtitle}</span>
            <RotateCw className="h-3.5 w-3.5 shrink-0 text-[#111111]" aria-hidden="true" />
          </div>
        </div>
      </motion.button>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-6 py-14 md:py-24">
      <div className="mb-10 md:mb-12 flex flex-col gap-3.5 max-w-[740px]">
        <Reveal>
          <span className="text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]">
            Critério de decisão
          </span>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="type-section-h2 text-[#f2f2f2]">O valor de cada solução</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-[17px] md:text-[19px] leading-[1.5] tracking-[-0.015em] text-[#a1a1a1]">
            É essa perspectiva que orienta minhas decisões e a forma como participo de cada projeto.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {VALUE_PERSPECTIVES.map((item, idx) => (
          <Reveal key={item.id} delay={idx * 0.05}>
            <PerspectiveCard item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
