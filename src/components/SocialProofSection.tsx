import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { Play, X } from 'lucide-react';
import { type VideoTestimonialItem } from '../data/socialProofData';
import { Reveal, EDITORIAL_EASE, useIsCompactMotion } from './Reveal';
import { useMobileScrollActive } from '../hooks/useMobileScrollActive';
import { useLanguage } from '../i18n/LanguageContext';

function getEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const ytShorts = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i);
  if (ytShorts?.[1]) {
    return `https://www.youtube.com/embed/${ytShorts[1]}?autoplay=1&rel=0&playsinline=1`;
  }

  const ytWatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/i);
  if (ytWatch?.[1]) {
    return `https://www.youtube.com/embed/${ytWatch[1]}?autoplay=1&rel=0&playsinline=1`;
  }

  const ytEmbed = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i);
  if (ytEmbed?.[1]) {
    return `https://www.youtube.com/embed/${ytEmbed[1]}?autoplay=1&rel=0&playsinline=1`;
  }

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo?.[1]) {
    return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  }

  const loom = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i);
  if (loom?.[1]) {
    return `https://www.loom.com/embed/${loom[1]}?autoplay=1`;
  }

  return null;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

interface WaveCurveConfig {
  width: number;
  padX: number;
  points: number;
  baseline: (u: number) => number;
  amp1: number;
  amp2: number;
  amp3: number;
  freq1: number;
  freq2: number;
  speed1: number;
  speed2: number;
  speed3: number;
  phaseOffset: number;
}

function sampleWavePoints(t: number, cfg: WaveCurveConfig): Array<{ x: number; y: number }> {
  const totalW = cfg.width + cfg.padX * 2;
  const pts: Array<{ x: number; y: number }> = [];

  for (let i = 0; i < cfg.points; i++) {
    const u = i / (cfg.points - 1);
    const x = -cfg.padX + u * totalW;

    // Ondulações cruzadas em velocidades irracionais entre si: parte avança enquanto outra recua
    const s1 = Math.sin(u * Math.PI * cfg.freq1 - t * cfg.speed1 + cfg.phaseOffset);
    const s2 = Math.sin(u * Math.PI * cfg.freq2 + t * cfg.speed2 + cfg.phaseOffset * 1.4);
    const s3 = Math.sin(u * Math.PI * 1.15 - t * cfg.speed3 + cfg.phaseOffset * 0.7);

    const y = cfg.baseline(u) + s1 * cfg.amp1 + s2 * cfg.amp2 + s3 * cfg.amp3;
    pts.push({ x, y });
  }

  return pts;
}

