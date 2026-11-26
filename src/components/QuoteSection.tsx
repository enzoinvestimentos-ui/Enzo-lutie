import { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import { APPROACH_STEPS, type ApproachStep } from '../data/portfolioData';
import { Reveal, HairlineRule, useIsCompactMotion } from './Reveal';
import { useMobileScrollActive } from '../hooks/useMobileScrollActive';

const QUOTE_TEXT =
  'Não acredito em aplicar ferramentas ou metodologias simplesmente porque estão em alta.';

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.42, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.26em]">
      {word}
    </motion.span>
  );
}

function ApproachStepCard({ step, index }: { step: ApproachStep; index: number }) {
  const { ref } = useMobileScrollActive<HTMLDivElement>({
    mode: 'once',
    delayMs: index * 80,
  });

  return (
    <div
      ref={ref}
      className="card-interactive group flex h-full flex-col justify-between gap-5 rounded-2xl border border-[#252525] bg-[#121212] p-6 transition-[background-color,border-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#e2dfd7] hover:bg-[#f1efe9]"
    >
      <div className="card-hover-content flex h-full flex-col justify-between gap-5">
        <span className="card-step-num text-[13px] font-semibold tabular-nums text-[#8e8e8e] transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:text-[#52524e]">
          {step.number}.
        </span>

        <div className="flex flex-col gap-2.5">
          <h4 className="card-ink-title text-[19px] font-semibold leading-[1.25] tracking-[-0.02em] text-[#f2f2f2] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#111111]">
            {step.title}
          </h4>
          <p className="card-ink-body text-[15px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#2a2a28]">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function QuoteSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isCompactMotion = useIsCompactMotion();
  const words = QUOTE_TEXT.split(' ');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: isCompactMotion ? ['start 0.88', 'center 0.38'] : ['start 0.72', 'end 0.78'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 125,
    damping: 28,
    mass: 0.5,
  });

  return (
    <section
      aria-label="Abordagem e Critério"
      className="w-full max-md:bg-[#0d0c0c] max-md:border-y max-md:border-[#1e1d1d]"
    >
      {/* Bloco Sticky de Manifesto (115vh no desktop para leitura fluida; pausa editorial no mobile) */}
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-[1180px] px-6 py-16 md:py-24 lg:h-[115vh] lg:py-0"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 15% 45%, rgba(158, 27, 30, 0.1) 0%, rgba(13, 12, 12, 0) 72%)',
          }}
        />
        <div className="relative flex flex-col items-start justify-center gap-6 md:gap-7 lg:sticky lg:top-0 lg:h-screen">
          <Reveal>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="h-[2px] w-4 bg-[#9e1b1e] md:hidden" />
              <span className="text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]">
                Critério de Trabalho
              </span>
            </div>
          </Reveal>

          <p className="type-manifesto max-w-[840px] text-[#f2f2f2] max-md:text-[26px] max-md:leading-[1.2]">
            {prefersReducedMotion
              ? QUOTE_TEXT
              : words.map((word, index) => {
                  const start = index / words.length;
                  const end = Math.min(1, start + 1 / words.length + 0.08);
                  return (
                    <Word
                      key={`${word}-${index}`}
                      word={word}
                      progress={smoothProgress}
                      range={[start, end]}
                    />
                  );
                })}
          </p>

          <Reveal delay={0.08}>
            <p className="max-w-[700px] text-[17px] md:text-[20px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1] max-md:border-l-2 max-md:border-[#2a2a2a] max-md:pl-3.5">
              Cada empresa possui uma realidade, estrutura e momento próprios. Antes de definir o
              que fazer, compreendo o contexto para identificar onde uma mudança gera valor real.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Quatro Etapas da Abordagem */}
      <div className="mx-auto w-full max-w-[1180px] px-6 pb-16 md:pb-24">
        <HairlineRule />
        <div className="pt-12 md:pt-14">
          <Reveal className="mb-6 md:mb-8 flex flex-col gap-2">
            <span className="text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]">
              Método em quatro etapas
            </span>
            <h3 className="text-[24px] md:text-[32px] font-semibold tracking-[-0.022em] text-[#f2f2f2]">
              Como transformo diagnóstico em execução
            </h3>
            <span className="text-[12px] font-medium text-[#787878] md:hidden">
              Deslize as etapas →
            </span>
          </Reveal>

          <div className="no-scrollbar max-md:flex max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:gap-3.5 max-md:-mx-6 max-md:px-6 max-md:pb-2 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4">
            {APPROACH_STEPS.map((step, index) => (
              <Reveal
                key={step.number}
                delay={index * 0.05}
                className="max-md:w-[78vw] max-md:max-w-[300px] max-md:shrink-0 max-md:snap-center h-full"
              >
                <ApproachStepCard step={step} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
