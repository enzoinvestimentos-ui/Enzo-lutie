import { SERVICES } from '../data/portfolioData';
import { Reveal } from './Reveal';

export function ServicesSection() {
  return (
    <section id="services" className="mx-auto w-full max-w-[1180px] px-6 py-14 md:py-24">
      <div className="mb-10 md:mb-12 flex flex-col gap-3.5 max-w-[740px]">
        <Reveal>
          <span className="text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]">
            Frentes integradas
          </span>
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
            <div className="card-interactive group rounded-2xl border border-[#252525] bg-[#121212] px-5 py-6 transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#e2dfd7] hover:bg-[#f1efe9] sm:px-6 md:py-7 lg:px-9 lg:py-8">
              <div className="card-hover-content flex flex-col justify-between gap-5 lg:flex-row lg:items-center lg:gap-8">
                <div className="flex max-w-[660px] flex-col gap-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[13px] font-medium tabular-nums text-[#8e8e8e] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#52524e]">
                      0{idx + 1}
                    </span>
                    <h3 className="type-card-h3 text-[#f2f2f2] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#111111]">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-[15px] md:text-[16px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#2a2a28]">
                    {service.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[14px] md:text-[15px] font-medium tracking-[-0.015em] text-[#8e8e8e] shrink-0 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#3a3a38]">
                  {service.capabilities.map((cap, index) => (
                    <span key={cap} className="inline-flex items-center gap-3">
                      <span>{cap}</span>
                      {index < service.capabilities.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="inline-block h-1 w-1 rounded-full bg-[#f2f2f2]/30 transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-125 group-hover:bg-[#111111]"
                        />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
