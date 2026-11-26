import { RollingText } from './RollingText';
import { HairlineRule, Reveal } from './Reveal';
import { useMobileScrollActive } from '../hooks/useMobileScrollActive';

interface FooterProps {
  onNavigate: (path: string, hash?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { ref: linksContainerRef } = useMobileScrollActive<HTMLDivElement>({
    mode: 'pulse',
    delayMs: 120,
    pulseMs: 950,
  });

  const quickLinks = [
    { label: 'Início', path: '/', hash: '#hero-section' },
    { label: 'Diagnóstico', path: '/', hash: '#bio-section' },
    { label: 'Atuação', path: '/', hash: '#services' },
    { label: 'Projetos', path: '/work', hash: '#work-hero' },
    { label: 'Contato', path: '/', hash: '#contact' },
  ];

  return (
    <footer className="mx-auto w-full max-w-[1180px] px-6 pt-10 pb-10">
      <HairlineRule />
      <div ref={linksContainerRef} className="pt-12 pb-12 md:pt-14 md:pb-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Assinatura e posicionamento à esquerda */}
          <Reveal className="md:col-span-5 flex flex-col gap-3">
            <p className="max-w-[340px] text-[22px] md:text-[26px] font-medium leading-[1.2] tracking-[-0.02em] text-[#f2f2f2]">
              Negócios primeiro. Tecnologia com propósito.
            </p>
            <p className="text-[16px] tracking-[-0.015em] text-[#a1a1a1]">
              Estratégia, processos e soluções digitais.
            </p>
          </Reveal>

          {/* Links Rápidos */}
          <Reveal delay={0.08} className="md:col-span-4 flex flex-col gap-4">
            <span className="text-[13px] font-medium text-[#8e8e8e]">Navegação</span>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
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
            <span className="text-[13px] font-medium text-[#8e8e8e]">Canais</span>
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
                <RollingText text="E-mail" />
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
            Enzo Lutie
          </div>
          <p className="text-[14px] md:text-[16px] font-bold tracking-[-0.015em] text-[#a1a1a1]">
            Estratégias, Processos e Soluções Digitais
          </p>
        </Reveal>

        <span className="text-[13px] text-[#8e8e8e] md:text-right shrink-0">
          © 2026 — Todos os direitos reservados.
        </span>
      </div>
    </footer>
  );
}

