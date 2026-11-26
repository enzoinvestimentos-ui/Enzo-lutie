import { RollingText } from './RollingText';
import { HairlineRule, Reveal } from './Reveal';
import { useMobileScrollActive } from '../hooks/useMobileScrollActive';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  onNavigate: (path: string, hash?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useLanguage();
  const { ref: linksContainerRef } = useMobileScrollActive<HTMLDivElement>({
    mode: 'pulse',
    delayMs: 120,
    pulseMs: 950,
  });

  const quickLinks = [
    { key: 'home', label: t.footer.navItems.home, path: '/', hash: '#hero-section' },
    { key: 'diagnosis', label: t.footer.navItems.diagnosis, path: '/', hash: '#bio-section' },
    { key: 'practice', label: t.footer.navItems.practice, path: '/', hash: '#services' },
    { key: 'projects', label: t.footer.navItems.projects, path: '/work', hash: '#work-hero' },
    { key: 'contact', label: t.footer.navItems.contact, path: '/', hash: '#contact' },
  ];

  return (
    <footer className="mx-auto w-full max-w-[1180px] px-6 pt-10 pb-10">
      <HairlineRule />
      <div ref={linksContainerRef} className="pt-12 pb-12 md:pt-14 md:pb-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Assinatura e posicionamento à esquerda */}
          <Reveal className="md:col-span-5 flex flex-col gap-3">
            <p className="max-w-[340px] text-[22px] md:text-[26px] font-medium leading-[1.2] tracking-[-0.02em] text-[#f2f2f2]">
              {t.footer.headline}
            </p>
            <p className="text-[16px] tracking-[-0.015em] text-[#a1a1a1]">
              {t.footer.subheadline}
            </p>
          </Reveal>

          {/* Links Rápidos */}
          <Reveal delay={0.08} className="md:col-span-4 flex flex-col gap-4">
            <span className="text-[13px] font-medium text-[#8e8e8e]">{t.footer.navTitle}</span>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.path, link.hash)}
                    className="group text-[16px] font-normal tracking-[-0.015em] text-[#d4d4d4] hover:text-[#ffffff] transition-colors cursor-pointer"
                  >
                    <RollingText text={link.label} />
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Canais */}
          <Reveal delay={0.14} className="md:col-span-3 flex flex-col gap-4">
            <span className="text-[13px] font-medium text-[#8e8e8e]">{t.footer.channelsTitle}</span>
            <div className="flex flex-wrap items-center gap-2 text-[16px] font-medium tracking-[-0.015em] text-[#d4d4d4]">
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group transition-colors hover:text-[#ffffff]"
              >
                <RollingText text="LinkedIn" />
              </a>
              <span aria-hidden="true" className="text-[#525252]">
                ·
              </span>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group transition-colors hover:text-[#ffffff]"
              >
                <RollingText text="Instagram" />
              </a>
              <span aria-hidden="true" className="text-[#525252]">
                ·
              </span>
              <button
                type="button"
                onClick={() => onNavigate('/', '#contact')}
                className="group transition-colors hover:text-[#ffffff] cursor-pointer"
              >
                <RollingText text={t.footer.emailChannel} />
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Assinatura Tipográfica + Copyright */}
      <HairlineRule />
      <div className="pt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal y={18} blur={6} duration={0.95} className="flex flex-col gap-2.5">
          <div className="type-display-xl select-none tracking-[-0.03em] text-[#f5f5f5]">
            {t.footer.signatureTitle}
          </div>
          <p className="text-[14px] md:text-[16px] font-bold tracking-[-0.015em] text-[#a1a1a1]">
            {t.footer.signatureSubtitle}
          </p>
        </Reveal>

        <span className="text-[13px] text-[#8e8e8e] md:text-right shrink-0">
          {t.footer.copyright}
        </span>
      </div>
    </footer>
  );
}

