import { ArrowUpRight } from 'lucide-react';
import { PROJECTS, PROJECT_DECISION_PILLARS, type ProjectItem } from '../data/portfolioData';
import { ArrowButton } from './ArrowButton';
import { SafeImage } from './SafeImage';
import { Reveal, HairlineRule } from './Reveal';

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
  return (
    <a
      href={`/work/${project.slug}`}
      onClick={(e) => {
        e.preventDefault();
        onSelect(project.slug);
      }}
      className="card-interactive group flex flex-col gap-4 rounded-2xl border border-[#252525] bg-[#121212] p-3.5 sm:p-4 text-left transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#e2dfd7] hover:bg-[#f1efe9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2f2f2]"
    >
      <div className="relative aspect-[1160/800] w-full overflow-hidden rounded-xl border border-[#252525] bg-[#151515] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-[#d5d1c7]">
        <SafeImage
          src={project.image}
          alt={`${project.title} — ${project.subtitle}`}
          fallbackTitle={project.title}
          entranceDelay={index * 0.06}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />

        {/* Indicador circular de ação no hover */}
        <span
          aria-hidden="true"
          className="absolute top-3.5 right-3.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-[#f1efe9] opacity-0 translate-y-2 blur-[3px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0 group-hover:blur-0"
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>

      <div className="card-hover-content flex items-baseline justify-between gap-4 px-1 pb-1">
        <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
          <h3 className="type-project-title text-[#f2f2f2] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#111111]">
            {project.title}
          </h3>
          <p className="mt-1 text-[15px] md:text-[16px] font-normal tracking-[-0.015em] text-[#a1a1a1] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#444440]">
            {project.subtitle}
          </p>
        </div>
        <span className="text-[13px] font-medium text-[#8e8e8e] shrink-0 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#52524e]">
          {project.scope}
        </span>
      </div>
    </a>
  );
}

export function ProjectsSection({ onSelectProject, onViewAllWork }: ProjectsSectionProps) {
  const featured = PROJECTS.filter((p) => p.featured);

  return (
    <section id="work-section" className="mx-auto w-full max-w-[1180px] px-6 py-20 md:py-28">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <h2 className="type-section-h2 max-w-[560px] text-[#f2f2f2]">Projetos</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <ArrowButton label="Explorar projetos selecionados" onClick={onViewAllWork} variant="primary" />
        </Reveal>
      </div>

      {/* Introdução e critérios de decisão dos projetos */}
      <HairlineRule />
      <div className="mb-14 grid grid-cols-1 gap-8 py-10 lg:grid-cols-12">
        <Reveal delay={0.06} className="flex flex-col gap-4 text-[17px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1] lg:col-span-6">
          <p className="font-medium text-[#f5f5f5]">
            Uma boa ideia só gera valor quando consegue se transformar em algo concreto.
          </p>
          <p>
            Participo do direcionamento e desenvolvimento de projetos que conectam necessidades de
            negócio a soluções digitais, trabalhando em parceria com profissionais e equipes
            especializadas.
          </p>
          <p>
            Cada projeto parte de um contexto específico: um desafio a resolver, uma oportunidade
            a explorar ou uma estrutura que precisa evoluir.
          </p>
          <p>
            Mais do que apresentar o que foi desenvolvido, acredito que é importante mostrar o
            raciocínio por trás de cada decisão.
          </p>
        </Reveal>

        <Reveal delay={0.14} className="flex flex-col justify-center gap-3 lg:col-span-6 lg:pl-8">
          {PROJECT_DECISION_PILLARS.map((pillar) => (
            <div
              key={pillar.label}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 border-b border-[#252525] pb-2.5 last:border-b-0 last:pb-0 text-[15px] md:text-[16px] leading-[1.45]"
            >
              <span className="font-semibold text-[#f5f5f5] shrink-0">{pillar.label}:</span>
              <span className="text-[#a1a1a1]">{pillar.description}</span>
            </div>
          ))}
        </Reveal>
      </div>
      <HairlineRule className="mb-14" />

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2">
        {featured.map((project, idx) => (
          <Reveal key={project.slug} delay={idx * 0.08}>
            <ProjectCard project={project} onSelect={onSelectProject} index={idx} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
