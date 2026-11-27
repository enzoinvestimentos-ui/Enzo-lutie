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
  setLang: (lang: Language) => void;
  toggleLang: () => void;
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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(readInitialLanguage);
  const langRef = useRef<Language>(lang);
  langRef.current = lang;

  const setLang = useCallback((next: Language) => {
    if (next === langRef.current) return;
    langRef.current = next;

    if (
      typeof document !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const root = document.documentElement;
      root.dataset.langFocus = root.dataset.langFocus === 'a' ? 'b' : 'a';
    }

    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage write errors
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(langRef.current === 'pt' ? 'en' : 'pt');
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
      setLang,
      toggleLang,
      t,
    }),
    [lang, setLang, toggleLang, t]
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
