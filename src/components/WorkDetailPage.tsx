import { ArrowLeft } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { SafeImage } from './SafeImage';
import { ProjectCard } from './ProjectsSection';
import { Reveal, HairlineRule } from './Reveal';

interface WorkDetailPageProps {
  slug: string;
  onBack: () => void;
  onSelectProject: (slug: string) => void;
}

export function WorkDetailPage({ slug, onBack, onSelectProject }: WorkDetailPageProps) {
  const project = PROJECTS.find((p) => p.slug === slug) ?? PROJECTS[0];
  const related = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 2);

  const structuredBlocks = [
    { heading: 'Contexto', text: project.decisionDetails.contexto },
    { heading: 'Desafio', text: project.decisionDetails.desafio },
    { heading: 'Direcionamento', text: project.decisionDetails.direcionamento },
    { heading: 'Solução', text: project.decisionDetails.solucao },
    { heading: 'Impacto', text: project.decisionDetails.impacto },
  ];

  return (
    <main id="work-detail" className="mx-auto w-full max-w-[1180px] px-6 pt-32 pb-20">
      <button
        type="button"
        onClick={onBack}
        className="group mb-10 inline-flex items-center gap-2 text-[15px] font-medium text-[#111111]/65 transition-colors duration-300 hover:text-[#111111] cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1" />
        <span>Todos os projetos</span>
      </button>

      <div className="mb-12 flex flex-col gap-8">
        <Reveal>
          <h1 className="type-display-lg text-[#111111]">{project.title}</h1>
        </Reveal>

        <HairlineRule />
        <Reveal delay={0.06}>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-2 text-[15px] text-[#111111]/75">
            <div>
              <span className="mr-2 text-[#111111]/45">Frente</span>
              <span className="font-medium text-[#111111]">{project.category}</span>
            </div>
            <span aria-hidden="true" className="text-[#111111]/25">
              /
            </span>
            <div>
              <span className="mr-2 text-[#111111]/45">Escopo</span>
              <span className="font-medium text-[#111111]">{project.scope}</span>
            </div>
          </div>
        </Reveal>
        <HairlineRule />

        <Reveal delay={0.1}>
          <p className="max-w-[780px] text-[20px] md:text-[22px] font-normal leading-[1.45] tracking-[-0.02em] text-[#111111]/85">
            {project.summary}
          </p>
        </Reveal>
      </div>

      <div className="mb-16 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#111111]/10 bg-[#efeae2]">
        <SafeImage
          src={project.image}
          alt={project.title}
          fallbackTitle={project.title}
          entranceDelay={0.12}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Estrutura de 5 decisões da copy oficial */}
      <div className="mx-auto flex max-w-[760px] flex-col gap-10 pb-20">
        {structuredBlocks.map((block, idx) => (
          <Reveal key={block.heading} delay={idx * 0.06}>
            <section className="flex flex-col gap-3 border-b border-[#111111]/10 pb-8 last:border-b-0">
              <h2 className="text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] text-[#111111]">
                {block.heading}
              </h2>
              <p className="text-[17px] leading-[1.6] tracking-[-0.01em] text-[#111111]/80">
                {block.text}
              </p>
            </section>
          </Reveal>
        ))}
      </div>

      <HairlineRule />
      <div className="pt-16">
        <Reveal>
          <h2 className="type-card-h3 mb-8 text-[#111111]">Outros Projetos</h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {related.map((item, idx) => (
            <Reveal key={item.slug} delay={idx * 0.08}>
              <ProjectCard project={item} onSelect={onSelectProject} index={idx} />
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
