import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { VALUE_PERSPECTIVES, type ValuePerspectiveItem } from '../data/portfolioData';
import { Reveal } from './Reveal';

function PerspectiveMark({ id }: { id: ValuePerspectiveItem['iconId'] }) {
  switch (id) {
    case 'site':
      return (
        <svg viewBox="0 0 120 32" className="h-7 w-auto text-[#faf7f3]" fill="none" aria-hidden="true">
          <rect x="4" y="6" width="22" height="20" rx="3" stroke="currentColor" strokeWidth="2.2" />
          <line x1="4" y1="12" x2="26" y2="12" stroke="#eb4d6d" strokeWidth="2.2" />
          <text x="36" y="21" fill="currentColor" fontSize="15" fontWeight="700" fontFamily="Archivo, sans-serif">
            Site
          </text>
        </svg>
      );
    case 'crm':
      return (
        <svg viewBox="0 0 120 32" className="h-7 w-auto text-[#faf7f3]" fill="none" aria-hidden="true">
          <circle cx="10" cy="16" r="5" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="24" cy="16" r="5" stroke="#eb4d6d" strokeWidth="2.2" />
          <text x="38" y="21" fill="currentColor" fontSize="15" fontWeight="700" fontFamily="Archivo, sans-serif">
            CRM
          </text>
        </svg>
      );
    case 'automation':
      return (
        <svg viewBox="0 0 140 32" className="h-7 w-auto text-[#faf7f3]" fill="none" aria-hidden="true">
          <path d="M4 16H14L19 8L24 24L29 16H36" stroke="#eb4d6d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="44" y="21" fill="currentColor" fontSize="15" fontWeight="700" fontFamily="Archivo, sans-serif">
            Fluxos
          </text>
        </svg>
      );
    case 'strategy':
      return (
        <svg viewBox="0 0 140 32" className="h-7 w-auto text-[#faf7f3]" fill="none" aria-hidden="true">
          <path d="M4 22L13 13L19 19L28 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="28" cy="9" r="3" fill="#eb4d6d" />
          <text x="40" y="21" fill="currentColor" fontSize="15" fontWeight="700" fontFamily="Archivo, sans-serif">
            Negócios
          </text>
        </svg>
      );
  }
}

function PerspectiveCard({ item }: { item: ValuePerspectiveItem }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="perspective-1200 h-[340px] w-full">
      <button
        type="button"
        onClick={() => setFlipped((prev) => !prev)}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        aria-label={`${item.pillarTitle}. Alternar cartão para visualizar síntese.`}
        className="preserve-3d relative h-full w-full cursor-pointer rounded-2xl text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_18px_40px_-20px_rgba(17,17,17,0.22)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb4d6d]"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Face Frontal: Declaração integral de valor */}
        <div className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-2xl border border-[#111111]/10 bg-[#f4efe7] p-6">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#111111]/50">
              {item.pillarTitle}
            </span>
            <RotateCw className="h-3.5 w-3.5 shrink-0 text-[#111111]/35" aria-hidden="true" />
          </div>

          <p className="text-[16px] font-normal leading-[1.48] tracking-[-0.02em] text-[#111111]">
            {item.statement}
          </p>

          <div className="border-t border-[#111111]/10 pt-4">
            <p className="text-[14px] font-medium text-[#111111]/65">{item.pillarSubtitle}</p>
          </div>
        </div>

        {/* Face Traseira: Síntese escura */}
        <div
          className="backface-hidden absolute inset-0 flex flex-col items-start justify-between rounded-2xl border border-[#faf7f3]/10 bg-[#111111] p-6 text-[#faf7f3]"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <span className="text-[12px] font-medium tracking-[0.04em] text-[#faf7f3]/50">
            Perspectiva de Valor
          </span>

          <div className="my-auto">
            <PerspectiveMark id={item.iconId} />
          </div>

          <div className="w-full border-t border-[#faf7f3]/15 pt-4 flex items-center justify-between gap-2">
            <span className="text-[13px] text-[#faf7f3]/75">{item.pillarSubtitle}</span>
            <RotateCw className="h-3.5 w-3.5 shrink-0 text-[#eb4d6d]" aria-hidden="true" />
          </div>
        </div>
      </button>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-6 py-20 md:py-28">
      <Reveal>
        <div className="mb-12 md:mb-14 flex flex-col gap-5 max-w-[760px]">
          <h2 className="type-section-h2 text-[#111111]">O valor de cada solução</h2>
          <p className="text-[18px] md:text-[20px] leading-[1.45] tracking-[-0.02em] text-[#111111]/75">
            É essa perspectiva que orienta minhas decisões e a forma como participo de cada projeto.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {VALUE_PERSPECTIVES.map((item, idx) => (
          <Reveal key={item.id} delay={idx * 0.08}>
            <PerspectiveCard item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
