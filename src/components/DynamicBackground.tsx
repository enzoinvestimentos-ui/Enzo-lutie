import { useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

interface DynamicBackgroundProps {
  isHome: boolean;
}

export function DynamicBackground({ isHome }: DynamicBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();
  const [diagThreshold, setDiagThreshold] = useState<[number, number]>([0.07, 0.16]);
  const [finePointer, setFinePointer] = useState(false);

  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.7,
  });

  // Rastreia com precisão a posição da seção Diagnóstico (#bio-section) para iniciar os efeitos abaixo do Hero
  useEffect(() => {
    if (!isHome) return;

    const measure = () => {
      const bioEl = document.getElementById('bio-section');
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );

      if (!bioEl) {
        setDiagThreshold([0.07, 0.16]);
        return;
      }

      const bioTop = bioEl.getBoundingClientRect().top + window.scrollY;
      const start = Math.max(0.015, (bioTop - window.innerHeight * 0.78) / maxScroll);
      const end = Math.min(0.45, Math.max(start + 0.04, (bioTop - window.innerHeight * 0.12) / maxScroll));
      setDiagThreshold([start, end]);
    };

    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(document.body);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [isHome]);

  // Cursor sutil apenas em dispositivos com ponteiro fino (desktop)
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const smoothPointerX = useSpring(pointerX, { stiffness: 75, damping: 24, mass: 0.8 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 75, damping: 24, mass: 0.8 });

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !finePointer) return;

    const onPointerMove = (e: PointerEvent) => {
      pointerX.set(e.clientX / Math.max(1, window.innerWidth));
      pointerY.set(e.clientY / Math.max(1, window.innerHeight));
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [prefersReducedMotion, finePointer, pointerX, pointerY]);

  // Ativa progressivamente a partir de Diagnóstico (#bio-section) mantendo o Hero limpo
  const diagVisibility = useTransform(smoothScroll, diagThreshold, [0, 1]);
  const layerOpacity = isHome ? diagVisibility : 0.72;

  // Parallax orgânico e evolução tonal ao longo das seções
  const emeraldY = useTransform(smoothScroll, [0.05, 0.5, 1], ['22vh', '-8vh', '-34vh']);
  const emeraldX = useTransform(smoothScroll, [0.05, 0.55, 1], ['-10vw', '14vw', '-6vw']);
  const emeraldScale = useTransform(smoothScroll, [0.05, 0.5, 1], [0.82, 1.12, 1.24]);

  const warmY = useTransform(smoothScroll, [0.05, 0.6, 1], ['-12vh', '16vh', '-18vh']);
  const warmX = useTransform(smoothScroll, [0.05, 0.5, 1], ['16vw', '-12vw', '10vw']);
  const warmScale = useTransform(smoothScroll, [0.05, 0.55, 1], [0.9, 1.08, 0.94]);

  const horizonScale = useTransform(smoothScroll, [0.35, 0.85, 1], [0.68, 1.05, 1.22]);
  const horizonOpacity = useTransform(smoothScroll, [0.25, 0.72, 1], [0.25, 0.78, 0.95]);

  // Traço fluido SVG progressivo inspirado na continuidade entre seções
  const pathProgress = useTransform(smoothScroll, [diagThreshold[0], 0.96], [0.04, 1]);
  const svgDriftY = useTransform(smoothScroll, [0, 1], ['6vh', '-12vh']);

  const cursorXOffset = useTransform(smoothPointerX, [0, 1], ['-18vw', '18vw']);
  const cursorYOffset = useTransform(smoothPointerY, [0, 1], ['-14vh', '14vh']);

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(circle 68vw at 18% 72%, rgba(31, 107, 74, 0.11) 0%, rgba(8, 8, 8, 0) 64%), radial-gradient(circle 54vw at 84% 38%, rgba(241, 239, 233, 0.035) 0%, rgba(8, 8, 8, 0) 62%)',
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity: layerOpacity }}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Micro-grade arquitetônica difusa para dar materialidade sem competir com a tipografia */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(241, 239, 233, 0.55) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage:
            'radial-gradient(ellipse 80% 75% at 50% 50%, black 20%, transparent 90%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 75% at 50% 50%, black 20%, transparent 90%)',
        }}
      />

      {/* Campo orgânico principal (verde floresta profundo controlado) */}
      <motion.div
        style={{ x: emeraldX, y: emeraldY, scale: emeraldScale }}
        className="absolute -left-[12vw] top-[18vh] h-[72vmax] w-[72vmax] rounded-full will-change-transform"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(31, 107, 74, 0.17) 0%, rgba(31, 107, 74, 0.06) 36%, rgba(8, 8, 8, 0) 70%)',
          }}
        />
      </motion.div>

      {/* Contraluz quente off-white / grafite em movimento oposto ao scroll */}
      <motion.div
        style={{ x: warmX, y: warmY, scale: warmScale }}
        className="absolute -right-[14vw] top-[24vh] h-[64vmax] w-[64vmax] rounded-full will-change-transform"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(241, 239, 233, 0.052) 0%, rgba(241, 239, 233, 0.018) 38%, rgba(8, 8, 8, 0) 70%)',
          }}
        />
      </motion.div>

      {/* Expansão atmosférica inferior para ancorar Projetos, Sobre e Contato */}
      <motion.div
        style={{ scale: horizonScale, opacity: horizonOpacity }}
        className="absolute -bottom-[28vmax] left-1/2 h-[76vmax] w-[96vmax] -translate-x-1/2 rounded-full will-change-transform"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(31, 107, 74, 0.14) 0%, rgba(18, 18, 18, 0.45) 45%, rgba(8, 8, 8, 0) 74%)',
          }}
        />
      </motion.div>

      {/* Halo sutil reativo ao cursor (somente desktop / ponteiro fino) */}
      {finePointer && (
        <motion.div
          style={{ x: cursorXOffset, y: cursorYOffset }}
          className="absolute left-1/2 top-1/2 h-[48vmax] w-[48vmax] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                'radial-gradient(circle at center, rgba(31, 107, 74, 0.085) 0%, rgba(241, 239, 233, 0.025) 32%, rgba(8, 8, 8, 0) 68%)',
            }}
          />
        </motion.div>
      )}

      {/* Linha orgânica contínua guiada pelo scroll (inspirada na fluidez entre seções) */}
      <motion.svg
        style={{ y: svgDriftY }}
        viewBox="0 0 1440 1600"
        fill="none"
        preserveAspectRatio="none"
        className="absolute -top-[8vh] left-0 h-[118vh] w-full will-change-transform"
      >
        <defs>
          <filter id="bg-ribbon-blur" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
          <linearGradient id="bg-ribbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(31, 107, 74, 0.04)" />
            <stop offset="45%" stopColor="rgba(31, 107, 74, 0.2)" />
            <stop offset="78%" stopColor="rgba(241, 239, 233, 0.09)" />
            <stop offset="100%" stopColor="rgba(31, 107, 74, 0.06)" />
          </linearGradient>
        </defs>

        {/* Aura difusa acompanhando o percurso orgânico */}
        <motion.path
          d="M 1160 -40 C 1220 260, 260 440, 290 760 C 320 1080, 1210 1120, 1040 1620"
          stroke="url(#bg-ribbon-grad)"
          strokeWidth="36"
          strokeLinecap="round"
          filter="url(#bg-ribbon-blur)"
          style={{ pathLength: pathProgress }}
        />

        {/* Fio arquitetônico discreto para precisão editorial */}
        <motion.path
          d="M 1160 -40 C 1220 260, 260 440, 290 760 C 320 1080, 1210 1120, 1040 1620"
          stroke="rgba(241, 239, 233, 0.07)"
          strokeWidth="1.25"
          strokeLinecap="round"
          style={{ pathLength: pathProgress }}
        />
      </motion.svg>

      {/* Vinheta suave nas bordas para manter foco absoluto no conteúdo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 88% 82% at 50% 50%, rgba(8, 8, 8, 0) 48%, rgba(8, 8, 8, 0.72) 100%)',
        }}
      />
    </motion.div>
  );
}
