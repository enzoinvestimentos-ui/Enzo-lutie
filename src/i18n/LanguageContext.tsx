import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { TRANSLATIONS, type Language, type SiteTranslations } from './translations';

const STORAGE_KEY = 'site-language';

interface LanguageContextValue {
  lang: Language;
  pendingLang: Language | null;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  registerFocusTarget: (el: HTMLDivElement | null) => void;
  t: SiteTranslations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'pt';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'pt') {
      return saved;
    }
  } catch {
    // Ignore storage access errors in restricted contexts
  }
  return 'pt';
}

function updateMetaContent(selector: string, content: string) {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) {
    el.setAttribute('content', content);
  }
}

function extractBlurPx(filterStr: string): number {
  const match = /blur\(([0-9.]+)px\)/.exec(filterStr);
  if (!match) return 0;
  const val = Number.parseFloat(match[1]);
  return Number.isFinite(val) ? val : 0;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(readInitialLanguage);
  const [pendingLang, setPendingLang] = useState<Language | null>(null);

  const committedLangRef = useRef<Language>(lang);
  committedLangRef.current = lang;
  const targetLangRef = useRef<Language>(lang);

  const focusTargetRef = useRef<HTMLDivElement | null>(null);
  const activeAnimRef = useRef<Animation | null>(null);
  const heldAnimRef = useRef<Animation | null>(null);
  const rafRef = useRef<number | null>(null);
  const seqRef = useRef(0);

  const registerFocusTarget = useCallback((el: HTMLDivElement | null) => {
    focusTargetRef.current = el;
  }, []);

  const cancelRunningTransition = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (activeAnimRef.current) {
      activeAnimRef.current.onfinish = null;
      activeAnimRef.current.cancel();
      activeAnimRef.current = null;
    }
    if (heldAnimRef.current) {
      heldAnimRef.current.onfinish = null;
      heldAnimRef.current.cancel();
      heldAnimRef.current = null;
    }
  }, []);

  useEffect(() => cancelRunningTransition, [cancelRunningTransition]);

  const setLang = useCallback(
    (next: Language) => {
      if (next === targetLangRef.current) return;
      targetLangRef.current = next;

      const el = focusTargetRef.current;
      const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!el || typeof el.animate !== 'function' || reducedMotion) {
        cancelRunningTransition();
        committedLangRef.current = next;
        setPendingLang(null);
        setLangState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // Ignore storage write errors
        }
        return;
      }

      // Captura estado visual atual antes de cancelar para evitar saltos em cliques rápidos
      const computed = window.getComputedStyle(el);
      const currentBlurPx = extractBlurPx(computed.filter);
      const parsedOpacity = Number.parseFloat(computed.opacity);
      const currentOpacity = Number.isFinite(parsedOpacity) ? parsedOpacity : 1;

      cancelRunningTransition();
      const seqId = ++seqRef.current;

      const isCompact = window.matchMedia(
        '(hover: none), (pointer: coarse), (max-width: 767px)'
      ).matches;
      const peakBlurPx = isCompact ? 2.0 : 2.6;
      const peakOpacity = isCompact ? 0.91 : 0.9;
      const outBaseMs = isCompact ? 370 : 400;
      const inDurationMs = isCompact ? 510 : 540;

      setPendingLang(next);

      const runSharpen = (
        fromBlurPx: number,
        fromOpacity: number,
        heldPeakAnim: Animation | null
      ) => {
        if (seqId !== seqRef.current) return;
        const ratio = Math.max(0.25, Math.min(1, fromBlurPx / peakBlurPx));
        const duration = Math.round(inDurationMs * ratio);

        const sharpenAnim = el.animate(
          [
            { filter: `blur(${fromBlurPx.toFixed(2)}px)`, opacity: fromOpacity },
            { filter: 'blur(0px)', opacity: 1 },
          ],
          {
            duration,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'none',
          }
        );

        activeAnimRef.current = sharpenAnim;
        if (heldPeakAnim) {
          heldAnimRef.current = heldPeakAnim;
        }

        sharpenAnim.onfinish = () => {
          if (seqId !== seqRef.current) return;
          sharpenAnim.onfinish = null;
          activeAnimRef.current = null;
          if (heldAnimRef.current) {
            heldAnimRef.current.cancel();
            heldAnimRef.current = null;
          }
        };
      };

      // Caso o usuário reverta para o idioma ainda exibido antes da etapa 2, retorna à nitidez sem troca
      if (next === committedLangRef.current && currentBlurPx > 0.05) {
        setPendingLang(null);
        runSharpen(currentBlurPx, currentOpacity, null);
        return;
      }

      // Etapa 1: Saída progressiva para desfoque suave
      const remainingRatio = Math.max(
        0.35,
        1 - Math.min(1, currentBlurPx / peakBlurPx) * 0.65
      );
      const outDuration = Math.round(outBaseMs * remainingRatio);

      const outAnim = el.animate(
        [
          { filter: `blur(${currentBlurPx.toFixed(2)}px)`, opacity: currentOpacity },
          { filter: `blur(${peakBlurPx.toFixed(2)}px)`, opacity: peakOpacity },
        ],
        {
          duration: outDuration,
          easing: 'cubic-bezier(0.35, 0, 0.65, 1)',
          fill: 'forwards',
        }
      );

      activeAnimRef.current = outAnim;

      // Etapa 2: Troca do idioma exatamente próximo ao pico de desfoque
      outAnim.onfinish = () => {
        if (seqId !== seqRef.current) return;
        outAnim.onfinish = null;
        heldAnimRef.current = outAnim;
        activeAnimRef.current = null;

        const target = targetLangRef.current;
        committedLangRef.current = target;
        setLangState(target);
        setPendingLang(null);

        try {
          window.localStorage.setItem(STORAGE_KEY, target);
        } catch {
          // Ignore storage write errors
        }

        // Etapa 3: Aguarda commit/pintura no pico do desfoque e recupera nitidez lentamente
        rafRef.current = window.requestAnimationFrame(() => {
          rafRef.current = window.requestAnimationFrame(() => {
            rafRef.current = null;
            runSharpen(peakBlurPx, peakOpacity, outAnim);
          });
        });
      };
    },
    [cancelRunningTransition]
  );

  const toggleLang = useCallback(() => {
    setLang(targetLangRef.current === 'pt' ? 'en' : 'pt');
  }, [setLang]);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.lang = t.seo.htmlLang;
    document.title = t.seo.title;
    updateMetaContent('meta[name="description"]', t.seo.description);
    updateMetaContent('meta[property="og:title"]', t.seo.ogTitle);
    updateMetaContent('meta[property="og:description"]', t.seo.ogDescription);
  }, [t]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      pendingLang,
      setLang,
      toggleLang,
      registerFocusTarget,
      t,
    }),
    [lang, pendingLang, setLang, toggleLang, registerFocusTarget, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
