import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import { Play, MessageSquareQuote, Image as ImageIcon, X, Maximize2 } from 'lucide-react';
import {
  SOCIAL_PROOF_HEADER,
  SOCIAL_PROOF_PRINT,
  SOCIAL_PROOF_VIDEO,
  type ConversationPrintItem,
  type VideoTestimonialItem,
} from '../data/socialProofData';
import { Reveal, EDITORIAL_EASE } from './Reveal';

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
  points: 14,
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

function VideoSlot({
  item,
  onOpenModal,
}: {
  item: VideoTestimonialItem;
  onOpenModal: (video: VideoTestimonialItem) => void;
}) {
  const hasVideo = Boolean(item.videoUrl.trim());
  const [inlineNotice, setInlineNotice] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  const handleAction = () => {
    if (hasVideo) {
      onOpenModal(item);
    } else {
      setInlineNotice((prev) => !prev);
    }
  };

  return (
    <div className="group relative mx-auto flex aspect-[9/16] w-full max-w-[380px] flex-col justify-between overflow-hidden rounded-2xl border border-[#252525] bg-[#121212] shadow-[0_24px_54px_-24px_rgba(17,17,17,0.35)] transition-[border-color,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#383838] hover:shadow-[0_28px_60px_-22px_rgba(17,17,17,0.45)] lg:max-w-none">
      {/* Fundo do vídeo: poster real ou textura escura editorial sutil */}
      {hasVideo && item.posterUrl && !posterFailed ? (
        <img
          src={item.posterUrl}
          alt={`${item.authorName} — ${item.label}`}
          referrerPolicy="no-referrer"
          onError={() => setPosterFailed(true)}
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 42%, rgba(31, 107, 74, 0.16) 0%, rgba(18, 18, 18, 0.96) 55%, rgba(12, 12, 12, 1) 100%)',
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
            Espaço reservado
          </span>
        )}
      </div>

      {/* Centro: Botão de reprodução (com transição verde #1F6B4A padronizada) */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-3.5 px-6 text-center">
        <button
          type="button"
          onClick={handleAction}
          aria-label={
            hasVideo ? `Reproduzir ${item.label}` : `Visualizar informações do ${item.label}`
          }
          className="btn-interactive inline-flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#f2f2f2] text-[#080808] shadow-[0_18px_40px_-14px_rgba(0,0,0,0.9)] cursor-pointer active:scale-[0.97]"
        >
          <Play className="ml-0.5 h-5 w-5 md:h-6 md:w-6 fill-current" aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[12px] md:text-[13px] font-semibold tracking-[0.08em] uppercase text-[#e5e5e5]">
            {hasVideo ? 'Assistir depoimento' : 'Depoimento em vídeo'}
          </span>
          {!hasVideo && (
            <span className="text-[12px] text-[#8e8e8e] max-w-[260px]">
              {inlineNotice
                ? 'Adicione o arquivo ou link do vídeo em src/data/socialProofData.ts.'
                : item.durationHint}
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
    </div>
  );
}

function PrintSlot({
  item,
  onInspect,
  className = '',
}: {
  item: ConversationPrintItem;
  onInspect: (item: ConversationPrintItem) => void;
  className?: string;
}) {
  const hasImage = Boolean(item.imageUrl.trim());
  const [expandedNote, setExpandedNote] = useState(false);

  return (
    <div
      className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#252525] bg-[#121212] p-5 md:p-7 shadow-[0_24px_54px_-24px_rgba(17,17,17,0.35)] transition-[border-color,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#3a3a3a] hover:shadow-[0_28px_60px_-22px_rgba(17,17,17,0.45)] ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-[12px] font-medium text-[#8e8e8e]">
          <MessageSquareQuote className="h-3.5 w-3.5 text-[#a1a1a1]" aria-hidden="true" />
          <span>{item.label}</span>
        </div>

        <button
          type="button"
          onClick={() => (hasImage ? onInspect(item) : setExpandedNote((prev) => !prev))}
          aria-label={hasImage ? `Ampliar ${item.label}` : `Detalhes de ${item.label}`}
          className="btn-interactive inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#181818] text-[#d4d4d4] cursor-pointer"
        >
          {hasImage ? (
            <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Área do Print Real ou Composição Visual Placeholder */}
      <div className="my-6 flex-1 flex flex-col justify-center">
        {hasImage ? (
          <button
            type="button"
            onClick={() => onInspect(item)}
            className="relative w-full overflow-hidden rounded-xl border border-[#252525] bg-[#0b0b0b] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2f2f2]"
          >
            <img
              src={item.imageUrl}
              alt={`${item.label} — ${item.authorLabel}`}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
            />
          </button>
        ) : (
          <div className="flex flex-col gap-3.5 rounded-xl border border-dashed border-[#2b2b2b] bg-[#0c0c0c]/90 p-5 md:p-6">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#737373]">
              <span>{item.channel}</span>
              <span>Espaço para print</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {item.placeholderLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border border-[#222222] px-4 py-3 text-[14px] leading-[1.5] ${
                    idx === 0
                      ? 'max-w-[90%] bg-[#161616] text-[#c7c7c7]'
                      : 'ml-auto max-w-[88%] bg-[#111111] text-[#8e8e8e]'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>

            {expandedNote && (
              <p className="text-[12px] leading-[1.45] text-[#8e8e8e] pt-1">
                Insira o caminho da captura em <span className="text-[#d4d4d4]">src/data/socialProofData.ts</span> para exibir o print real com ampliação.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#222222] pt-4 text-[13px]">
        <span className="font-medium text-[#d4d4d4]">{item.authorLabel}</span>
        <span className="text-[#8e8e8e]">{item.context}</span>
      </div>
    </div>
  );
}

export function SocialProofSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isInView, setIsInView] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoTestimonialItem | null>(null);
  const [activePrint, setActivePrint] = useState<ConversationPrintItem | null>(null);

  // Relógio contínuo compartilhado: quando visível, move ondas, luz, cenário e tipografia no mesmo fluxo
  const waveTime = useMotionValue(0);
  const accumulatedTimeRef = useRef(0);

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
    waveTime.set(accumulatedTimeRef.current);
  });

  // 1. Caminhos SVG dinâmicos propagando horizontalmente como ondas macias de mar calmo
  const topDesktopMainD = useTransform(waveTime, (t) => buildClosedTopWave(t, TOP_DESKTOP_CFG, 0));
  const topDesktopShadowD = useTransform(waveTime, (t) =>
    pointsToSmoothStroke(sampleWavePoints(t, TOP_DESKTOP_CFG))
  );
  const topDesktopVeilD = useTransform(waveTime, (t) =>
    buildClosedTopWave(t, TOP_DESKTOP_VEIL_CFG, TOP_BLEED_PX)
  );

  const topMobileMainD = useTransform(waveTime, (t) => buildClosedTopWave(t, TOP_MOBILE_CFG, 0));
  const topMobileShadowD = useTransform(waveTime, (t) =>
    pointsToSmoothStroke(sampleWavePoints(t, TOP_MOBILE_CFG))
  );
  const topMobileVeilD = useTransform(waveTime, (t) =>
    buildClosedTopWave(t, TOP_MOBILE_VEIL_CFG, TOP_BLEED_PX)
  );

  const bottomMainD = useTransform(waveTime, (t) => buildClosedBottomWave(t, BOTTOM_CFG, 420));
  const bottomShadowD = useTransform(waveTime, (t) =>
    pointsToSmoothStroke(sampleWavePoints(t, BOTTOM_CFG))
  );
  const bottomVeilD = useTransform(waveTime, (t) =>
    buildClosedBottomWave(t, BOTTOM_VEIL_CFG, 202)
  );

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

  // Cards com inércia mais pesada (como embarcações maiores sobre a água calma)
  const videoCardFloatY = useTransform(waveTime, (t) => Math.sin(t * 0.54 - 0.6) * 2.6);
  const videoCardFloatRot = useTransform(waveTime, (t) => Math.sin(t * 0.41 + 0.5) * 0.18);

  const printCardFloatY = useTransform(waveTime, (t) => Math.sin(t * 0.54 - 1.3) * 2.4);
  const printCardFloatRot = useTransform(waveTime, (t) => Math.cos(t * 0.39 + 0.9) * 0.16);

  useEffect(() => {
    if (!activeVideo && !activePrint) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideo(null);
        setActivePrint(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeVideo, activePrint]);

  return (
    <section
      ref={sectionRef}
      id="prova-social"
      aria-labelledby="social-proof-heading"
      className="relative w-full"
    >
      {/* Background orgânico: divisão fluida entre verde (#1F6B4A) e off-white (#F1EFE9) com transição contínua */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-48 -bottom-56 z-0 overflow-hidden"
      >
        {/* Miolo contínuo em off-white quente (#F1EFE9) exatamente atrás do conteúdo */}
        <div className="absolute inset-x-0 top-48 bottom-56 bg-[#f1efe9]">
          {/* Camada 1 do cenário reativo: campo luminoso quente deslocado pelo movimento da onda */}
          <motion.div
            style={
              prefersReducedMotion
                ? undefined
                : { x: backdropSurgeX, y: backdropSurgeY, scale: backdropSurgeScale }
            }
            className="absolute -inset-x-[10%] -inset-y-[8%] will-change-transform"
          >
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse 68% 54% at 24% 34%, rgba(255, 255, 255, 0.52) 0%, rgba(241, 239, 233, 0) 70%), radial-gradient(ellipse 60% 52% at 82% 68%, rgba(31, 107, 74, 0.065) 0%, rgba(241, 239, 233, 0) 68%)',
              }}
            />
          </motion.div>

          {/* Camada 2 do cenário reativo: gradiente verde-esmeralda difuso em fase própria */}
          <motion.div
            style={
              prefersReducedMotion
                ? undefined
                : { x: secondaryDepthX, y: secondaryDepthY, scale: secondaryDepthScale }
            }
            className="absolute -inset-x-[12%] -inset-y-[10%] will-change-transform"
          >
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse 52% 44% at 72% 24%, rgba(31, 107, 74, 0.08) 0%, rgba(241, 239, 233, 0) 72%), radial-gradient(ellipse 58% 48% at 22% 80%, rgba(214, 188, 146, 0.14) 0%, rgba(241, 239, 233, 0) 70%)',
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
            className="absolute -top-12 left-[14%] h-[300px] w-[58%] rounded-full blur-[68px] will-change-transform"
          >
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(202, 162, 102, 0.24) 0%, rgba(31, 107, 74, 0.1) 46%, rgba(241, 239, 233, 0) 78%)',
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
            className="absolute -bottom-10 right-[12%] h-[280px] w-[56%] rounded-full blur-[64px] will-change-transform"
          >
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(196, 155, 96, 0.2) 0%, rgba(44, 128, 92, 0.12) 48%, rgba(241, 239, 233, 0) 78%)',
              }}
            />
          </motion.div>
        </div>

        {/* Onda superior desktop unificada ao degradê: transparente -> verde (#1F6B4A) -> curva orgânica sem emendas */}
        <div className="hidden md:block absolute inset-x-0 top-0 h-[402px] overflow-visible">
          <svg
            viewBox="0 0 1440 402"
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="top-emerald-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1f6b4a" stopOpacity="0" />
                <stop offset="5%" stopColor="#1f6b4a" stopOpacity="0.03" />
                <stop offset="10%" stopColor="#1f6b4a" stopOpacity="0.11" />
                <stop offset="15%" stopColor="#1f6b4a" stopOpacity="0.24" />
                <stop offset="20%" stopColor="#1f6b4a" stopOpacity="0.4" />
                <stop offset="25%" stopColor="#1f6b4a" stopOpacity="0.57" />
                <stop offset="30%" stopColor="#1f6b4a" stopOpacity="0.73" />
                <stop offset="35%" stopColor="#1f6b4a" stopOpacity="0.87" />
                <stop offset="40%" stopColor="#1f6b4a" stopOpacity="0.96" />
                <stop offset="43%" stopColor="#1f6b4a" stopOpacity="0.99" />
                <stop offset="46%" stopColor="#1f6b4a" stopOpacity="1" />
                <stop offset="100%" stopColor="#1f6b4a" stopOpacity="1" />
              </linearGradient>
              <filter id="wave-seam-top" x="-10%" y="-30%" width="120%" height="160%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
              <linearGradient id="wave-sunlight-rim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(212, 175, 118, 0.08)" />
                <stop offset="45%" stopColor="rgba(212, 175, 118, 0.34)" />
                <stop offset="80%" stopColor="rgba(72, 160, 120, 0.22)" />
                <stop offset="100%" stopColor="rgba(212, 175, 118, 0.1)" />
              </linearGradient>
            </defs>

            {/* Camada secundária translúcida assíncrona sobre o off-white */}
            <motion.path d={topDesktopVeilD} fill="rgba(31, 107, 74, 0.16)" />

            {/* Rastro luminoso suave de contraste acompanhando a crista da onda */}
            <motion.path
              d={topDesktopShadowD}
              fill="none"
              stroke="url(#wave-sunlight-rim)"
              strokeWidth="26"
              filter="url(#wave-seam-top)"
            />

            {/* Sombra orgânica na borda entre o verde e o off-white */}
            <motion.path
              d={topDesktopShadowD}
              fill="none"
              stroke="rgba(10, 32, 22, 0.22)"
              strokeWidth="14"
              filter="url(#wave-seam-top)"
            />

            {/* Massa única verde (#1F6B4A) com degradê contínuo desde o fundo escuro */}
            <motion.path d={topDesktopMainD} fill="url(#top-emerald-fade)" />
          </svg>
        </div>

        {/* Onda superior mobile unificada ao degradê */}
        <div className="md:hidden absolute inset-x-0 top-0 h-[268px] overflow-visible">
          <svg
            viewBox="0 0 600 268"
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="top-mobile-emerald-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1f6b4a" stopOpacity="0" />
                <stop offset="8%" stopColor="#1f6b4a" stopOpacity="0.03" />
                <stop offset="16%" stopColor="#1f6b4a" stopOpacity="0.12" />
                <stop offset="24%" stopColor="#1f6b4a" stopOpacity="0.26" />
                <stop offset="32%" stopColor="#1f6b4a" stopOpacity="0.43" />
                <stop offset="40%" stopColor="#1f6b4a" stopOpacity="0.61" />
                <stop offset="48%" stopColor="#1f6b4a" stopOpacity="0.77" />
                <stop offset="56%" stopColor="#1f6b4a" stopOpacity="0.91" />
                <stop offset="63%" stopColor="#1f6b4a" stopOpacity="0.98" />
                <stop offset="70%" stopColor="#1f6b4a" stopOpacity="1" />
                <stop offset="100%" stopColor="#1f6b4a" stopOpacity="1" />
              </linearGradient>
              <filter id="wave-seam-mobile" x="-10%" y="-30%" width="120%" height="160%">
                <feGaussianBlur stdDeviation="5" />
              </filter>
            </defs>
            <motion.path d={topMobileVeilD} fill="rgba(31, 107, 74, 0.16)" />
            <motion.path
              d={topMobileShadowD}
              fill="none"
              stroke="rgba(202, 162, 102, 0.22)"
              strokeWidth="12"
              filter="url(#wave-seam-mobile)"
            />
            <motion.path
              d={topMobileShadowD}
              fill="none"
              stroke="rgba(10, 32, 22, 0.2)"
              strokeWidth="8"
              filter="url(#wave-seam-mobile)"
            />
            <motion.path d={topMobileMainD} fill="url(#top-mobile-emerald-fade)" />
          </svg>
        </div>

        {/* Onda inferior unificada ao degradê: curva orgânica -> verde (#1F6B4A) -> dissolução perfeita no escuro */}
        <div className="absolute inset-x-0 bottom-0 h-[420px] overflow-visible">
          <svg
            viewBox="0 0 1440 420"
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="bottom-emerald-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1f6b4a" stopOpacity="1" />
                <stop offset="47.5%" stopColor="#1f6b4a" stopOpacity="1" />
                <stop offset="52%" stopColor="#1f6b4a" stopOpacity="0.98" />
                <stop offset="57%" stopColor="#1f6b4a" stopOpacity="0.92" />
                <stop offset="63%" stopColor="#1f6b4a" stopOpacity="0.8" />
                <stop offset="69%" stopColor="#1f6b4a" stopOpacity="0.64" />
                <stop offset="74%" stopColor="#1f6b4a" stopOpacity="0.49" />
                <stop offset="80%" stopColor="#1f6b4a" stopOpacity="0.32" />
                <stop offset="86%" stopColor="#1f6b4a" stopOpacity="0.17" />
                <stop offset="91%" stopColor="#1f6b4a" stopOpacity="0.07" />
                <stop offset="96%" stopColor="#1f6b4a" stopOpacity="0.015" />
                <stop offset="100%" stopColor="#1f6b4a" stopOpacity="0" />
              </linearGradient>
              <filter id="wave-seam-bottom" x="-10%" y="-30%" width="120%" height="160%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
            </defs>

            <motion.path d={bottomVeilD} fill="rgba(31, 107, 74, 0.16)" />
            <motion.path
              d={bottomShadowD}
              fill="none"
              stroke="rgba(202, 162, 102, 0.26)"
              strokeWidth="24"
              filter="url(#wave-seam-bottom)"
            />
            <motion.path
              d={bottomShadowD}
              fill="none"
              stroke="rgba(10, 32, 22, 0.2)"
              strokeWidth="14"
              filter="url(#wave-seam-bottom)"
            />
            <motion.path d={bottomMainD} fill="url(#bottom-emerald-fade)" />
          </svg>
        </div>
      </div>

      {/* Conteúdo editorial flutuando com leveza sobre as ondas */}
      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-6 py-14 md:py-24">
        <div className="mb-10 md:mb-14 flex flex-col gap-3.5 max-w-[700px]">
          <Reveal y={14} blur={4} duration={0.78}>
            <motion.div
              style={
                prefersReducedMotion
                  ? undefined
                  : { x: kickerFloatX, y: kickerFloatY, rotate: kickerFloatRot }
              }
              className="inline-block origin-left will-change-transform"
            >
              <span className="text-[13px] font-medium tracking-[0.02em] text-[#52524e]">
                {SOCIAL_PROOF_HEADER.kicker}
              </span>
            </motion.div>
          </Reveal>

          <Reveal delay={0.05} y={14} blur={4} duration={0.78}>
            <motion.div
              style={
                prefersReducedMotion
                  ? undefined
                  : { x: titleFloatX, y: titleFloatY, rotate: titleFloatRot }
              }
              className="origin-left will-change-transform"
            >
              <h2 id="social-proof-heading" className="type-section-h2 text-[#111111]">
                {SOCIAL_PROOF_HEADER.title}
              </h2>
            </motion.div>
          </Reveal>

          <Reveal delay={0.1} y={14} blur={4} duration={0.78}>
            <motion.div
              style={
                prefersReducedMotion
                  ? undefined
                  : { x: subFloatX, y: subFloatY, rotate: subFloatRot }
              }
              className="origin-left will-change-transform"
            >
              <p className="text-[17px] md:text-[19px] leading-[1.5] tracking-[-0.015em] text-[#3f3f3c]">
                {SOCIAL_PROOF_HEADER.subtitle}
              </p>
            </motion.div>
          </Reveal>
        </div>

        {/* Vídeo 9:16 e print acompanhando a superfície fluida com balanço suave e discreto */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-7">
          <Reveal y={14} blur={4} duration={0.78} className="lg:col-span-4">
            <motion.div
              style={
                prefersReducedMotion
                  ? undefined
                  : { y: videoCardFloatY, rotate: videoCardFloatRot }
              }
              className="h-full will-change-transform"
            >
              <VideoSlot item={SOCIAL_PROOF_VIDEO} onOpenModal={setActiveVideo} />
            </motion.div>
          </Reveal>

          <Reveal delay={0.06} y={14} blur={4} duration={0.78} className="lg:col-span-8 flex">
            <motion.div
              style={
                prefersReducedMotion
                  ? undefined
                  : { y: printCardFloatY, rotate: printCardFloatRot }
              }
              className="flex w-full will-change-transform"
            >
              <PrintSlot
                item={SOCIAL_PROOF_PRINT}
                onInspect={setActivePrint}
                className="w-full"
              />
            </motion.div>
          </Reveal>
        </div>
      </div>

      {/* Modal de reprodução/ampliação isolado em portal no body para evitar conflito com filter/transform ancestrais */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {(activeVideo || activePrint) && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={activeVideo ? activeVideo.label : activePrint?.label}
                onClick={() => {
                  setActiveVideo(null);
                  setActivePrint(null);
                }}
                className="fixed inset-0 z-[90] overflow-y-auto"
              >
                {/* Backdrop isolado como camada irmã para não aplicar backdrop-filter sobre o iframe */}
                <motion.div
                  aria-hidden="true"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                  className="fixed inset-0 bg-[#080808]/92 backdrop-blur-md"
                />

                <div className="relative z-10 flex min-h-full items-center justify-center p-4 md:p-8">
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? false
                        : activeVideo
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.97, y: 10 }
                    }
                    animate={activeVideo ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                    exit={
                      prefersReducedMotion
                        ? undefined
                        : activeVideo
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.97, y: 8 }
                    }
                    transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                    onClick={(e) => e.stopPropagation()}
                    className={`relative w-full rounded-2xl border border-[#252525] bg-[#121212] p-4 md:p-6 shadow-[0_32px_90px_-24px_rgba(0,0,0,0.95)] ${
                      activeVideo ? 'max-w-[440px]' : 'max-w-[920px] overflow-hidden'
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-medium text-[#8e8e8e]">
                          {activeVideo ? activeVideo.label : activePrint?.label}
                        </span>
                        <span className="text-[15px] font-semibold text-[#f2f2f2]">
                          {activeVideo ? activeVideo.authorName : activePrint?.authorLabel}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveVideo(null);
                          setActivePrint(null);
                        }}
                        aria-label="Fechar visualização"
                        className="btn-interactive inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#181818] text-[#f2f2f2] cursor-pointer"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    {activeVideo && (() => {
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

                    {activePrint && (
                      <div className="flex max-h-[75vh] w-full items-center justify-center overflow-hidden rounded-xl border border-[#252525] bg-[#080808]">
                        <img
                          src={activePrint.imageUrl}
                          alt={`${activePrint.label} — ${activePrint.authorLabel}`}
                          referrerPolicy="no-referrer"
                          className="max-h-[75vh] w-auto object-contain"
                        />
                      </div>
                    )}
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
