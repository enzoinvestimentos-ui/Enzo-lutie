import { useEffect, useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import { VALUE_PERSPECTIVES, type ValuePerspectiveItem } from '../data/portfolioData';
import { Reveal, useIsCompactMotion } from './Reveal';
import { useMobileScrollActive } from '../hooks/useMobileScrollActive';

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

const CARD_FLIP_EASE = [0.37, 0, 0.63, 1] as const;

function PerspectiveCard({ item, index }: { item: ValuePerspectiveItem; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isCompactMotion = useIsCompactMotion();
  const hoverTimerRef = useRef<number | null>(null);
  const animControlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const hasInteractedRef = useRef(false);

  const { ref: cardObserveRef, isActive: scrollGlimpse } = useMobileScrollActive<HTMLDivElement>({
    mode: 'once',
    delayMs: index * 110,
  });

  const rotateY = useMotionValue(0);

  // Profundidade orgânica: elevação e leve aproximação espacial durante o giro
  const cardLiftY = useTransform(rotateY, (deg) => {
    if (prefersReducedMotion) return 0;
    const arc = Math.sin((deg / 180) * Math.PI);
    return -(arc * 6 + (deg / 180) * 2);
  });

  const cardScale = useTransform(rotateY, (deg) => {
    if (prefersReducedMotion) return 1;
    const arc = Math.sin((deg / 180) * Math.PI);
    return 1 + arc * 0.025;
  });

  // Blur óptico sutil proporcional à rotação; nítido (none) quando em repouso
  const maxBlurPx = isCompactMotion ? 1.25 : 2.1;
  const motionBlur = useTransform(rotateY, (deg) => {
    if (prefersReducedMotion) return 'none';
    const arc = Math.sin((deg / 180) * Math.PI);
    const px = Math.pow(Math.max(0, arc), 1.35) * maxBlurPx;
    return px < 0.06 ? 'none' : `blur(${px.toFixed(2)}px)`;
  });

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

  useEffect(() => {
    const target = flipped ? 180 : 0;
    animControlsRef.current?.stop();

    if (prefersReducedMotion) {
      rotateY.set(target);
      return;
    }

    const current = rotateY.get();
    const distanceRatio = Math.abs(target - current) / 180;
    if (distanceRatio < 0.001) {
      rotateY.set(target);
      return;
    }

    const baseDuration = isCompactMotion ? 1.3 : 1.45;
    const duration = Math.max(0.6, distanceRatio * baseDuration);
    setIsFlipping(true);
    animControlsRef.current = animate(rotateY, target, {
      duration,
      ease: CARD_FLIP_EASE,
      onComplete: () => setIsFlipping(false),
      onStop: () => setIsFlipping(false),
    });

    return () => {
      animControlsRef.current?.stop();
    };
  }, [flipped, prefersReducedMotion, isCompactMotion, rotateY]);

  // Adaptação 3D sutil no mobile: leve inclinação de presença ao entrar na tela (sem virar automaticamente)
  useEffect(() => {
    if (!scrollGlimpse || isFinePointer || prefersReducedMotion || hasInteractedRef.current || flipped) {
      return;
    }

    setIsFlipping(true);
    const controls = animate(rotateY, [0, 15, 0], {
      duration: 1.05,
      ease: CARD_FLIP_EASE,
      onComplete: () => setIsFlipping(false),
      onStop: () => setIsFlipping(false),
    });
    animControlsRef.current = controls;

    return () => {
      controls.stop();
    };
  }, [scrollGlimpse, isFinePointer, prefersReducedMotion, flipped, rotateY]);

  const handleMouseEnter = () => {
    if (!isFinePointer) return;
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
    }
    // Pequeno atraso de intenção evita giros acidentais quando o cursor passa rápido pelos cartões
    hoverTimerRef.current = window.setTimeout(() => {
      setFlipped(true);
    }, 105);
  };

  const handleMouseLeave = () => {
    if (!isFinePointer) return;
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = window.setTimeout(() => {
      setFlipped(false);
    }, 90);
  };

  return (
    <div
      ref={cardObserveRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="perspective-1200 h-[340px] w-full"
    >
      <motion.button
        type="button"
        onClick={() => {
          hasInteractedRef.current = true;
          setFlipped((prev) => !prev);
        }}
        aria-label={`${item.pillarTitle}. Alternar cartão para visualizar síntese.`}
        style={{
          rotateY,
          y: cardLiftY,
          scale: cardScale,
        }}
        className={`preserve-3d relative h-full w-full cursor-pointer rounded-2xl text-left shadow-[0_14px_34px_-18px_rgba(0,0,0,0.65)] transition-shadow duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_24px_54px_-22px_rgba(0,0,0,0.9)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2f2f2]${isFlipping ? ' will-change-transform' : ''}`}
      >
        {/* Face Frontal: Escura #121212 */}
        <div
          style={{ transform: 'rotateY(0deg) translateZ(1px)' }}
          className="backface-hidden absolute inset-0 rounded-2xl border border-[#252525] bg-[#121212] p-6 text-[#f2f2f2]"
        >
          <motion.div
            style={{ filter: motionBlur }}
            className="flex h-full flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-medium tracking-[0.02em] text-[#8e8e8e]">
                Perspectiva de valor
              </span>
              <RotateCw className="h-3.5 w-3.5 shrink-0 text-[#a1a1a1]/60" aria-hidden="true" />
            </div>

            <div className="flex flex-col gap-2.5">
              <h3 className="text-[19px] font-semibold leading-[1.25] tracking-[-0.02em] text-[#f2f2f2]">
                {item.pillarTitle}
              </h3>
              <p className="text-[15px] font-normal leading-[1.52] tracking-[-0.012em] text-[#a1a1a1]">
                {item.statement}
              </p>
            </div>

            <div className="border-t border-[#252525] pt-4">
              <p className="text-[13px] font-medium text-[#8e8e8e]">{item.pillarSubtitle}</p>
            </div>
          </motion.div>
        </div>

        {/* Face Traseira: Síntese em off-white quente #F1EFE9 */}
        <div
          className="backface-hidden absolute inset-0 rounded-2xl border border-[#e2dfd7] bg-[#f1efe9] p-6 text-[#111111]"
          style={{ transform: 'rotateY(180deg) translateZ(1px)' }}
        >
          <motion.div
            style={{ filter: motionBlur }}
            className="flex h-full w-full flex-col items-start justify-between"
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
          </motion.div>
        </div>
      </motion.button>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-6 py-14 md:py-24 max-md:border-t max-md:border-[#1c1c1c]">
      <div className="mb-8 md:mb-12 flex flex-col gap-3.5 max-w-[740px]">
        <Reveal>
          <span className="text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]">
            Critério de decisão
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="type-section-h2 text-[#f2f2f2]">O valor de cada solução</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-[17px] md:text-[19px] leading-[1.5] tracking-[-0.015em] text-[#a1a1a1]">
            É essa perspectiva que orienta minhas decisões e a forma como participo de cada projeto.
          </p>
        </Reveal>
        <p className="sm:hidden text-[12px] font-medium tracking-[0.02em] text-[#9e1b1e]">
          Toque para virar · Deslize →
        </p>
      </div>

      <div className="no-scrollbar flex overflow-x-auto snap-x snap-mandatory gap-3.5 -mx-6 px-6 pb-2 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible xl:grid-cols-4">
        {VALUE_PERSPECTIVES.map((item, idx) => (
          <Reveal
            key={item.id}
            delay={idx * 0.06}
            blur={0}
            className="w-[78vw] max-w-[300px] shrink-0 snap-center sm:w-auto sm:max-w-none"
          >
            <PerspectiveCard item={item} index={idx} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
