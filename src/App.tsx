import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { LanguageProvider } from './i18n/LanguageContext';
import { Navbar, type RoutePath } from './components/Navbar';
import { ScrollProgressBar, EDITORIAL_EASE } from './components/Reveal';
import { IntroSequence } from './components/IntroSequence';
import { DynamicBackground } from './components/DynamicBackground';
import { HeroBioSection } from './components/HeroBioSection';
import { QuoteSection } from './components/QuoteSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SocialProofSection } from './components/SocialProofSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ThoughtsSection } from './components/ThoughtsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WorkPage } from './components/WorkPage';
import { WorkDetailPage } from './components/WorkDetailPage';
import { BlogPage } from './components/BlogPage';
import { BlogDetailPage } from './components/BlogDetailPage';

function parseRoute(pathname: string): RoutePath {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/work') return { page: 'work' };
  if (clean.startsWith('/work/')) {
    return { page: 'work-detail', slug: clean.replace('/work/', '') };
  }
  if (clean === '/blog') return { page: 'blog' };
  if (clean.startsWith('/blog/')) {
    return { page: 'blog-detail', slug: clean.replace('/blog/', '') };
  }
  return { page: 'home' };
}

function getRouteKey(route: RoutePath): string {
  if (route.page === 'work-detail' || route.page === 'blog-detail') {
    return `${route.page}:${route.slug}`;
  }
  return route.page;
}

export default function App() {
  const [route, setRoute] = useState<RoutePath>(() => parseRoute(window.location.pathname));
  const [introComplete, setIntroComplete] = useState(false);
  const routeKey = getRouteKey(route);
  const [routeSettled, setRouteSettled] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.introComplete = introComplete ? 'true' : 'false';
    if (introComplete) {
      window.dispatchEvent(new CustomEvent('intro:complete'));
    }
  }, [introComplete]);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  useEffect(() => {
    setRouteSettled(false);
  }, [routeKey]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((path: string, hash?: string) => {
    const nextRoute = parseRoute(path);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path + (hash ?? ''));
    }
    setRoute(nextRoute);

    if (hash) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const target = document.querySelector(hash);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 60);
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <div className="relative min-h-screen overflow-x-clip bg-[#080808] text-[#f2f2f2]">
          {!introComplete && <IntroSequence onComplete={handleIntroComplete} />}
          <DynamicBackground isHome={route.page === 'home'} />

          <ScrollProgressBar />
          <Navbar route={route} onNavigate={navigate} />

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={routeKey}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
                transition={{ duration: 0.42, ease: EDITORIAL_EASE }}
                onAnimationComplete={() => setRouteSettled(true)}
                style={routeSettled ? { filter: 'none', transform: 'none' } : undefined}
              >
                {route.page === 'home' && (
                  <main>
                    <HeroBioSection
                      onGetStarted={() => navigate('/', '#contact')}
                      onExploreProjects={() => navigate('/', '#work-section')}
                    />
                    <QuoteSection />
                    <ServicesSection />
                    <ProjectsSection
                      onSelectProject={(slug) => navigate(`/work/${slug}`)}
                      onViewAllWork={() => navigate('/work')}
                    />
                    <SocialProofSection />
                    <TestimonialsSection />
                    <ThoughtsSection
                      onSelectArticle={(slug) => navigate(`/blog/${slug}`)}
                      onViewAllArticles={() => navigate('/blog')}
                    />
                    <ContactSection />
                  </main>
                )}

                {route.page === 'work' && (
                  <WorkPage onSelectProject={(slug) => navigate(`/work/${slug}`)} />
                )}

                {route.page === 'work-detail' && (
                  <WorkDetailPage
                    slug={route.slug}
                    onBack={() => navigate('/work')}
                    onSelectProject={(slug) => navigate(`/work/${slug}`)}
                  />
                )}

                {route.page === 'blog' && (
                  <BlogPage onSelectArticle={(slug) => navigate(`/blog/${slug}`)} />
                )}

                {route.page === 'blog-detail' && (
                  <BlogDetailPage slug={route.slug} onBack={() => navigate('/blog')} />
                )}
              </motion.div>
            </AnimatePresence>

            <Footer onNavigate={navigate} />
          </div>
        </div>
      </MotionConfig>
    </LanguageProvider>
  );
}
