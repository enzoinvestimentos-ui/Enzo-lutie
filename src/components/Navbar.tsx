import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RollingText } from './RollingText';
import { EDITORIAL_EASE } from './Reveal';
import { WHATSAPP_CONTACT_URL } from '../data/portfolioData';

export type RoutePath =
  | { page: 'home' }
  | { page: 'work' }
  | { page: 'work-detail'; slug: string }
  | { page: 'blog' }
  | { page: 'blog-detail'; slug: string };

interface NavbarProps {
  route: RoutePath;
  onNavigate: (path: string, hash?: string) => void;
}

export function Navbar({ route, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [route]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onPointerDown);
    };
  }, [menuOpen]);

  const handleNav = (path: string, hash?: string) => {
    setMenuOpen(false);
    onNavigate(path, hash);
  };

  const navItems = [
    { label: 'Início', path: '/', hash: '#hero-section' },
    { label: 'Diagnóstico', path: '/', hash: '#bio-section' },
    { label: 'Atuação', path: '/', hash: '#services' },
    { label: 'Projetos', path: '/work', hash: '#work-hero' },
    { label: 'Sobre', path: '/blog', hash: '#blog-hero' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex flex-col items-center px-4 pt-3 pb-2 pointer-events-none">
      <div
        ref={containerRef}
        className={`pointer-events-auto w-full max-w-[1180px] rounded-2xl border backdrop-blur-md px-5 py-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? 'border-[#2c2c2c] bg-[#0b0b0b]/92 shadow-[0_14px_38px_-18px_rgba(0,0,0,0.85)]'
            : 'border-[#252525] bg-[#0b0b0b]/78'
        }`}
      >
        <div className="flex items-center justify-between gap-8">
          {/* Zona 1: Marca em linha única */}
          <a
            href="#hero-section"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/', '#hero-section');
            }}
            className="group text-[18px] font-bold tracking-[-0.03em] text-[#f5f5f5] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5f5f5]"
          >
            <RollingText text="Enzo Lutiê" />
          </a>

          {/* Zona 2: Links de navegação em linha única */}
          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-7 text-[15px] font-medium tracking-[-0.02em] text-[#a1a1a1]"
          >
            {navItems.map((item) => {
              const isActive =
                (item.path === '/work' && (route.page === 'work' || route.page === 'work-detail')) ||
                (item.path === '/blog' && (route.page === 'blog' || route.page === 'blog-detail'));

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNav(item.path, item.hash)}
                  className={`group relative cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:text-[#f5f5f5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5f5f5] ${
                    isActive ? 'text-[#f5f5f5]' : ''
                  }`}
                >
                  <RollingText text={item.label} />
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#f5f5f5]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zona 3: Ação principal + Menu hambúrguer */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={WHATSAPP_CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive group hidden md:inline-flex items-center justify-center rounded-full bg-[#f5f5f5] px-4 py-2 text-[14px] font-medium tracking-[-0.02em] text-[#080808] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RollingText text="Vamos conversar" />
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              className="btn-interactive md:hidden inline-flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl border border-[#252525] bg-[#121212] cursor-pointer"
            >
              <span
                className={`h-[1.5px] w-5 bg-[#f5f5f5] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  menuOpen ? 'translate-y-[6.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-[1.5px] w-5 bg-[#f5f5f5] transition-opacity duration-300 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`h-[1.5px] w-5 bg-[#f5f5f5] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Menu móvel expansível */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.34, ease: EDITORIAL_EASE }}
              aria-label="Navegação móvel"
              className="md:hidden mt-3 border-t border-[#252525] pt-3 pb-2 flex flex-col gap-1"
            >
              {navItems.map((item, idx) => (
                <motion.button
                  key={item.label}
                  type="button"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.32, delay: idx * 0.04, ease: EDITORIAL_EASE }}
                  onClick={() => handleNav(item.path, item.hash)}
                  className="w-full text-left py-2.5 px-2 text-[17px] font-medium tracking-[-0.02em] text-[#e5e5e5] hover:text-[#ffffff] transition-colors duration-300 cursor-pointer"
                >
                  {item.label}
                </motion.button>
              ))}
              <a
                href={WHATSAPP_CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="btn-interactive mt-2 w-full rounded-full bg-[#f5f5f5] py-3 text-center text-[15px] font-medium text-[#080808] cursor-pointer"
              >
                Vamos conversar
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
