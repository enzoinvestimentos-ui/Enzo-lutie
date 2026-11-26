import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EDITORIAL_EASE } from './Reveal';

interface IntroSequenceProps {
  onComplete: () => void;
}

const FIRST_NAME = 'ENZO';
const LAST_NAME = 'LUTIÊ';
const TOTAL_CHARS = FIRST_NAME.length + LAST_NAME.length;
const CENTER_INDEX = (TOTAL_CHARS - 1) / 2;

const WIPE_EASE = [0.76, 0, 0.24, 1] as const;

type IntroPhase = 'enter' | 'wipe-in' | 'wipe-out';

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<IntroPhase>('enter');

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const wipeInTimer = window.setTimeout(() => {
      setPhase('wipe-in');
    }, 2050);

    const wipeOutTimer = window.setTimeout(() => {
      setPhase('wipe-out');
    }, 2520);

    const doneTimer = window.setTimeout(() => {
      onComplete();
    }, 3280);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onComplete();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(wipeInTimer);
      window.clearTimeout(wipeOutTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [prefersReducedMotion, onComplete]);

  if (prefersReducedMotion) {
    return null;
  }

  const showBackdrop = phase !== 'wipe-out';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] pointer-events-auto overflow-hidden select-none"
    >
      {/* Fundo base da abertura com atmosfera dinâmica discreta */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showBackdrop ? 1 : 0 }}
        transition={{ duration: 0.12, ease: 'linear' }}
        className="absolute inset-0 bg-[#080808]"
      >
        {/* Campo atmosférico radial orgânico que participa da entrada */}
        <motion.div
          initial={{ opacity: 0, scale: 0.72 }}
          animate={
            phase === 'enter'
              ? { opacity: 1, scale: 1.04 }
              : { opacity: 0.4, scale: 1.24 }
          }
          transition={{ duration: 1.35, ease: EDITORIAL_EASE }}
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle 54vmax at 50% 50%, rgba(158, 27, 30, 0.24) 0%, rgba(241, 239, 233, 0.045) 38%, rgba(8, 8, 8, 0) 72%)',
          }}
        />

        {/* Anel difuso secundário para profundidade sutil */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: [0, 0.65, 0.35], scale: [0.85, 1.08, 1.18] }}
          transition={{ duration: 1.5, ease: EDITORIAL_EASE }}
          className="absolute left-1/2 top-1/2 h-[62vmin] w-[62vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f2f2f2]/[0.05]"
        />
      </motion.div>

      {/* Camada de tipografia centralizada: ENZO LUTIÊ. */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={
          phase === 'enter'
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.94, filter: 'blur(4px)' }
        }
        transition={{ duration: 0.42, ease: EDITORIAL_EASE }}
        className="relative z-10 flex h-full w-full items-center justify-center px-6"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-baseline justify-center whitespace-nowrap text-[clamp(2.15rem,8.4vw,6.1rem)] leading-[0.95] tracking-[-0.035em] text-[#f2f2f2]">
            {/* ENZO */}
            <span className="inline-flex font-extrabold">
              {FIRST_NAME.split('').map((char, idx) => {
                const distance = Math.abs(idx - CENTER_INDEX);
                return (
                  <span key={`first-${idx}`} className="inline-block overflow-hidden py-[0.06em]">
                    <motion.span
                      className="inline-block"
                      initial={{ y: '115%', opacity: 0, filter: 'blur(5px)' }}
                      animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.56,
                        delay: 0.14 + distance * 0.032,
                        ease: EDITORIAL_EASE,
                      }}
                    >
                      {char}
                    </motion.span>
                  </span>
                );
              })}
            </span>

            <span className="inline-block w-[0.24em]" aria-hidden="true" />

            {/* LUTIÊ */}
            <span className="inline-flex font-light text-[#f1efe9]">
              {LAST_NAME.split('').map((char, idx) => {
                const globalIdx = FIRST_NAME.length + idx;
                const distance = Math.abs(globalIdx - CENTER_INDEX);
                return (
                  <span key={`last-${idx}`} className="inline-block overflow-hidden py-[0.06em]">
                    <motion.span
                      className="inline-block"
                      initial={{ y: '115%', opacity: 0, filter: 'blur(5px)' }}
                      animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.56,
                        delay: 0.14 + distance * 0.032,
                        ease: EDITORIAL_EASE,
                      }}
                    >
                      {char}
                    </motion.span>
                  </span>
                );
              })}
            </span>

            {/* Ponto final editorial */}
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.34, delay: 0.56, ease: EDITORIAL_EASE }}
              className="ml-[0.04em] inline-block font-extrabold text-[#9e1b1e]"
            >
              .
            </motion.span>
          </div>

          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.72, y: 0 }}
            transition={{ duration: 0.5, delay: 0.44, ease: EDITORIAL_EASE }}
            className="text-[12px] md:text-[13px] font-medium tracking-[0.14em] uppercase text-[#a1a1a1]"
          >
            Estratégia · Processos · Tecnologia
          </motion.span>
        </div>
      </motion.div>

      {/* Painéis de transição contínua (2 camadas deslizantes de baixo para cima) */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{
          y: phase === 'enter' ? '100%' : phase === 'wipe-in' ? '0%' : '-100%',
        }}
        transition={{
          duration: phase === 'wipe-in' ? 0.44 : 0.56,
          delay: phase === 'wipe-in' ? 0 : 0.12,
          ease: WIPE_EASE,
        }}
        className="absolute inset-0 z-20 bg-[#9e1b1e]"
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{
          y: phase === 'enter' ? '100%' : phase === 'wipe-in' ? '0%' : '-100%',
        }}
        transition={{
          duration: phase === 'wipe-in' ? 0.44 : 0.58,
          delay: phase === 'wipe-in' ? 0.11 : 0,
          ease: WIPE_EASE,
        }}
        className="absolute inset-0 z-30 border-t border-[#252525] bg-[#101010]"
      />
    </div>
  );
}
