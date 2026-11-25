import { RollingText } from './RollingText';
import { HairlineRule, Reveal } from './Reveal';

interface FooterProps {
  onNavigate: (path: string, hash?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const quickLinks = [
    { label: 'Início', path: '/', hash: '#hero-section' },
    { label: 'Diagnóstico', path: '/', hash: '#bio-section' },
    { label: 'Atuação', path: '/', hash: '#services' },
    { label: 'Projetos', path: '/work', hash: '#work-hero' },
    { label: 'Contato', path: '/', hash: '#contact' },
  ];

  return (
    <footer className="mx-auto w-full max-w-[1180px] px-6 pt-12 pb-10">
      <HairlineRule />
      <div className="pt-14 pb-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Assinatura e posicionamento à esquerda */}
          <Reveal className="md:col-span-5 flex flex-col gap-3">
            <p className="max-w-[340px] text-[22px] md:text-[26px] font-medium leading-[1.2] tracking-[-0.02em] text-[#111111]">
              Negócios primeiro. Tecnologia com propósito.
            </p>
            <p className="text-[16px] tracking-[-0.02em] text-[#111111]/65">
              Estratégia, processos e soluções digitais.
            </p>
          </Reveal>

          {/* Links Rápidos */}
          <Reveal delay={0.08} className="md:col-span-4 flex flex-col gap-4">
            <span className="text-[14px] font-medium text-[#111111]/50">/Navegação</span>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.path, link.hash)}
                    className="group text-[16px] font-normal tracking-[-0.02em] text-[#111111] hover:text-[#eb4d6d] transition-colors cursor-pointer"
                  >
                    <RollingText text={link.label} />
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Canais */}
          <Reveal delay={0.14} className="md:col-span-3 flex flex-col gap-4">
            <span className="text-[14px] font-medium text-[#111111]/50">/Canais</span>
            <div className="flex flex-wrap items-center gap-2 text-[16px] font-medium tracking-[-0.02em] text-[#111111]">
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group transition-colors hover:text-[#eb4d6d]"
              >
                <RollingText text="LinkedIn" />
              </a>
              <span aria-hidden="true" className="text-[#111111]/35">
                ·
              </span>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group transition-colors hover:text-[#eb4d6d]"
              >
                <RollingText text="Instagram" />
              </a>
              <span aria-hidden="true" className="text-[#111111]/35">
                ·
              </span>
              <button
                type="button"
                onClick={() => onNavigate('/', '#contact')}
                className="group transition-colors hover:text-[#eb4d6d] cursor-pointer"
              >
                <RollingText text="E-mail" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Marca Tipográfica Gigante + Copyright */}
      <HairlineRule />
      <div className="pt-8 flex flex-col gap-5">
        <Reveal y={18} blur={6} duration={0.95}>
          <div className="type-display-xl select-none tracking-[-0.03em] text-[#111111]">
            ESTRATÉGIA
          </div>
        </Reveal>
        <div className="flex flex-wrap items-center justify-between gap-4 text-[13px] text-[#111111]/55">
          <span>© 2026 — Todos os direitos reservados.</span>
          <span>Estratégia, processos e soluções digitais.</span>
        </div>
      </div>
    </footer>
  );
}
