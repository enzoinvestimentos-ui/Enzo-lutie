import { useEffect, useRef, useState, type MouseEvent, type RefObject } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react';
import { ArrowButton } from './ArrowButton';
import { RollingText } from './RollingText';
import { SafeImage } from './SafeImage';
import { Reveal, HairlineRule, EDITORIAL_EASE, useIsCompactMotion } from './Reveal';
import { HERO_MEDIA, WHATSAPP_CONTACT_URL } from '../data/portfolioData';
import { useMobileScrollActive } from '../hooks/useMobileScrollActive';
import { handleSpotlightLeave, handleSpotlightMove } from '../utils/cursorSpotlight';

interface HeroBioSectionProps {
  onGetStarted?: () => void;
  onExploreProjects: () => void;
}

const PORTRAIT_SCROLL_SPRING = {
  stiffness: 110,
  damping: 26,
  mass: 0.65,
} as const;

const PORTRAIT_FLIP_SPRING = {
  stiffness: 80,
  damping: 22,
  mass: 0.9,
} as const;

function MobileFlipPortrait() {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [manualFlipped, setManualFlipped] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['center 0.62', 'end 0.1'],
  });

  const scrollRotateYRaw = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const scrollRotateY = useSpring(scrollRotateYRaw, PORTRAIT_SCROLL_SPRING);
  const manualTarget = useMotionValue(0);
  const manualAngle = useSpring(manualTarget, PORTRAIT_FLIP_SPRING);

  useEffect(() => {
    manualTarget.set(manualFlipped ? 180 : 0);
  }, [manualFlipped, manualTarget]);

  const rotateY = useTransform([scrollRotateY, manualAngle], ([s, m]) => (s as number) + (m as number));

  return (
    <motion.div
      ref={cardRef}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 14, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.72, ease: EDITORIAL_EASE }}
      className="perspective-1200 w-[230px] sm:w-[270px]"
    >
      <motion.button
        type="button"
        onClick={() => setManualFlipped((prev) => !prev)}
        aria-label="Alternar cartão do retrato"
        style={
          prefersReducedMotion
            ? {
                rotateY: manualFlipped ? 180 : 0,
              }
            : { rotateY }
        }
        className="preserve-3d relative block w-full aspect-[0.877] cursor-pointer rounded-2xl shadow-[0_24px_54px_-22px_rgba(0,0,0,0.85)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5f5f5]"
      >
        {/* Frente */}
        <div
          style={{ transform: 'rotateY(0deg) translateZ(1px)' }}
          className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-[#252525] bg-[#121212]"
        >
          <SafeImage
            src={HERO_MEDIA.frontAvatar}
            alt="Retrato editorial em preto e branco"
            fallbackTitle="Estratégia & Tecnologia"
            disableEntrance
            priority
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Verso */}
        <div
          style={{ transform: 'rotateY(180deg) translateZ(1px)' }}
          className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-[#252525] bg-[#121212]"
        >
          <SafeImage
            src={HERO_MEDIA.backAvatar}
            alt="Retrato editorial em fundo vermelho"
            fallbackTitle="Estratégia & Tecnologia"
            disableEntrance
            priority
            className="h-full w-full object-cover object-center"
          />
        </div>
      </motion.button>
      <p className="mt-2.5 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-[#7c7c7c] md:hidden">
        Toque ou role para girar
      </p>
    </motion.div>
  );
}

function MobileDiagnosticRow({
  indexLabel,
  title,
  description,
  delay,
  delayMs,
}: {
  indexLabel: string;
  title: string;
  description: string;
  delay: number;
  delayMs: number;
}) {
  const { ref } = useMobileScrollActive<HTMLDivElement>({
    mode: 'once',
    delayMs,
  });

  return (
    <div
      ref={ref}
      onMouseMove={handleSpotlightMove}
      onMouseLeave={handleSpotlightLeave}
      className="mobile-diagnostic-row desktop-spotlight-surface group/diag py-3.5 transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] max-md:rounded-xl max-md:border max-md:border-[#222222] max-md:bg-[#101010] max-md:px-4 max-md:py-3.5 md:-mx-4 md:rounded-xl md:border md:border-transparent md:px-4 md:py-4 md:hover:-translate-y-0.5 md:hover:border-[#362021] md:hover:bg-[#141111]/90"
    >
      <Reveal delay={delay} className="relative z-10 flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3">
        <div className="flex items-center gap-2 sm:w-[138px] sm:shrink-0">
          <span
            aria-hidden="true"
            className="mobile-diagnostic-dot inline-block h-1.5 w-1.5 rounded-full bg-[#4a4a4a] transition-[background-color,box-shadow] duration-500 md:hidden"
          />
          <span className="text-[11px] font-semibold tabular-nums text-[#787878] md:text-[#5c5c5c] md:transition-colors md:duration-300 md:group-hover/diag:text-[#9e1b1e]">
            {indexLabel}
          </span>
          <span className="text-[14px] font-semibold text-[#f2f2f2] md:transition-transform md:duration-300 md:group-hover/diag:translate-x-0.5">
            {title}
          </span>
        </div>
        <span className="text-[15px] leading-[1.5] text-[#a1a1a1] md:transition-colors md:duration-300 md:group-hover/diag:text-[#d4d4d4]">
          {description}
        </span>
      </Reveal>
    </div>
  );
}

