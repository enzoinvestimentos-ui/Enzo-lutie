import { SERVICES } from '../data/portfolioData';
import { Reveal } from './Reveal';

export function ServicesSection() {
  return (
    <section id="services" className="mx-auto w-full max-w-[1180px] px-6 py-20 md:py-28">
      <Reveal>
        <div className="mb-12 md:mb-14 flex flex-col gap-5 max-w-[740px]">
          <h2 className="type-section-h2 text-[#111111]">Áreas de Atuação</h2>
          <p className="text-[18px] md:text-[20px] leading-[1.45] tracking-[-0.02em] text-[#111111]/75">
            Minha atuação transita entre áreas que, embora muitas vezes sejam tratadas separadamente,
            precisam funcionar de maneira integrada.
          </p>
        </div>
      </Reveal>

      <div className="flex flex-col gap-4">
        {SERVICES.map((service, idx) => (
          <Reveal key={service.id} delay={idx * 0.08}>
            <div className="group flex flex-col justify-between gap-6 rounded-2xl border border-[#111111]/10 bg-[#faf7f3] px-6 py-7 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#111111]/30 hover:bg-[#f4efe7] lg:flex-row lg:items-center lg:px-9 lg:py-9">
              <div className="max-w-[660px] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
                <h3 className="type-card-h3 text-[#111111]">{service.title}</h3>
                <p className="mt-2.5 text-[16px] leading-[1.5] tracking-[-0.02em] text-[#111111]/75">
                  {service.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[15px] font-normal tracking-[-0.02em] text-[#111111]/70 shrink-0 transition-colors duration-300 group-hover:text-[#111111]">
                {service.capabilities.map((cap, index) => (
                  <span key={cap} className="inline-flex items-center gap-3">
                    <span>{cap}</span>
                    {index < service.capabilities.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[#111111]/30 transition-all duration-300 group-hover:scale-125 group-hover:bg-[#eb4d6d]"
                      />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
