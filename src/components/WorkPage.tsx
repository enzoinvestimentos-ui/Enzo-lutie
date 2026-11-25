import { PROJECTS, PROJECT_DECISION_PILLARS } from '../data/portfolioData';
import { ProjectCard } from './ProjectsSection';
import { Reveal, HairlineRule } from './Reveal';

interface WorkPageProps {
  onSelectProject: (slug: string) => void;
}

export function WorkPage({ onSelectProject }: WorkPageProps) {
  return (
    <main id="work-hero" className="mx-auto w-full max-w-[1180px] px-6 pt-36 pb-20">
      <Reveal>
        <div className="mb-12 max-w-[740px]">
          <h1 className="type-display-lg text-[#111111]">Projetos Selecionados</h1>
          <p className="mt-5 text-[18px] leading-[1.55] tracking-[-0.02em] text-[#111111]/75">
            Participo do direcionamento e desenvolvimento de projetos que conectam necessidades de
            negócio a soluções digitais, trabalhando em parceria com profissionais e equipes
            especializadas. Cada projeto parte de um contexto específico: um desafio a resolver, uma
            oportunidade a explorar ou uma estrutura que precisa evoluir.
          </p>
        </div>
      </Reveal>

      <HairlineRule />
      <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 lg:grid-cols-5">
        {PROJECT_DECISION_PILLARS.map((pillar, idx) => (
          <Reveal key={pillar.label} delay={idx * 0.05} className="flex flex-col gap-1.5">
            <span className="text-[14px] font-semibold text-[#111111]">{pillar.label}</span>
            <span className="text-[14px] leading-[1.45] text-[#111111]/70">
              {pillar.description}
            </span>
          </Reveal>
        ))}
      </div>
      <HairlineRule className="mb-14" />

      <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2">
        {PROJECTS.map((project, idx) => (
          <Reveal key={project.slug} delay={idx * 0.08}>
            <ProjectCard project={project} onSelect={onSelectProject} />
          </Reveal>
        ))}
      </div>
    </main>
  );
}
