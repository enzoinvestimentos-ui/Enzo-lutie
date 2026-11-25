import { SERVICES } from '../data/portfolioData';
import { Reveal } from './Reveal';

export function ServicesSection() {
  return (
    <section id="services" className="mx-auto w-full max-w-[1180px] px-6 py-20 md:py-28">
      <div className="mb-12 md:mb-14 flex flex-col gap-5 max-w-[740px]">
        <Reveal>
          <h2 className="type-section-h2 text-[#f2f2f2]">Áreas de Atuação</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-[18px] md:text-[20px] leading-[1.5] tracking-[-0.015em] text-[#a1a1a1]">
            Minha atuação transita entre áreas que, embora muitas vezes sejam tratadas separadamente,
            precisam funcionar de maneira integrada.
          </p>
        </Reveal>
      </div>

      <div className="flex flex-col gap-4">
        {SERVICES.map((service, idx) => (
          <Reveal key={service.id} delay={idx * 0.08}>
            <div className="card-interactive group rounded-2xl border border-[#252525] bg-[#121212] px-6 py-7 transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#e2dfd7] hover:bg-[#f1efe9] lg:px-9 lg:py-9">
              <div className="card-hover-content flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="max-w-[660px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                  <h3 className="type-card-h3 text-[#f2f2f2] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#111111]">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-[16px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#2a2a28]">
                    {service.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[15px] font-normal tracking-[-0.015em] text-[#8e8e8e] shrink-0 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#3a3a38]">
                  {service.capabilities.map((cap, index) => (
                    <span key={cap} className="inline-flex items-center gap-3">
                      <span>{cap}</span>
                      {index < service.capabilities.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="inline-block h-1.5 w-1.5 rounded-full bg-[#f2f2f2]/25 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-125 group-hover:bg-[#111111]"
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
