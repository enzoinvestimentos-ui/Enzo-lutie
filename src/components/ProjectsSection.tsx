import { ArrowUpRight } from 'lucide-react';
import { PROJECTS, PROJECT_DECISION_PILLARS, type ProjectItem } from '../data/portfolioData';
import { ArrowButton } from './ArrowButton';
import { SafeImage } from './SafeImage';
import { Reveal, HairlineRule } from './Reveal';
import { useMobileScrollActive } from '../hooks/useMobileScrollActive';
import { handleSpotlightLeave, handleSpotlightMove } from '../utils/cursorSpotlight';

interface ProjectsSectionProps {
  onSelectProject: (slug: string) => void;
  onViewAllWork: () => void;
}

export function ProjectCard({
  project,
  onSelect,
  index = 0,
}: {
  project: ProjectItem;
  onSelect: (slug: string) => void;
  index?: number;
}) {
  const { ref } = useMobileScrollActive<HTMLAnchorElement>({
    mode: 'once',
    delayMs: index * 85,
  });

  return (
    <a
      ref={ref}
      href={`/work/${project.slug}`}
      onClick={(e) => {
        e.preventDefault();
        onSelect(project.slug);
      }}
      onMouseMove={handleSpotlightMove}
      onMouseLeave={handleSpotlightLeave}
      className="card-interactive group flex h-full flex-col gap-4 rounded-2xl border border-[#252525] bg-[#121212] p-3.5 sm:p-4 text-left transition-[background-color,border-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#e2dfd7] hover:bg-[#f1efe9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2f2f2]"
    >
      <div className="card-media-frame relative aspect-[1160/800] w-full overflow-hidden rounded-xl border border-[#252525] bg-[#151515] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-[#d5d1c7]">
        <SafeImage
          src={project.image}
          alt={`${project.title} — ${project.subtitle}`}
          fallbackTitle={project.title}
          entranceDelay={index * 0.05}
          className="card-media-img h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />

        {/* Indicador circular de ação no hover */}
        <span
          aria-hidden="true"
          className="card-corner-badge absolute top-3.5 right-3.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-[#f1efe9] opacity-0 translate-y-2 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0"
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>

      <div className="card-hover-content relative z-10 flex flex-1 flex-col justify-between gap-4 px-1.5 pb-1.5">
        <div className="card-project-body flex flex-col gap-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
          <div className="card-ink-muted flex items-center gap-2 text-[13px] font-medium text-[#8e8e8e] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#52524e]">
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.scope}</span>
          </div>

          <h3 className="card-ink-title type-project-title text-[#f2f2f2] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#111111]">
            {project.title}
          </h3>

          <p className="card-ink-body text-[15px] leading-[1.52] tracking-[-0.012em] text-[#a1a1a1] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#2a2a28]">
            {project.summary}
          </p>
        </div>

        <div className="card-divider flex items-center justify-between gap-3 border-t border-[#222222] pt-3 text-[13px] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-[#d5d1c7]">
          <span className="card-ink-sub text-[#8e8e8e] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#444440]">
            {project.subtitle}
          </span>
          <span className="card-ink-cta shrink-0 font-medium text-[#d4d4d4] transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:text-[#9e1b1e]">
            Ver estudo
          </span>
        </div>
      </div>
    </a>
  );
}

export function ProjectsSection({ onSelectProject, onViewAllWork }: ProjectsSectionProps) {
  const featured = PROJECTS.filter((p) => p.featured);

  return (
    <section
      id="work-section"
      className="relative w-full max-md:border-t max-md:border-[#1c1c1c] max-md:bg-[#0c0c0d] md:border-t md:border-[#1c1c1c] md:bg-[#0c0c0d] md:bg-[radial-gradient(ellipse_55%_42%_at_82%_8%,rgba(158,27,30,0.08)_0%,rgba(12,12,13,0)_74%)]"
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 py-14 md:py-24">
        <div className="mb-8 md:mb-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <Reveal className="flex flex-col gap-3">
            <span className="text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]">
              Direcionamento aplicado
            </span>
            <h2 className="type-section-h2 max-w-[560px] text-[#f2f2f2]">Projetos</h2>
          </Reveal>
          <Reveal delay={0.06}>
            <ArrowButton label="Explorar projetos selecionados" onClick={onViewAllWork} variant="primary" />
          </Reveal>
        </div>

        {/* Síntese e estrutura de decisão dos casos */}
        <HairlineRule />
        <div className="mb-10 md:mb-12 flex flex-col gap-6 py-7 md:py-8">
          <Reveal delay={0.04} className="flex flex-col gap-2 max-w-[740px]">
            <p className="text-[17px] md:text-[19px] font-medium leading-[1.45] tracking-[-0.015em] text-[#f2f2f2] max-md:border-l-2 max-md:border-[#9e1b1e]/80 max-md:pl-3.5">
              Uma boa ideia só gera valor quando consegue se transformar em algo concreto.
            </p>
            <p className="text-[15px] md:text-[16px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1]">
              Cada projeto parte de um desafio real e apresenta o raciocínio por trás das decisões em cinco camadas:
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
            {PROJECT_DECISION_PILLARS.map((pillar, idx) => (
              <div
                key={pillar.label}
                onMouseMove={handleSpotlightMove}
                onMouseLeave={handleSpotlightLeave}
                className={`group/pillar desktop-spotlight-surface max-sm:rounded-xl max-sm:border max-sm:border-[#1f1f1f] max-sm:bg-[#121212]/80 max-sm:p-3 sm:rounded-xl sm:border sm:border-[#202020] sm:bg-[#121212]/75 sm:p-4 sm:transition-[transform,border-color,background-color] sm:duration-300 sm:hover:-translate-y-0.5 sm:hover:border-[#422325] sm:hover:bg-[#161212] ${
                  idx === 4 ? 'max-sm:col-span-2' : ''
                }`}
              >
                <Reveal delay={0.05 + idx * 0.04} className="relative z-10 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-semibold text-[#f2f2f2]">{pillar.label}</span>
                    <span className="text-[11px] font-semibold tabular-nums tracking-[0.06em] text-[#9e1b1e] sm:text-[#5c5c5c] sm:transition-colors sm:duration-300 sm:group-hover/pillar:text-[#9e1b1e]">
                      0{idx + 1}
                    </span>
                  </div>
                  <span className="text-[13px] leading-[1.45] text-[#8e8e8e] sm:transition-colors sm:duration-300 sm:group-hover/pillar:text-[#b4b4b4]">
                    {pillar.description}
                  </span>
                </Reveal>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {featured.map((project, idx) => (
            <Reveal key={project.slug} delay={idx * 0.05} className="h-full">
              <ProjectCard project={project} onSelect={onSelectProject} index={idx} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
