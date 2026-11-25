import { useEffect, useRef, useState, type MouseEvent } from 'react';
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
import { Reveal, HairlineRule, EDITORIAL_EASE } from './Reveal';
import { HERO_MEDIA } from '../data/portfolioData';

interface HeroBioSectionProps {
  onGetStarted: () => void;
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

function MobileFlipPortrait({ mode }: { mode: 'hero' | 'bio' }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [manualFlipped, setManualFlipped] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: mode === 'hero' ? ['center 0.62', 'end 0.1'] : ['start 0.92', 'center 0.5'],
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
      transition={{ duration: 0.9, ease: EDITORIAL_EASE }}
      className="perspective-1200 w-[230px] sm:w-[270px]"
    >
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
            className="h-full w-full object-cover object-center"
          />
        </div>
      </motion.button>
    </motion.div>
  );
}

export function HeroBioSection({ onGetStarted, onExploreProjects }: HeroBioSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [manualFlipped, setManualFlipped] = useState(false);
  const [canHoverTilt, setCanHoverTilt] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHoverTilt(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Em desktop, o retrato sticky desliza suavemente da coluna direita (Hero) para a esquerda (Diagnóstico/Bio) e gira 180°
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

  // Microinteração 3D controlada e suave ao mover o cursor sobre o cartão do retrato
  const tiltXRaw = useMotionValue(0);
  const tiltYRaw = useMotionValue(0);
  const tiltX = useSpring(tiltXRaw, { stiffness: 105, damping: 26, mass: 0.85 });
  const tiltY = useSpring(tiltYRaw, { stiffness: 105, damping: 26, mass: 0.85 });

  const handleAvatarMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || !canHoverTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltXRaw.set(-py * 4.2);
    tiltYRaw.set(px * 4.2);
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
            className="pointer-events-auto perspective-1200"
          >
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
                className="preserve-3d relative block w-[320px] xl:w-[360px] aspect-[0.877] cursor-pointer rounded-2xl shadow-[0_28px_64px_-24px_rgba(0,0,0,0.85)] transition-shadow duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_34px_76px_-22px_rgba(0,0,0,0.95)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5f5f5]"
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
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.75, ease: EDITORIAL_EASE }}
              className="flex items-center"
            >
              <span className="text-[13px] font-medium tracking-[0.04em] text-[#a1a1a1] uppercase">
                Negócios primeiro · Tecnologia com propósito
              </span>
            </motion.div>

            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.08, ease: EDITORIAL_EASE }}
              className="type-display-lg text-[#f5f5f5]"
            >
              Estratégia de negócios, processos e tecnologia.
            </motion.h1>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.85, delay: 0.16, ease: EDITORIAL_EASE }}
              className="flex max-w-[600px] flex-col gap-4 text-[17px] md:text-[18px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1]"
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
              <p className="font-medium text-[#f5f5f5]">
                A tecnologia entra como parte da solução, não como ponto de partida.
              </p>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.24, ease: EDITORIAL_EASE }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <ArrowButton label="Vamos conversar" onClick={onGetStarted} variant="primary" />
              <button
                type="button"
                onClick={onExploreProjects}
                className="group inline-flex items-center justify-center rounded-full border border-[#2a2a2a] bg-transparent px-6 py-3.5 text-[15px] font-medium tracking-[-0.02em] text-[#f5f5f5] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#f5f5f5]/55 hover:bg-[#141414] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5f5f5]"
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
          <HairlineRule delay={0.28} />
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.75, delay: 0.34, ease: EDITORIAL_EASE }}
            className="flex flex-wrap items-center justify-between gap-4 pt-5 text-[13px] md:text-[14px] font-medium tracking-[0.04em] text-[#d4d4d4]"
          >
            <span>ESTRATÉGIA · PROCESSOS · TECNOLOGIA</span>
            <div className="flex items-center gap-5 tabular-nums text-[#8e8e8e]">
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
              <h2 className="text-[36px] sm:text-[42px] md:text-[48px] font-semibold leading-[1.06] tracking-[-0.02em] text-[#f5f5f5]">
                O problema, muitas vezes, está antes da tecnologia.
              </h2>
            </Reveal>

            <div className="flex flex-col gap-4 text-[17px] md:text-[18px] font-normal leading-[1.55] tracking-[-0.015em] text-[#a1a1a1]">
              <Reveal delay={0.06}>
                <p>
                  É comum encontrar empresas que investem em sites, ferramentas, sistemas e
                  automações sem necessariamente resolver aquilo que motivou o investimento.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p>
                  Um novo CRM não organiza, por si só, um processo comercial desestruturado. Um site
                  novo não resolve uma comunicação que não deixa claro o valor da empresa. Uma
                  automação não corrige um processo que nunca foi bem definido.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <p>
                  Por isso, minha primeira preocupação é entender o negócio: sua operação, seus
                  objetivos, a experiência dos clientes e a maneira como as diferentes áreas se
                  conectam.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <p className="text-[#d4d4d4]">
                  É a partir dessa visão que identifico oportunidades e direciono soluções que
                  realmente contribuem para a evolução da empresa.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.28} className="pt-2">
              <ArrowButton label="Vamos conversar" onClick={onGetStarted} variant="primary" />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
