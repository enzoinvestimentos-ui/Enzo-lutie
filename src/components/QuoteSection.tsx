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
  const opacity = useTransform(progress, range, [0.24, 1]);
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
    offset: ['start 0.7', 'end 0.8'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.5,
  });

  return (
    <section aria-label="Abordagem e Critério" className="w-full">
      {/* Bloco Sticky de Manifesto (150vh no desktop) */}
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-[1180px] px-6 py-24 lg:h-[150vh] lg:py-0"
      >
        <div className="flex flex-col items-start justify-center gap-8 lg:sticky lg:top-0 lg:h-screen">
          <p className="type-manifesto max-w-[840px] text-[#111111]">
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

          <Reveal delay={0.1}>
            <p className="max-w-[740px] text-[18px] md:text-[20px] leading-[1.5] tracking-[-0.02em] text-[#111111]/75">
              Cada empresa possui uma realidade, uma estrutura e um momento diferentes. Por isso,
              antes de definir o que precisa ser feito, procuro compreender o contexto e identificar
              onde uma mudança pode gerar valor.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Quatro Etapas da Abordagem */}
      <div className="mx-auto w-full max-w-[1180px] px-6 pb-20 md:pb-28">
        <HairlineRule />
        <div className="pt-14">
          <Reveal>
            <h3 className="text-[26px] md:text-[32px] font-medium tracking-[-0.02em] text-[#111111] mb-8">
              Minha abordagem passa por quatro etapas:
            </h3>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {APPROACH_STEPS.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.08} className="h-full">
                <div className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-[#111111]/10 bg-[#f4efe7] p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#111111]/25 hover:bg-[#efe8dc] hover:shadow-[0_14px_32px_-20px_rgba(17,17,17,0.16)]">
                  <span className="text-[14px] font-semibold tabular-nums text-[#eb4d6d] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
                    {step.number}.
                  </span>
                  <p className="text-[16px] leading-[1.5] tracking-[-0.02em] text-[#111111]/85">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
