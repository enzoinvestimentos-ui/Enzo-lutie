import { useRef, useState, type MouseEvent } from 'react';
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
import { Reveal, HairlineRule } from './Reveal';
import { HERO_MEDIA } from '../data/portfolioData';

interface HeroBioSectionProps {
  onGetStarted: () => void;
  onExploreProjects: () => void;
}

function HoloTriangle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="holoPrism" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#111111" stopOpacity="0.88" />
          <stop offset="52%" stopColor="#eb4d6d" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#111111" stopOpacity="0.92" />
        </linearGradient>
      </defs>
      <path
        d="M27.6 10.4C29.5 7.1 34.5 7.1 36.4 10.4L54.2 41.2C56.1 44.5 53.7 48.6 49.8 48.6H14.2C10.3 48.6 7.9 44.5 9.8 41.2L27.6 10.4Z"
        stroke="url(#holoPrism)"
        strokeWidth="2.2"
        fill="none"
      />
      <path d="M32 17.5L45.2 40.5H18.8L32 17.5Z" fill="url(#holoPrism)" fillOpacity="0.14" />
    </svg>
  );
}

function MobileFlipPortrait({ mode }: { mode: 'hero' | 'bio' }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [manualFlipped, setManualFlipped] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: mode === 'hero' ? ['center 0.62', 'end 0.1'] : ['start 0.92', 'center 0.5'],
  });

  const scrollRotateY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotateY = useTransform(scrollRotateY, (v) => (manualFlipped ? v + 180 : v));

  return (
    <div ref={cardRef} className="perspective-1200 w-[230px] sm:w-[270px]">
      <motion.button
        type="button"
        onClick={() => setManualFlipped((prev) => !prev)}
        aria-label="Alternar cartão do retrato"
        style={
          prefersReducedMotion
            ? {
                rotateY:
                  mode === 'bio'
                    ? manualFlipped
                      ? 0
                      : 180
                    : manualFlipped
                      ? 180
                      : 0,
              }
            : { rotateY }
        }
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="preserve-3d relative block w-full aspect-[0.877] cursor-pointer rounded-2xl shadow-[0_18px_40px_-20px_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb4d6d]"
      >
        {/* Frente */}
        <div
          style={{ transform: 'rotateY(0deg) translateZ(1px)' }}
          className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-[#111111]/10 bg-[#111111]"
        >
          <SafeImage
            src={HERO_MEDIA.frontAvatar}
            alt="Retrato editorial em preto e branco"
            fallbackTitle="Estratégia & Tecnologia"
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Verso */}
        <div
          style={{ transform: 'rotateY(180deg) translateZ(1px)' }}
          className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-[#111111]/10 bg-[#111111]"
        >
          <SafeImage
            src={HERO_MEDIA.backAvatar}
            alt="Retrato editorial em fundo vermelho"
            fallbackTitle="Estratégia & Tecnologia"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </motion.button>
    </div>
  );
}

