import { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import { APPROACH_STEPS } from '../data/portfolioData';
import { Reveal, HairlineRule } from './Reveal';

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

export function QuoteSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const words = QUOTE_TEXT.split(' ');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.72', 'end 0.78'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 125,
    damping: 28,
    mass: 0.5,
  });

  return (
    <section aria-label="Abordagem e Critério" className="w-full">
      {/* Bloco Sticky de Manifesto (115vh no desktop para leitura fluida) */}
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-[1180px] px-6 py-16 md:py-24 lg:h-[115vh] lg:py-0"
      >
        <div className="flex flex-col items-start justify-center gap-6 md:gap-7 lg:sticky lg:top-0 lg:h-screen">
          <Reveal>
            <span className="text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]">
              Critério de Trabalho
            </span>
          </Reveal>

          <p className="type-manifesto max-w-[840px] text-[#f2f2f2]">
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
            <p className="max-w-[700px] text-[17px] md:text-[20px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1]">
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
          <Reveal className="mb-8 flex flex-col gap-2">
            <span className="text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]">
              Método em quatro etapas
            </span>
            <h3 className="text-[24px] md:text-[32px] font-semibold tracking-[-0.022em] text-[#f2f2f2]">
              Como transformo diagnóstico em execução
            </h3>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {APPROACH_STEPS.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.05} className="h-full">
                <div className="card-interactive group flex h-full flex-col justify-between gap-5 rounded-2xl border border-[#252525] bg-[#121212] p-6 transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#e2dfd7] hover:bg-[#f1efe9]">
                  <div className="card-hover-content flex h-full flex-col justify-between gap-5">
                    <span className="text-[13px] font-semibold tabular-nums text-[#8e8e8e] transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:text-[#52524e]">
                      {step.number}.
                    </span>

                    <div className="flex flex-col gap-2.5">
                      <h4 className="text-[19px] font-semibold leading-[1.25] tracking-[-0.02em] text-[#f2f2f2] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#111111]">
                        {step.title}
                      </h4>
                      <p className="text-[15px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#2a2a28]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
