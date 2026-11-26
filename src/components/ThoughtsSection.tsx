import { ArrowUpRight } from 'lucide-react';
import { PRACTICE_HIGHLIGHTS, type PracticeHighlightItem } from '../data/portfolioData';
import { ArrowButton } from './ArrowButton';
import { SafeImage } from './SafeImage';
import { Reveal } from './Reveal';
import { useMobileScrollActive } from '../hooks/useMobileScrollActive';

interface ThoughtsSectionProps {
  onSelectArticle: (slug: string) => void;
  onViewAllArticles: () => void;
}

export function ArticleCard({
  article,
  onSelect,
  index = 0,
}: {
  article: PracticeHighlightItem;
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
      href={`/blog/${article.slug}`}
      onClick={(e) => {
        e.preventDefault();
        onSelect(article.slug);
      }}
      className="card-interactive group relative flex min-h-[360px] md:min-h-[460px] flex-col justify-end overflow-hidden rounded-2xl border border-[#252525] bg-[#121212] p-6 text-left transition-[transform,border-color,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#e2dfd7] hover:bg-[#f1efe9] hover:shadow-[0_26px_54px_-24px_rgba(0,0,0,0.85)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2f2f2]"
    >
      <div className="absolute inset-0">
        <SafeImage
          src={article.image}
          alt={article.title}
          fallbackTitle={article.title}
          entranceDelay={index * 0.06}
          className="card-media-img h-full w-full object-cover opacity-90 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        <div className="card-scrim-dark absolute inset-0 bg-gradient-to-t from-[#080808]/95 via-[#080808]/60 to-[#080808]/20 opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-0" />
        <div className="card-scrim-light absolute inset-0 bg-gradient-to-t from-[#f1efe9] via-[#f1efe9]/90 to-[#f1efe9]/25 opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100" />
      </div>

      <span
        aria-hidden="true"
        className="card-corner-badge absolute top-5 right-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-[#f1efe9] opacity-0 translate-y-2 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0"
      >
        <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
      </span>

      <div className="card-hover-content card-hover-content-lift relative z-10 flex flex-col gap-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5">
        <div className="card-ink-muted text-[13px] font-normal text-[#a1a1a1] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#52524e]">
          <span>{article.tag}</span>
        </div>

        <h3 className="card-ink-title text-[22px] md:text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#f2f2f2] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#111111]">
          {article.title}
        </h3>

        <p className="card-ink-body text-[15px] leading-[1.5] tracking-[-0.015em] text-[#d4d4d4] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#2a2a28]">
          {article.excerpt}
        </p>
      </div>
    </a>
  );
}

export function ThoughtsSection({ onSelectArticle, onViewAllArticles }: ThoughtsSectionProps) {
  const featuredItems = PRACTICE_HIGHLIGHTS.filter((a) => a.featuredOnHome).slice(0, 2);
  const { ref: synthesisCardRef } = useMobileScrollActive<HTMLDivElement>({
    mode: 'once',
    delayMs: 140,
  });

  return (
    <section className="mx-auto w-full max-w-[1180px] px-6 py-14 md:py-24 max-md:border-y max-md:border-[#1c1c1c] max-md:bg-[#0c0b0b]">
      <div className="mb-10 md:mb-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
        <Reveal className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]">
            Sobre mim
          </span>
          <h2 className="type-section-h2 text-[#f2f2f2]">Sobre e Parcerias</h2>
        </Reveal>

        <div className="lg:col-span-7 flex flex-col gap-3 text-[16px] md:text-[18px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1]">
          <Reveal delay={0.05}>
            <p className="font-medium text-[#f2f2f2] max-md:border-l-2 max-md:border-[#9e1b1e]/80 max-md:pl-3.5">
              Atuo na interseção entre negócios, desenvolvimento comercial, direcionamento de
              projetos e construção de soluções digitais.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              Compreendo necessidades empresariais e conecto diferentes competências — da execução
              técnica à direção criativa — para transformar problemas em projetos bem direcionados.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featuredItems.map((article, idx) => (
          <Reveal key={article.slug} delay={idx * 0.06}>
            <ArticleCard article={article} onSelect={onSelectArticle} index={idx} />
          </Reveal>
        ))}

        {/* Card de síntese: grafite em repouso -> off-white quente #F1EFE9 no hover */}
        <Reveal delay={0.12} className="md:col-span-2 lg:col-span-1">
          <div
            ref={synthesisCardRef}
            className="card-interactive group/card flex h-full min-h-[300px] md:min-h-[460px] flex-col justify-between gap-6 rounded-2xl border border-[#252525] bg-[#151515] p-6 text-[#f2f2f2] transition-[transform,border-color,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#e2dfd7] hover:bg-[#f1efe9] hover:shadow-[0_26px_54px_-24px_rgba(0,0,0,0.85)]"
          >
            <div className="card-hover-content flex flex-1 flex-col justify-between gap-6">
              <div className="card-ink-muted text-[13px] font-medium text-[#8e8e8e] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:text-[#52524e]">
                <span>Visão de Negócio</span>
              </div>

              <div className="my-auto flex flex-col gap-3.5">
                <h3 className="card-ink-title text-[22px] md:text-[24px] font-semibold leading-[1.22] tracking-[-0.02em] text-[#f2f2f2] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:text-[#111111]">
                  Entender como a empresa gera valor antes de escolher a ferramenta.
                </h3>
                <p className="card-ink-caps text-[15px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:text-[#3a3a38]">
                  Boas soluções não dependem apenas de conhecimento técnico, mas da capacidade de
                  compreender operação, clientes e decisões para fazer as escolhas certas.
                </p>
              </div>
            </div>

            <div>
              <ArrowButton
                label="Conhecer visão completa"
                onClick={onViewAllArticles}
                variant="primary"
                adaptToCardHover
                scrollDelayMs={380}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