function DesktopStickyPortrait({
  containerRef,
  canHoverTilt,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  canHoverTilt: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [manualFlipped, setManualFlipped] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const avatarXRaw = useTransform(scrollYProgress, [0.08, 0.72], [88, -88]);
  const avatarXSpring = useSpring(avatarXRaw, PORTRAIT_SCROLL_SPRING);
  const avatarX = useTransform(avatarXSpring, (v) => `${v}%`);

  const scrollRotateYRaw = useTransform(scrollYProgress, [0.1, 0.72], [0, 180]);
  const scrollRotateY = useSpring(scrollRotateYRaw, PORTRAIT_SCROLL_SPRING);

  const manualTarget = useMotionValue(0);
  const manualAngle = useSpring(manualTarget, PORTRAIT_FLIP_SPRING);

  useEffect(() => {
    manualTarget.set(manualFlipped ? 180 : 0);
  }, [manualFlipped, manualTarget]);

  const avatarRotateY = useTransform(
    [scrollRotateY, manualAngle],
    ([s, m]) => (s as number) + (m as number)
  );

  const avatarScaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.965, 1]);
  const avatarScale = useSpring(avatarScaleRaw, PORTRAIT_SCROLL_SPRING);
  const crimsonAuraOpacity = useTransform(scrollYProgress, [0.16, 0.68], [0.22, 0.88]);

  const tiltXRaw = useMotionValue(0);
  const tiltYRaw = useMotionValue(0);
  const tiltX = useSpring(tiltXRaw, { stiffness: 105, damping: 26, mass: 0.85 });
  const tiltY = useSpring(tiltYRaw, { stiffness: 105, damping: 26, mass: 0.85 });

  const handleAvatarMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || !canHoverTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltXRaw.set(-py * 4.5);
    tiltYRaw.set(px * 4.5);
  };

  const handleAvatarMouseLeave = () => {
    tiltXRaw.set(0);
    tiltYRaw.set(0);
  };

  return (
    <div className="hidden lg:block pointer-events-none absolute inset-0 z-20 mx-auto w-full max-w-[1180px] px-6">
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.14, ease: EDITORIAL_EASE }}
          style={
            prefersReducedMotion
              ? { x: '88%' }
              : {
                  x: avatarX,
                  scale: avatarScale,
                }
          }
          className="group/portrait pointer-events-auto relative perspective-1200"
        >
          {/* Aura carmim progressiva que acompanha o giro para o verso vermelho */}
          <motion.div
            aria-hidden="true"
            style={prefersReducedMotion ? { opacity: 0.35 } : { opacity: crimsonAuraOpacity }}
            className="pointer-events-none absolute -inset-12 -z-10 rounded-full"
          >
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(158, 27, 30, 0.24) 0%, rgba(158, 27, 30, 0.06) 44%, rgba(8, 8, 8, 0) 74%)',
              }}
            />
          </motion.div>

          <motion.div
            style={
              prefersReducedMotion || !canHoverTilt
                ? undefined
                : {
                    rotateX: tiltX,
                    rotateY: tiltY,
                    transformStyle: 'preserve-3d',
                  }
            }
          >
            <motion.button
              type="button"
              onClick={() => setManualFlipped((f) => !f)}
              onMouseMove={handleAvatarMouseMove}
              onMouseLeave={handleAvatarMouseLeave}
              aria-label="Alternar cartão do retrato"
              style={
                prefersReducedMotion
                  ? { rotateY: manualFlipped ? 180 : 0 }
                  : {
                      rotateY: avatarRotateY,
                    }
              }
              className="preserve-3d relative block w-[320px] xl:w-[360px] aspect-[0.877] cursor-pointer rounded-2xl shadow-[0_28px_64px_-24px_rgba(0,0,0,0.85)] transition-shadow duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_36px_80px_-20px_rgba(158,27,30,0.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5f5f5]"
            >
              {/* Frente */}
              <div
                style={{ transform: 'rotateY(0deg) translateZ(1px)' }}
                className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-[#252525] bg-[#121212] transition-colors duration-500 group-hover/portrait:border-[#383838]"
              >
                <SafeImage
                  src={HERO_MEDIA.frontAvatar}
                  alt="Retrato editorial em preto e branco"
                  fallbackTitle="Estratégia & Tecnologia"
                  disableEntrance
                  priority
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* Verso */}
              <div
                style={{ transform: 'rotateY(180deg) translateZ(1px)' }}
                className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-[#252525] bg-[#121212] transition-colors duration-500 group-hover/portrait:border-[#5b2224]"
              >
                <SafeImage
                  src={HERO_MEDIA.backAvatar}
                  alt="Retrato editorial em fundo vermelho"
                  fallbackTitle="Estratégia & Tecnologia"
                  disableEntrance
                  priority
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </motion.button>
          </motion.div>

          <p className="pointer-events-none mt-3 text-center text-[11px] font-medium tracking-[0.06em] text-[#8e8e8e] opacity-0 translate-y-1 transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/portrait:opacity-100 group-hover/portrait:translate-y-0">
            Clique para girar
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function HeroBioSection({ onExploreProjects }: HeroBioSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isCompactMotion = useIsCompactMotion();
  const [h1Settled, setH1Settled] = useState(false);
  const [canHoverTilt, setCanHoverTilt] = useState(false);
  const { ref: exploreBtnRef } = useMobileScrollActive<HTMLButtonElement>({
    mode: 'pulse',
    delayMs: 320,
    pulseMs: 1100,
  });
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  );

  useEffect(() => {
    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const deskMq = window.matchMedia('(min-width: 1024px)');
    const updateHover = () => setCanHoverTilt(hoverMq.matches);
    const updateDesk = () => setIsDesktop(deskMq.matches);
    updateHover();
    updateDesk();
    hoverMq.addEventListener('change', updateHover);
    deskMq.addEventListener('change', updateDesk);
    return () => {
      hoverMq.removeEventListener('change', updateHover);
      deskMq.removeEventListener('change', updateDesk);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Camada Sticky 3D do Retrato montada somente no desktop */}
      {isDesktop && (
        <DesktopStickyPortrait containerRef={containerRef} canHoverTilt={canHoverTilt} />
      )}

      {/* SEÇÃO 1: HERO */}
      <section
        id="hero-section"
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1180px] flex-col justify-between px-6 pt-24 pb-8 md:pt-28 md:pb-10 lg:min-h-screen"
      >
        <div className="my-auto grid w-full grid-cols-1 items-center gap-8 py-4 md:gap-10 md:py-6 lg:grid-cols-12">
          {/* Coluna Esquerda: Hierarquia clara em camadas (Kicker -> H1 -> Posicionamento -> CTA) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-5 md:gap-6">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EDITORIAL_EASE }}
              className="flex items-center"
            >
              <span className="text-[13px] font-medium tracking-[0.02em] text-[#a1a1a1]">
                Enzo Lutiê · Negócios, estratégia comercial e tecnologia
              </span>
            </motion.div>

            <motion.h1
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 10,
                      filter: isCompactMotion ? 'none' : 'blur(2px)',
                    }
              }
              animate={{ opacity: 1, y: 0, filter: isCompactMotion ? 'none' : 'blur(0px)' }}
              transition={{ duration: isCompactMotion ? 0.42 : 0.48, ease: EDITORIAL_EASE }}
              onAnimationComplete={() => setH1Settled(true)}
              style={h1Settled || isCompactMotion ? { filter: 'none' } : undefined}
              className="type-display-lg text-[#f2f2f2]"
            >
              Estratégia de negócios, processos e tecnologia.
            </motion.h1>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.06, ease: EDITORIAL_EASE }}
              className="flex max-w-[560px] flex-col gap-3 text-[16px] md:text-[18px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1]"
            >
              <p>
                Ajudo empresas a identificar oportunidades, superar gargalos e conectar estratégia
                comercial, operação e soluções digitais para melhorar resultados.
              </p>
              <p className="font-medium text-[#f2f2f2] max-md:border-l-2 max-md:border-[#9e1b1e] max-md:pl-3.5 md:border-t md:border-[#222222] md:pt-3.5">
                A tecnologia entra como parte da solução, não como ponto de partida.
              </p>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.12, ease: EDITORIAL_EASE }}
              className="flex flex-wrap items-center gap-3.5 pt-1 md:gap-4 md:pt-2"
            >
              <ArrowButton label="Vamos conversar" href={WHATSAPP_CONTACT_URL} variant="primary" />
              <button
                ref={exploreBtnRef}
                type="button"
                onClick={onExploreProjects}
                className="btn-interactive group inline-flex items-center justify-center rounded-full border border-[#2a2a2a] bg-transparent px-6 py-3.5 text-[15px] font-medium tracking-[-0.02em] text-[#f2f2f2] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RollingText text="Conhecer projetos" />
              </button>
            </motion.div>

            {/* Retrato Mobile / Tablet único com giro 3D no scroll e toque */}
            <div className="relative mt-4 self-center lg:hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-80 md:hidden"
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(158, 27, 30, 0.16) 0%, rgba(8, 8, 8, 0) 70%)',
                }}
              />
              <MobileFlipPortrait />
            </div>
          </div>

          {/* Espaçador Direito ocupado visualmente pelo Retrato Sticky no Desktop */}
          <div className="hidden lg:block lg:col-span-5" aria-hidden="true" />
        </div>

        {/* Faixa inferior discreta de posicionamento */}
        <div>
          <HairlineRule delay={0.16} />
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease: EDITORIAL_EASE }}
            className="flex flex-wrap items-center justify-between gap-3 pt-4 text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]"
          >
            <span className="text-[#a1a1a1]">Estratégia · Processos · Tecnologia</span>
            <div className="flex items-center gap-4 tabular-nums">
              <span>Lumo · Krios Creative</span>
              <span aria-hidden="true" className="text-[#404040]">
                ·
              </span>
              <span>©2026</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO 2: DIAGNÓSTICO / ANTES DA TECNOLOGIA */}
      <section
        id="bio-section"
        className="relative z-10 w-full max-md:border-t max-md:border-[#1a1a1a] max-md:bg-[radial-gradient(ellipse_90%_55%_at_50%_0%,rgba(158,27,30,0.085)_0%,rgba(8,8,8,0)_100%)] md:border-t md:border-[#1a1a1a]/90 md:bg-[radial-gradient(ellipse_55%_55%_at_76%_24%,rgba(158,27,30,0.09)_0%,rgba(8,8,8,0)_74%)]"
      >
        <div className="mx-auto flex w-full max-w-[1180px] items-center px-6 py-14 md:py-20 lg:min-h-screen lg:py-24">
          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Espaçador Esquerdo ocupado visualmente pelo Retrato Sticky no Desktop */}
            <div className="hidden lg:block lg:col-span-6" aria-hidden="true" />

            {/* Coluna Direita: Leitura por camadas com chunking dos diagnósticos */}
            <div className="lg:col-span-6 flex flex-col items-start gap-5 md:gap-6 max-w-[560px]">
              <Reveal className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#9e1b1e] md:hidden" />
                  <span className="text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]">
                    Diagnóstico
                  </span>
                </div>
                <h2 className="text-[30px] sm:text-[38px] md:text-[46px] font-semibold leading-[1.08] tracking-[-0.025em] text-[#f2f2f2] text-balance">
                  O problema, muitas vezes, está antes da tecnologia.
                </h2>
              </Reveal>

              <Reveal delay={0.05}>
                <p className="text-[16px] md:text-[18px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1]">
                  É comum empresas investirem em sites, sistemas e automações sem resolver o que
                  motivou o investimento:
                </p>
              </Reveal>

              {/* Chunking visual dos 3 contrastes centrais com revelação progressiva no scroll */}
              <div className="w-full flex flex-col max-md:gap-2.5 md:gap-1.5">
                <MobileDiagnosticRow
                  indexLabel="01"
                  title="Novo CRM"
                  description="Não organiza, por si só, um processo comercial desestruturado."
                  delay={0.06}
                  delayMs={40}
                />
                <MobileDiagnosticRow
                  indexLabel="02"
                  title="Novo site"
                  description="Não resolve uma comunicação que não deixa claro o valor da empresa."
                  delay={0.12}
                  delayMs={120}
                />
                <MobileDiagnosticRow
                  indexLabel="03"
                  title="Automação"
                  description="Não corrige um processo que nunca foi bem definido."
                  delay={0.18}
                  delayMs={200}
                />
              </div>

              <Reveal delay={0.14}>
                <p className="text-[16px] md:text-[17px] leading-[1.55] tracking-[-0.015em] text-[#d4d4d4] max-md:rounded-xl max-md:border max-md:border-[#242424] max-md:bg-[#121212]/90 max-md:p-4 md:rounded-xl md:border md:border-[#242424] md:bg-[#121212]/75 md:p-5 md:transition-colors md:duration-500 md:hover:border-[#3c2324] md:hover:bg-[#151212]">
                  Por isso, minha primeira preocupação é entender a operação, os objetivos e a
                  experiência dos clientes para direcionar soluções que realmente evoluem o negócio.
                </p>
              </Reveal>

              <Reveal delay={0.16} className="pt-1">
                <ArrowButton label="Vamos conversar" href={WHATSAPP_CONTACT_URL} variant="primary" />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