export function HeroBioSection({ onGetStarted, onExploreProjects }: HeroBioSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [manualFlipped, setManualFlipped] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Em desktop, o retrato sticky desliza da coluna direita (Hero) para a coluna esquerda (Diagnóstico/Bio) e gira 180° para revelar o verso
  const avatarX = useTransform(scrollYProgress, [0.08, 0.72], ['88%', '-88%']);
  const scrollRotateY = useTransform(scrollYProgress, [0.1, 0.72], [0, 180]);
  const avatarRotateY = useTransform(scrollRotateY, (v) => (manualFlipped ? v + 180 : v));
  const avatarScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.96, 1]);

  // Microinteração 3D suave ao mover o cursor sobre o cartão do retrato
  const tiltXRaw = useMotionValue(0);
  const tiltYRaw = useMotionValue(0);
  const tiltX = useSpring(tiltXRaw, { stiffness: 220, damping: 24 });
  const tiltY = useSpring(tiltYRaw, { stiffness: 220, damping: 24 });

  const handleAvatarMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltXRaw.set(-py * 8);
    tiltYRaw.set(px * 8);
  };

  const handleAvatarMouseLeave = () => {
    tiltXRaw.set(0);
    tiltYRaw.set(0);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Camada Sticky 3D do Retrato (cobrindo Hero + Bio 200vh no desktop) */}
      <div className="hidden lg:block pointer-events-none absolute inset-0 z-20 mx-auto w-full max-w-[1180px] px-6">
        <div className="sticky top-0 flex h-screen items-center justify-center">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', duration: 1.1, bounce: 0.12, delay: 0.15 }}
            style={
              prefersReducedMotion
                ? { x: '88%' }
                : {
                    x: avatarX,
                    scale: avatarScale,
                  }
            }
            className="pointer-events-auto perspective-1200"
          >
            <motion.div
              style={
                prefersReducedMotion
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
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="preserve-3d relative block w-[320px] xl:w-[360px] aspect-[0.877] cursor-pointer rounded-2xl shadow-[0_20px_50px_-24px_rgba(17,17,17,0.22)] transition-shadow duration-300 hover:shadow-[0_28px_60px_-22px_rgba(17,17,17,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb4d6d]"
              >
                {/* Frente */}
                <div
                  style={{ transform: 'rotateY(0deg) translateZ(1px)' }}
                  className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-[#111111]/10 bg-[#111111]"
                >
                  <SafeImage
                    src={HERO_MEDIA.frontAvatar}
                    alt="Retrato editorial em preto e branco"
                    fallbackTitle="Estratégia & Tecnologia"
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Verso */}
                <div
                  style={{ transform: 'rotateY(180deg) translateZ(1px)' }}
                  className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-[#111111]/10 bg-[#111111]"
                >
                  <SafeImage
                    src={HERO_MEDIA.backAvatar}
                    alt="Retrato editorial em fundo vermelho"
                    fallbackTitle="Estratégia & Tecnologia"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* SEÇÃO 1: HERO */}
      <section
        id="hero-section"
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1180px] flex-col justify-between px-6 pt-28 pb-10 lg:min-h-screen"
      >
        <div className="my-auto grid w-full grid-cols-1 items-center gap-10 py-6 lg:grid-cols-12">
          {/* Coluna Esquerda: Título, Proposta e Ações */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', duration: 0.7, bounce: 0 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={prefersReducedMotion ? undefined : { rotate: [0, 8, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <HoloTriangle className="h-8 w-8 md:h-10 md:w-10 shrink-0" />
              </motion.div>
              <span className="text-[13px] font-medium tracking-[0.04em] text-[#111111]/60 uppercase">
                Negócios primeiro · Tecnologia com propósito
              </span>
            </motion.div>

            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', duration: 0.9, bounce: 0.1, delay: 0.08 }}
              className="type-display-lg text-[#111111]"
            >
              Estratégia de negócios, processos e tecnologia.
            </motion.h1>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', duration: 0.85, bounce: 0.08, delay: 0.18 }}
              className="flex max-w-[600px] flex-col gap-4 text-[17px] md:text-[18px] leading-[1.5] tracking-[-0.02em] text-[#111111]/85"
            >
              <p>
                Ajudo empresas a identificar oportunidades, superar gargalos e transformar
                necessidades de negócio em soluções que conectam estratégia comercial, processos e
                tecnologia.
              </p>
              <p>
                Meu trabalho começa entendendo como a empresa funciona, onde estão os desafios e o
                que pode ser feito para melhorar seus resultados.
              </p>
              <p className="font-medium text-[#111111]">
                A tecnologia entra como parte da solução, não como ponto de partida.
              </p>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', duration: 0.8, bounce: 0.1, delay: 0.28 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <ArrowButton label="Vamos conversar" onClick={onGetStarted} variant="dark" />
              <button
                type="button"
                onClick={onExploreProjects}
                className="group inline-flex items-center justify-center rounded-full border border-[#111111]/20 bg-[#faf7f3] px-6 py-3.5 text-[15px] font-medium tracking-[-0.02em] text-[#111111] transition-all duration-200 hover:border-[#111111] hover:bg-[#f4efe7] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb4d6d]"
              >
                <RollingText text="Conhecer projetos" />
              </button>
            </motion.div>

            {/* Retrato Mobile / Tablet com giro 3D no scroll e toque */}
            <div className="mt-4 lg:hidden">
              <MobileFlipPortrait mode="hero" />
            </div>
          </div>

          {/* Espaçador Direito ocupado visualmente pelo Retrato Sticky no Desktop */}
          <div className="hidden lg:block lg:col-span-5" aria-hidden="true" />
        </div>

        {/* Faixa inferior de metadados com linha divisória animada */}
        <div>
          <HairlineRule delay={0.3} />
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-between gap-4 pt-5 text-[13px] md:text-[14px] font-medium tracking-[0.04em] text-[#111111]"
          >
            <span>ESTRATÉGIA · PROCESSOS · TECNOLOGIA</span>
            <div className="flex items-center gap-5 tabular-nums text-[#111111]/80">
              <span>©2026</span>
              <span>/LUMO · KRIOS CREATIVE</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO 2: DIAGNÓSTICO / ANTES DA TECNOLOGIA */}
      <section
        id="bio-section"
        className="relative z-10 mx-auto flex w-full max-w-[1180px] items-center px-6 py-20 lg:min-h-screen lg:py-24"
      >
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Espaçador Esquerdo ocupado visualmente pelo Retrato Sticky no Desktop */}
          <div className="hidden lg:block lg:col-span-6" aria-hidden="true" />

          {/* Coluna Direita: Texto integral sobre o problema antes da tecnologia */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6 max-w-[560px]">
            {/* Retrato Mobile / Tablet entrando com giro 3D para o verso */}
            <div className="lg:hidden">
              <MobileFlipPortrait mode="bio" />
            </div>

            <Reveal>
              <h2 className="text-[36px] sm:text-[42px] md:text-[48px] font-semibold leading-[1.05] tracking-[-0.02em] text-[#111111]">
                O problema, muitas vezes, está antes da tecnologia.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex flex-col gap-4 text-[17px] md:text-[18px] font-normal leading-[1.5] tracking-[-0.02em] text-[#111111]/85">
                <p>
                  É comum encontrar empresas que investem em sites, ferramentas, sistemas e
                  automações sem necessariamente resolver aquilo que motivou o investimento.
                </p>
                <p>
                  Um novo CRM não organiza, por si só, um processo comercial desestruturado. Um site
                  novo não resolve uma comunicação que não deixa claro o valor da empresa. Uma
                  automação não corrige um processo que nunca foi bem definido.
                </p>
                <p>
                  Por isso, minha primeira preocupação é entender o negócio: sua operação, seus
                  objetivos, a experiência dos clientes e a maneira como as diferentes áreas se
                  conectam.
                </p>
                <p>
                  É a partir dessa visão que identifico oportunidades e direciono soluções que
                  realmente contribuem para a evolução da empresa.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.18} className="pt-2">
              <ArrowButton label="Vamos conversar" onClick={onGetStarted} variant="dark" />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