function pointsToSmoothStroke(pts: Array<{ x: number; y: number }>): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const midX = (pts[i].x + pts[i + 1].x) * 0.5;
    const midY = (pts[i].y + pts[i + 1].y) * 0.5;
    d += ` Q ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return d;
}

function buildClosedTopWave(t: number, cfg: WaveCurveConfig, topY = -4): string {
  const pts = sampleWavePoints(t, cfg);
  const stroke = pointsToSmoothStroke(pts);
  const rightX = (cfg.width + cfg.padX).toFixed(1);
  const leftX = (-cfg.padX).toFixed(1);
  return `${stroke} L ${rightX} ${topY.toFixed(1)} L ${leftX} ${topY.toFixed(1)} Z`;
}

function buildClosedBottomWave(t: number, cfg: WaveCurveConfig, bottomY: number): string {
  const pts = sampleWavePoints(t, cfg);
  const stroke = pointsToSmoothStroke(pts);
  const rightX = (cfg.width + cfg.padX).toFixed(1);
  const leftX = (-cfg.padX).toFixed(1);
  const bottom = bottomY.toFixed(1);
  return `${stroke} L ${rightX} ${bottom} L ${leftX} ${bottom} Z`;
}

// Perfis das ondas preservando exatamente a composição assimétrica verde <-> off-white
const TOP_BLEED_PX = 192; // -top-48 = 192px de transição suave superior

const TOP_DESKTOP_CFG: WaveCurveConfig = {
  width: 1440,
  padX: 70,
  points: 18,
  baseline: (u) =>
    TOP_BLEED_PX +
    52 -
    14 * Math.sin(u * Math.PI * 0.9) +
    92 * smoothstep(0.56, 0.9, u) -
    24 * smoothstep(0.88, 1.0, u),
  amp1: 14,
  amp2: 8,
  amp3: 6,
  freq1: 2.3,
  freq2: 3.6,
  speed1: 0.62,
  speed2: 0.43,
  speed3: 0.27,
  phaseOffset: 0,
};

const TOP_DESKTOP_VEIL_CFG: WaveCurveConfig = {
  ...TOP_DESKTOP_CFG,
  baseline: (u) => TOP_DESKTOP_CFG.baseline(u) + 17,
  amp1: 12,
  amp2: 7,
  amp3: 5,
  speed1: 0.49,
  speed2: 0.35,
  speed3: 0.23,
  phaseOffset: 2.1,
};

const TOP_MOBILE_CFG: WaveCurveConfig = {
  width: 600,
  padX: 36,
  points: 12,
  baseline: (u) =>
    TOP_BLEED_PX +
    32 -
    7 * Math.sin(u * Math.PI * 1.1) +
    12 * smoothstep(0.45, 0.85, u) -
    8 * smoothstep(0.85, 1.0, u),
  amp1: 7.5,
  amp2: 4.5,
  amp3: 2.5,
  freq1: 2.2,
  freq2: 3.4,
  speed1: 0.62,
  speed2: 0.43,
  speed3: 0.27,
  phaseOffset: 0.3,
};

const TOP_MOBILE_VEIL_CFG: WaveCurveConfig = {
  ...TOP_MOBILE_CFG,
  baseline: (u) => TOP_MOBILE_CFG.baseline(u) + 8,
  amp1: 6.5,
  amp2: 3.5,
  amp3: 2,
  speed1: 0.49,
  speed2: 0.35,
  speed3: 0.23,
  phaseOffset: 2.2,
};

const BOTTOM_CFG: WaveCurveConfig = {
  width: 1440,
  padX: 70,
  points: 18,
  baseline: (u) =>
    98 - 22 * Math.sin(u * Math.PI * 1.25 + 0.4) + 38 * smoothstep(0.35, 0.75, u) - 34 * smoothstep(0.75, 1.0, u),
  amp1: 15,
  amp2: 9,
  amp3: 6,
  freq1: 2.1,
  freq2: 3.5,
  speed1: 0.54,
  speed2: 0.39,
  speed3: 0.24,
  phaseOffset: 1.5,
};

const BOTTOM_VEIL_CFG: WaveCurveConfig = {
  ...BOTTOM_CFG,
  baseline: (u) => BOTTOM_CFG.baseline(u) - 16,
  amp1: 12,
  amp2: 7,
  amp3: 5,
  speed1: 0.44,
  speed2: 0.32,
  speed3: 0.2,
  phaseOffset: 3.4,
};

const BOTTOM_MOBILE_CFG: WaveCurveConfig = {
  ...BOTTOM_CFG,
  points: 12,
};

const BOTTOM_MOBILE_VEIL_CFG: WaveCurveConfig = {
  ...BOTTOM_VEIL_CFG,
  points: 12,
};

function VideoSlot({
  item,
  onOpenModal,
}: {
  item: VideoTestimonialItem;
  onOpenModal: (video: VideoTestimonialItem) => void;
}) {
  const { t } = useLanguage();
  const hasVideo = Boolean(item.videoUrl.trim());
  const [inlineNotice, setInlineNotice] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [canTilt, setCanTilt] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { ref: cardRef } = useMobileScrollActive<HTMLDivElement>({
    mode: 'once',
    delayMs: 80,
  });
  const { ref: playBtnRef } = useMobileScrollActive<HTMLButtonElement>({
    mode: 'pulse',
    delayMs: 260,
    pulseMs: 1100,
  });

  const tiltXRaw = useMotionValue(0);
  const tiltYRaw = useMotionValue(0);
  const tiltX = useSpring(tiltXRaw, { stiffness: 120, damping: 24, mass: 0.7 });
  const tiltY = useSpring(tiltYRaw, { stiffness: 120, damping: 24, mass: 0.7 });

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setCanTilt(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!canTilt || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltXRaw.set(-py * 4.5);
    tiltYRaw.set(px * 4.5);
  };

  const handleMouseLeave = () => {
    tiltXRaw.set(0);
    tiltYRaw.set(0);
  };

  const handleAction = () => {
    if (hasVideo) {
      onOpenModal(item);
    } else {
      setInlineNotice((prev) => !prev);
    }
  };

  return (
    <div className="perspective-1200">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          canTilt && !prefersReducedMotion
            ? { rotateX: tiltX, rotateY: tiltY }
            : undefined
        }
        className="video-slot-card group relative mx-auto flex aspect-[9/16] w-full max-w-[360px] flex-col justify-between overflow-hidden rounded-2xl border border-[#252525] bg-[#121212] shadow-[0_24px_54px_-24px_rgba(17,17,17,0.35)] transition-[border-color,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#383838] hover:shadow-[0_32px_68px_-22px_rgba(17,17,17,0.52)] lg:ml-auto lg:mr-0"
      >
      {/* Fundo do vídeo: poster real ou textura escura editorial sutil */}
      {hasVideo && item.posterUrl && !posterFailed ? (
        <img
          src={item.posterUrl}
          alt={`${item.authorName} — ${item.label}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setPosterFailed(true)}
          className="video-slot-poster absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 42%, rgba(158, 27, 30, 0.18) 0%, rgba(18, 18, 18, 0.96) 55%, rgba(12, 12, 12, 1) 100%)',
          }}
        />
      )}

      {/* Scrim suave para legibilidade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080808]/95 via-[#080808]/25 to-[#080808]/45"
      />

      {/* Topo: etiqueta editorial */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-5 pt-5 md:px-6 md:pt-6">
        <span className="text-[12px] font-medium tracking-[0.02em] text-[#a1a1a1]">
          {item.label}
        </span>
        {!hasVideo && (
          <span className="text-[11px] font-medium tracking-[0.02em] text-[#737373]">
            {t.socialProof.placeholderBadge}
          </span>
        )}
      </div>

      {/* Centro: Botão de reprodução (com transição vermelha #9E1B1E padronizada) */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-3.5 px-6 text-center">
        <button
          ref={playBtnRef}
          type="button"
          onClick={handleAction}
          aria-label={
            hasVideo
              ? `${t.socialProof.playAriaPrefix} ${item.label}`
              : `${t.socialProof.infoAriaPrefix} ${item.label}`
          }
          className="btn-interactive inline-flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#f2f2f2] text-[#080808] shadow-[0_18px_40px_-14px_rgba(0,0,0,0.9)] cursor-pointer active:scale-[0.97] md:group-hover:ring-4 md:group-hover:ring-[#9e1b1e]/25"
        >
          <Play className="ml-0.5 h-5 w-5 md:h-6 md:w-6 fill-current" aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[12px] md:text-[13px] font-semibold tracking-[0.08em] uppercase text-[#e5e5e5]">
            {hasVideo ? t.socialProof.watchLabel : t.socialProof.placeholderLabel}
          </span>
          {!hasVideo && (
            <span className="text-[12px] text-[#8e8e8e] max-w-[260px]">
              {inlineNotice ? t.socialProof.inlineMissingHint : item.durationHint}
            </span>
          )}
        </div>
      </div>

      {/* Base: Identificação do autor e contexto */}
      <div className="relative z-10 flex flex-col gap-1.5 border-t border-[#252525]/80 px-5 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] md:text-[16px] font-semibold tracking-[-0.015em] text-[#f2f2f2]">
            {item.authorName}
          </span>
          <span className="text-[13px] text-[#8e8e8e]">{item.authorRole}</span>
        </div>
        <span className="text-[12px] md:text-[13px] text-[#a1a1a1]">{item.context}</span>
      </div>
      </motion.div>
    </div>
  );
}

function TopDesktopWave({
  waveTime,
  topScrollBlur,
  prefersReducedMotion,
}: {
  waveTime: MotionValue<number>;
  topScrollBlur: MotionValue<string>;
  prefersReducedMotion: boolean | null;
}) {
  const mainD = useTransform(waveTime, (t) => buildClosedTopWave(t, TOP_DESKTOP_CFG, 0));
  const shadowD = useTransform(waveTime, (t) =>
    pointsToSmoothStroke(sampleWavePoints(t, TOP_DESKTOP_CFG))
  );
  const veilD = useTransform(waveTime, (t) =>
    buildClosedTopWave(t, TOP_DESKTOP_VEIL_CFG, TOP_BLEED_PX)
  );

  return (
    <motion.div
      style={prefersReducedMotion ? undefined : { filter: topScrollBlur }}
      className="absolute inset-x-0 top-0 h-[402px] overflow-visible"
    >
      <svg
        viewBox="0 0 1440 402"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="top-crimson-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080808" stopOpacity="0" />
            <stop offset="6%" stopColor="#21090a" stopOpacity="0.04" />
            <stop offset="12%" stopColor="#350d0e" stopOpacity="0.14" />
            <stop offset="19%" stopColor="#4d1013" stopOpacity="0.32" />
            <stop offset="26%" stopColor="#661316" stopOpacity="0.55" />
            <stop offset="33%" stopColor="#7e1619" stopOpacity="0.78" />
            <stop offset="39%" stopColor="#90191c" stopOpacity="0.93" />
            <stop offset="44%" stopColor="#9b1a1d" stopOpacity="0.99" />
            <stop offset="46%" stopColor="#9e1b1e" stopOpacity="1" />
            <stop offset="100%" stopColor="#9e1b1e" stopOpacity="1" />
          </linearGradient>
          <filter id="wave-seam-top" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <linearGradient id="wave-sunlight-rim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(212, 175, 118, 0.08)" />
            <stop offset="45%" stopColor="rgba(212, 175, 118, 0.34)" />
            <stop offset="80%" stopColor="rgba(186, 62, 65, 0.22)" />
            <stop offset="100%" stopColor="rgba(212, 175, 118, 0.1)" />
          </linearGradient>
        </defs>

        <motion.path d={veilD} fill="rgba(158, 27, 30, 0.16)" />
        <motion.path
          d={shadowD}
          fill="none"
          stroke="url(#wave-sunlight-rim)"
          strokeWidth="26"
          filter="url(#wave-seam-top)"
        />
        <motion.path
          d={shadowD}
          fill="none"
          stroke="rgba(38, 8, 10, 0.24)"
          strokeWidth="14"
          filter="url(#wave-seam-top)"
        />
        <motion.path d={mainD} fill="url(#top-crimson-fade)" />
      </svg>
    </motion.div>
  );
}

function TopMobileWave({ waveTime }: { waveTime: MotionValue<number> }) {
  const mainD = useTransform(waveTime, (t) => buildClosedTopWave(t, TOP_MOBILE_CFG, 0));
  const shadowD = useTransform(waveTime, (t) =>
    pointsToSmoothStroke(sampleWavePoints(t, TOP_MOBILE_CFG))
  );
  const veilD = useTransform(waveTime, (t) =>
    buildClosedTopWave(t, TOP_MOBILE_VEIL_CFG, TOP_BLEED_PX)
  );

  return (
    <div className="absolute inset-x-0 top-0 h-[268px] overflow-visible">
      <svg
        viewBox="0 0 600 268"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="top-mobile-crimson-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080808" stopOpacity="0" />
            <stop offset="9%" stopColor="#21090a" stopOpacity="0.04" />
            <stop offset="18%" stopColor="#350d0e" stopOpacity="0.14" />
            <stop offset="28%" stopColor="#4d1013" stopOpacity="0.32" />
            <stop offset="38%" stopColor="#661316" stopOpacity="0.54" />
            <stop offset="48%" stopColor="#7e1619" stopOpacity="0.76" />
            <stop offset="57%" stopColor="#90191c" stopOpacity="0.92" />
            <stop offset="64%" stopColor="#9b1a1d" stopOpacity="0.98" />
            <stop offset="70%" stopColor="#9e1b1e" stopOpacity="1" />
            <stop offset="100%" stopColor="#9e1b1e" stopOpacity="1" />
          </linearGradient>
        </defs>
        <motion.path d={veilD} fill="rgba(158, 27, 30, 0.16)" />
        {/* Traços suaves em camadas sem feGaussianBlur para 60fps no WebKit mobile */}
        <motion.path d={shadowD} fill="none" stroke="rgba(202, 162, 102, 0.08)" strokeWidth="18" />
        <motion.path d={shadowD} fill="none" stroke="rgba(202, 162, 102, 0.14)" strokeWidth="9" />
        <motion.path d={shadowD} fill="none" stroke="rgba(38, 8, 10, 0.13)" strokeWidth="7" />
        <motion.path d={mainD} fill="url(#top-mobile-crimson-fade)" />
      </svg>
    </div>
  );
}

function BottomWave({
  waveTime,
  bottomScrollY,
  bottomScrollBlur,
  isMobile,
  prefersReducedMotion,
}: {
  waveTime: MotionValue<number>;
  bottomScrollY: MotionValue<number>;
  bottomScrollBlur: MotionValue<string>;
  isMobile: boolean;
  prefersReducedMotion: boolean | null;
}) {
  const mainD = useTransform(waveTime, (t) =>
    buildClosedBottomWave(t, isMobile ? BOTTOM_MOBILE_CFG : BOTTOM_CFG, 540)
  );
  const shadowD = useTransform(waveTime, (t) =>
    pointsToSmoothStroke(sampleWavePoints(t, isMobile ? BOTTOM_MOBILE_CFG : BOTTOM_CFG))
  );
  const veilD = useTransform(waveTime, (t) =>
    buildClosedBottomWave(t, isMobile ? BOTTOM_MOBILE_VEIL_CFG : BOTTOM_VEIL_CFG, 228)
  );

  return (
    <motion.div
      style={
        prefersReducedMotion
          ? undefined
          : isMobile
            ? { y: bottomScrollY }
            : { y: bottomScrollY, filter: bottomScrollBlur }
      }
      className="absolute inset-x-0 bottom-0 h-[540px] overflow-visible md:will-change-transform"
    >
      <svg
        viewBox="0 0 1440 540"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="bottom-crimson-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9e1b1e" stopOpacity="1" />
            <stop offset="43%" stopColor="#9e1b1e" stopOpacity="1" />
            <stop offset="49%" stopColor="#90191c" stopOpacity="0.95" />
            <stop offset="56%" stopColor="#761518" stopOpacity="0.82" />
            <stop offset="63%" stopColor="#5a1114" stopOpacity="0.64" />
            <stop offset="70%" stopColor="#3f0e10" stopOpacity="0.44" />
            <stop offset="77%" stopColor="#270a0b" stopOpacity="0.25" />
            <stop offset="84%" stopColor="#160708" stopOpacity="0.1" />
            <stop offset="88%" stopColor="#0b0707" stopOpacity="0.03" />
            <stop offset="90%" stopColor="#080808" stopOpacity="0" />
            <stop offset="100%" stopColor="#080808" stopOpacity="0" />
          </linearGradient>
          {!isMobile && (
            <filter id="wave-seam-bottom" x="-10%" y="-30%" width="120%" height="160%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          )}
        </defs>

        <motion.path d={veilD} fill="rgba(158, 27, 30, 0.16)" />
        {isMobile ? (
          <>
            <motion.path d={shadowD} fill="none" stroke="rgba(202, 162, 102, 0.09)" strokeWidth="26" />
            <motion.path d={shadowD} fill="none" stroke="rgba(202, 162, 102, 0.16)" strokeWidth="12" />
            <motion.path d={shadowD} fill="none" stroke="rgba(38, 8, 10, 0.13)" strokeWidth="10" />
          </>
        ) : (
          <>
            <motion.path
              d={shadowD}
              fill="none"
              stroke="rgba(202, 162, 102, 0.26)"
              strokeWidth="24"
              filter="url(#wave-seam-bottom)"
            />
            <motion.path
              d={shadowD}
              fill="none"
              stroke="rgba(38, 8, 10, 0.22)"
              strokeWidth="14"
              filter="url(#wave-seam-bottom)"
            />
          </>
        )}
        <motion.path d={mainD} fill="url(#bottom-crimson-fade)" />
      </svg>
    </motion.div>
  );
}

export function SocialProofSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isCompactMotion = useIsCompactMotion();
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  );
  const [isInView, setIsInView] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const activeVideo =
    activeVideoId && t.socialProof.video.id === activeVideoId ? t.socialProof.video : null;

  // Relógio contínuo compartilhado: quando visível, move ondas, luz, cenário e tipografia no mesmo fluxo
  const waveTime = useMotionValue(0);
  const accumulatedTimeRef = useRef(0);
  const mobileStepAccumRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '260px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || !isInView) return;
    // Limita delta em abas reativadas para evitar saltos
    const safeDelta = Math.min(delta, 50) * 0.001;
    accumulatedTimeRef.current += safeDelta;
    if (isMobile) {
      mobileStepAccumRef.current += delta;
      // ~30fps em telas móveis preserva fluidez orgânica reduzindo pela metade os repaints SVG
      if (mobileStepAccumRef.current < 32) return;
      mobileStepAccumRef.current = 0;
    }
    waveTime.set(accumulatedTimeRef.current);
  });

  // 2. Transição orgânica guiada pela rolagem: blur no desktop e dissolução leve por opacidade/Y no mobile
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 26,
    mass: 0.9,
  });

  const topScrollBlur = useTransform(smoothScroll, (p) => {
    if (prefersReducedMotion || isMobile) return 'none';
    const t = Math.max(0, Math.min(1, (0.34 - p) / 0.24));
    const px = t * t * 5;
    return px < 0.08 ? 'none' : `blur(${px.toFixed(2)}px)`;
  });

  const bottomScrollBlur = useTransform(smoothScroll, (p) => {
    if (prefersReducedMotion || isMobile) return 'none';
    const t = Math.max(0, Math.min(1, (p - 0.56) / 0.3));
    const px = t * t * 11;
    return px < 0.08 ? 'none' : `blur(${px.toFixed(2)}px)`;
  });

  const bottomScrollY = useTransform(smoothScroll, [0.45, 0.95], [0, 16]);
  const bottomMistOpacity = useTransform(smoothScroll, [0.4, 0.72, 0.95], [0.35, 0.85, 0.15]);

  // 3. O cenário de fundo reage quando a onda avança e recua (camadas em velocidades distintas)
  const backdropSurgeX = useTransform(waveTime, (t) => Math.sin(t * 0.56) * 26 + Math.cos(t * 0.31) * 10);
  const backdropSurgeY = useTransform(waveTime, (t) => Math.cos(t * 0.44) * 14);
  const backdropSurgeScale = useTransform(waveTime, (t) => 1 + Math.sin(t * 0.48) * 0.045);

  const secondaryDepthX = useTransform(waveTime, (t) => Math.sin(t * 0.41 + 1.3) * -22);
  const secondaryDepthY = useTransform(waveTime, (t) => Math.sin(t * 0.37 + 0.7) * 16);
  const secondaryDepthScale = useTransform(waveTime, (t) => 1 + Math.cos(t * 0.39) * 0.055);

  // 4. Blur atmosférico em tom contrastante (âmbar/ocre solar suave + esmeralda translúcido) acompanhando o avanço da onda
  const contrastAuraX = useTransform(waveTime, (t) => Math.sin(t * 0.52 - 0.4) * 95);
  const contrastAuraY = useTransform(waveTime, (t) => Math.cos(t * 0.46) * 22);
  const contrastAuraOpacity = useTransform(waveTime, (t) => 0.48 + 0.34 * Math.sin(t * 0.52 + 0.6));

  const lowerAuraX = useTransform(waveTime, (t) => Math.cos(t * 0.47 + 1.1) * -85);
  const lowerAuraY = useTransform(waveTime, (t) => Math.sin(t * 0.38) * 18);
  const lowerAuraOpacity = useTransform(waveTime, (t) => 0.42 + 0.32 * Math.cos(t * 0.45));

  // 5. Tipografia e cards flutuando suavemente sobre as ondas como um barco em mar tranquilo
  const kickerFloatY = useTransform(waveTime, (t) => Math.sin(t * 0.62 + 0.2) * 2.8);
  const kickerFloatX = useTransform(waveTime, (t) => Math.cos(t * 0.43) * 1.8);
  const kickerFloatRot = useTransform(waveTime, (t) => Math.sin(t * 0.51 + 0.8) * 0.24);

  const titleFloatY = useTransform(waveTime, (t) => Math.sin(t * 0.62 - 0.35) * 3.4);
  const titleFloatX = useTransform(waveTime, (t) => Math.cos(t * 0.43 - 0.4) * 2.1);
  const titleFloatRot = useTransform(waveTime, (t) => Math.sin(t * 0.51 + 0.25) * 0.28);

  const subFloatY = useTransform(waveTime, (t) => Math.sin(t * 0.62 - 0.85) * 3.0);
  const subFloatX = useTransform(waveTime, (t) => Math.cos(t * 0.43 - 0.85) * 1.9);
  const subFloatRot = useTransform(waveTime, (t) => Math.sin(t * 0.51 - 0.3) * 0.22);

  // Card com inércia mais pesada (como embarcação sobre a água calma)
  const videoCardFloatY = useTransform(waveTime, (t) => Math.sin(t * 0.54 - 0.6) * 2.6);
  const videoCardFloatRot = useTransform(waveTime, (t) => Math.sin(t * 0.41 + 0.5) * 0.18);

  useEffect(() => {
    if (!activeVideoId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideoId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeVideoId]);

  return (
    <section
      ref={sectionRef}
      id="prova-social"
      aria-labelledby="social-proof-heading"
      className="relative w-full"
    >
      {/* Background orgânico: divisão fluida entre vermelho (#9E1B1E) e off-white (#F1EFE9) com transição contínua */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-48 -bottom-80 z-0 overflow-hidden"
      >
        {/* Miolo contínuo em off-white quente (#F1EFE9) exatamente atrás do conteúdo */}
        <div className="absolute inset-x-0 top-48 bottom-80 bg-[#f1efe9]">
          {/* Camada 1 do cenário reativo: campo luminoso quente deslocado pelo movimento da onda */}
          <motion.div
            style={
              prefersReducedMotion
                ? undefined
                : isMobile
                  ? { x: backdropSurgeX, y: backdropSurgeY }
                  : { x: backdropSurgeX, y: backdropSurgeY, scale: backdropSurgeScale }
            }
            className="absolute -inset-x-[10%] -inset-y-[8%] md:will-change-transform"
          >
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse 68% 54% at 24% 34%, rgba(255, 255, 255, 0.52) 0%, rgba(241, 239, 233, 0) 70%), radial-gradient(ellipse 60% 52% at 82% 68%, rgba(158, 27, 30, 0.065) 0%, rgba(241, 239, 233, 0) 68%)',
              }}
            />
          </motion.div>

          {/* Camada 2 do cenário reativo: gradiente carmim difuso em fase própria */}
          <motion.div
            style={
              prefersReducedMotion
                ? undefined
                : isMobile
                  ? { x: secondaryDepthX, y: secondaryDepthY }
                  : { x: secondaryDepthX, y: secondaryDepthY, scale: secondaryDepthScale }
            }
            className="absolute -inset-x-[12%] -inset-y-[10%] md:will-change-transform"
          >
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse 52% 44% at 72% 24%, rgba(158, 27, 30, 0.08) 0%, rgba(241, 239, 233, 0) 72%), radial-gradient(ellipse 58% 48% at 22% 80%, rgba(214, 188, 146, 0.14) 0%, rgba(241, 239, 233, 0) 70%)',
              }}
            />
          </motion.div>

          {/* Blur atmosférico contrastante (dourado-ocre solar suave) acompanhando o avanço superior */}
          <motion.div
            style={
              prefersReducedMotion
                ? { opacity: 0.55 }
                : { x: contrastAuraX, y: contrastAuraY, opacity: contrastAuraOpacity }
            }
            className="absolute -top-12 left-[14%] h-[300px] w-[58%] rounded-full md:blur-[68px] md:will-change-transform"
          >
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(202, 162, 102, 0.24) 0%, rgba(158, 27, 30, 0.1) 46%, rgba(241, 239, 233, 0) 78%)',
              }}
            />
          </motion.div>

          {/* Blur atmosférico contrastante inferior criando profundidade na saída da onda */}
          <motion.div
            style={
              prefersReducedMotion
                ? { opacity: 0.45 }
                : { x: lowerAuraX, y: lowerAuraY, opacity: lowerAuraOpacity }
            }
            className="absolute -bottom-10 right-[12%] h-[280px] w-[56%] rounded-full md:blur-[64px] md:will-change-transform"
          >
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(196, 155, 96, 0.2) 0%, rgba(176, 46, 50, 0.12) 48%, rgba(241, 239, 233, 0) 78%)',
              }}
            />
          </motion.div>
        </div>

        {/* Onda superior condicional por viewport: monta apenas desktop ou mobile */}
        {isMobile ? (
          <TopMobileWave waveTime={waveTime} />
        ) : (
          <TopDesktopWave
            waveTime={waveTime}
            topScrollBlur={topScrollBlur}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}

        {/* Onda inferior unificada ao degradê com dissolução prolongada */}
        <BottomWave
          waveTime={waveTime}
          bottomScrollY={bottomScrollY}
          bottomScrollBlur={bottomScrollBlur}
          isMobile={isMobile}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* Névoa difusa de transição inferior acompanhando a rolagem para dissolução contínua */}
        <motion.div
          style={prefersReducedMotion ? { opacity: 0.45 } : { opacity: bottomMistOpacity }}
          className="absolute inset-x-0 bottom-12 h-[220px] md:blur-[46px]"
        >
          <div
            className="h-full w-full"
            style={{
              background:
                'radial-gradient(ellipse 75% 58% at 50% 42%, rgba(158, 27, 30, 0.34) 0%, rgba(88, 15, 18, 0.18) 46%, rgba(8, 8, 8, 0) 78%)',
            }}
          />
        </motion.div>
      </div>

      {/* Conteúdo editorial flutuando com leveza sobre as ondas */}
      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-6 py-14 md:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-3.5 max-w-[600px] lg:col-span-7">
            <Reveal y={14} blur={4} duration={0.78}>
              <motion.div
                style={
                  prefersReducedMotion
                    ? undefined
                    : isCompactMotion
                      ? { y: kickerFloatY }
                      : { x: kickerFloatX, y: kickerFloatY, rotate: kickerFloatRot }
                }
                className="inline-block origin-left md:will-change-transform"
              >
                <span className="text-[13px] font-medium tracking-[0.02em] text-[#52524e]">
                  {t.socialProof.kicker}
                </span>
              </motion.div>
            </Reveal>

            <Reveal delay={0.05} y={14} blur={4} duration={0.78}>
              <motion.div
                style={
                  prefersReducedMotion
                    ? undefined
                    : isCompactMotion
                      ? { y: titleFloatY }
                      : { x: titleFloatX, y: titleFloatY, rotate: titleFloatRot }
                }
                className="origin-left md:will-change-transform"
              >
                <h2 id="social-proof-heading" className="type-section-h2 text-[#111111]">
                  {t.socialProof.title}
                </h2>
              </motion.div>
            </Reveal>

            <Reveal delay={0.1} y={14} blur={4} duration={0.78}>
              <motion.div
                style={
                  prefersReducedMotion
                    ? undefined
                    : isCompactMotion
                      ? { y: subFloatY }
                      : { x: subFloatX, y: subFloatY, rotate: subFloatRot }
                }
                className="origin-left md:will-change-transform"
              >
                <p className="text-[17px] md:text-[19px] leading-[1.5] tracking-[-0.015em] text-[#3f3f3c]">
                  {t.socialProof.subtitle}
                </p>
              </motion.div>
            </Reveal>
          </div>

          {/* Vídeo 9:16 acompanhando a superfície fluida com balanço suave e discreto */}
          <Reveal y={14} blur={4} duration={0.78} className="lg:col-span-5">
            <motion.div
              style={
                prefersReducedMotion
                  ? undefined
                  : isCompactMotion
                    ? { y: videoCardFloatY }
                    : { y: videoCardFloatY, rotate: videoCardFloatRot }
              }
              className="md:will-change-transform"
            >
              <VideoSlot
                item={t.socialProof.video}
                onOpenModal={(video) => setActiveVideoId(video.id)}
              />
            </motion.div>
          </Reveal>
        </div>
      </div>

      {/* Modal de reprodução isolado em portal no body para evitar conflito com filter/transform ancestrais */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {activeVideo && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={activeVideo.label}
                onClick={() => setActiveVideoId(null)}
                className="fixed inset-0 z-[90] overflow-y-auto"
              >
                {/* Backdrop isolado como camada irmã para não aplicar backdrop-filter sobre o iframe */}
                <motion.div
                  aria-hidden="true"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                  className="fixed inset-0 bg-[#080808]/95 md:bg-[#080808]/92 md:backdrop-blur-md"
                />

                <div className="relative z-10 flex min-h-full items-center justify-center p-4 md:p-8">
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-[440px] rounded-2xl border border-[#252525] bg-[#121212] p-4 md:p-6 shadow-[0_32px_90px_-24px_rgba(0,0,0,0.95)]"
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-medium text-[#8e8e8e]">
                          {activeVideo.label}
                        </span>
                        <span className="text-[15px] font-semibold text-[#f2f2f2]">
                          {activeVideo.authorName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveVideoId(null)}
                        aria-label={t.socialProof.closeModalAria}
                        className="btn-interactive inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#181818] text-[#f2f2f2] cursor-pointer"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    {(() => {
                      const embedSrc = getEmbedUrl(activeVideo.videoUrl);
                      return (
                        <div className="mx-auto aspect-[9/16] w-full max-w-[min(360px,calc(74vh*9/16))] overflow-hidden rounded-xl border border-[#252525] bg-[#080808]">
                          {embedSrc ? (
                            <iframe
                              src={embedSrc}
                              title={activeVideo.label}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                              className="block h-full w-full border-0"
                            />
                          ) : (
                            <video
                              src={activeVideo.videoUrl}
                              poster={activeVideo.posterUrl || undefined}
                              controls
                              autoPlay
                              playsInline
                              className="block h-full w-full object-contain"
                            />
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
