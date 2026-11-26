import { ArrowUpRight } from 'lucide-react';
import { SERVICES, type ServiceItem } from '../data/portfolioData';
import { Reveal } from './Reveal';
import { useMobileScrollActive } from '../hooks/useMobileScrollActive';
import { handleSpotlightLeave, handleSpotlightMove } from '../utils/cursorSpotlight';

function ServiceCard({ service, idx }: { service: ServiceItem; idx: number }) {
  const { ref } = useMobileScrollActive<HTMLDivElement>({
    mode: 'once',
    delayMs: idx * 80,
  });

  return (
    <div
      ref={ref}
      onMouseMove={handleSpotlightMove}
      onMouseLeave={handleSpotlightLeave}
      className="card-interactive group rounded-2xl border border-[#252525] bg-[#121212] px-5 py-6 transition-[background-color,border-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#e2dfd7] hover:bg-[#f1efe9] sm:px-6 md:py-7 lg:px-9 lg:py-8"
    >
      <div className="card-hover-content relative z-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="card-service-body flex max-w-[640px] flex-col gap-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
          <div className="flex items-baseline gap-3">
            <span className="card-ink-muted text-[13px] font-medium tabular-nums text-[#8e8e8e] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#9e1b1e]">
              0{idx + 1}
            </span>
            <h3 className="card-ink-title type-card-h3 text-[#f2f2f2] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#111111]">
              {service.title}
            </h3>
          </div>
          <p className="card-ink-body text-[15px] md:text-[16px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#2a2a28]">
            {service.description}
          </p>
        </div>

        <div className="flex items-center gap-5 shrink-0">
          <div className="card-ink-caps flex flex-wrap items-center max-md:gap-2 md:gap-x-3 md:gap-y-1.5 max-md:text-[12px] md:text-[15px] font-medium tracking-[-0.015em] text-[#8e8e8e] shrink-0 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#3a3a38]">
            {service.capabilities.map((cap, index) => (
              <span
                key={cap}
                className="mobile-cap-pill inline-flex items-center gap-3 max-md:rounded-full max-md:border max-md:border-[#2a2a2a] max-md:px-2.5 max-md:py-1 transition-colors duration-500"
              >
                <span>{cap}</span>
                {index < service.capabilities.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="card-cap-dot hidden md:inline-block h-1 w-1 rounded-full bg-[#f2f2f2]/30 transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-125 group-hover:bg-[#111111]"
                  />
                )}
              </span>
            ))}
          </div>

          <span
            aria-hidden="true"
            className="hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2a2a2a] text-[#8e8e8e] opacity-40 transition-[opacity,transform,border-color,background-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:border-[#111111] group-hover:bg-[#111111] group-hover:text-[#f1efe9]"
          >
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        </div>
      </div>
    </div>
  );
}

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative w-full md:bg-[radial-gradient(ellipse_52%_48%_at_14%_14%,rgba(158,27,30,0.065)_0%,rgba(8,8,8,0)_74%)]"
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 py-16 md:py-24">
        <div className="mb-9 md:mb-12 flex flex-col gap-3.5 max-w-[740px]">
          <Reveal>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#9e1b1e] md:hidden" />
              <span className="text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]">
                Frentes integradas
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.04}>
            <h2 className="type-section-h2 text-[#f2f2f2]">Áreas de Atuação</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-[17px] md:text-[19px] leading-[1.5] tracking-[-0.015em] text-[#a1a1a1]">
              Áreas que costumam ser tratadas de forma isolada, mas que precisam operar juntas para
              gerar resultado.
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-4">
          {SERVICES.map((service, idx) => (
            <Reveal key={service.id} delay={idx * 0.05}>
              <ServiceCard service={service} idx={idx} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

