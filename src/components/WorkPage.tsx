import { PROJECTS, PROJECT_DECISION_PILLARS } from '../data/portfolioData';
import { ProjectCard } from './ProjectsSection';
import { Reveal, HairlineRule } from './Reveal';

interface WorkPageProps {
  onSelectProject: (slug: string) => void;
}

export function WorkPage({ onSelectProject }: WorkPageProps) {
  return (
    <main id="work-hero" className="mx-auto w-full max-w-[1180px] px-6 pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="mb-10 max-w-[740px]">
        <Reveal className="flex flex-col gap-3">
          <span className="text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]">
            Direcionamento aplicado
          </span>
          <h1 className="type-display-lg text-[#f2f2f2]">Projetos Selecionados</h1>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-4 text-[17px] md:text-[18px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1]">
            Projetos que conectam necessidades reais de negócio a soluções digitais, estruturados
            com foco em raciocínio estratégico e execução consistente.
          </p>
        </Reveal>
      </div>

      <HairlineRule />
      <div className="grid grid-cols-1 gap-4 py-7 sm:grid-cols-2 lg:grid-cols-5">
        {PROJECT_DECISION_PILLARS.map((pillar, idx) => (
          <Reveal key={pillar.label} delay={idx * 0.04} className="flex flex-col gap-1">
            <span className="text-[14px] font-semibold text-[#f2f2f2]">{pillar.label}</span>
            <span className="text-[13px] leading-[1.45] text-[#8e8e8e]">
              {pillar.description}
            </span>
          </Reveal>
        ))}
      </div>
      <HairlineRule className="mb-10 md:mb-12" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {PROJECTS.map((project, idx) => (
          <Reveal key={project.slug} delay={idx * 0.05} className="h-full">
            <ProjectCard project={project} onSelect={onSelectProject} index={idx} />
          </Reveal>
        ))}
      </div>
    </main>
  );
}
