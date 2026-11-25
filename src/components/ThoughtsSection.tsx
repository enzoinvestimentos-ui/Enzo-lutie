import { ArrowUpRight } from 'lucide-react';
import { PRACTICE_HIGHLIGHTS, type PracticeHighlightItem } from '../data/portfolioData';
import { ArrowButton } from './ArrowButton';
import { SafeImage } from './SafeImage';
import { Reveal } from './Reveal';

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
  return (
    <a
      href={`/blog/${article.slug}`}
      onClick={(e) => {
        e.preventDefault();
        onSelect(article.slug);
      }}
      className="group relative flex min-h-[460px] flex-col justify-end overflow-hidden rounded-2xl bg-[#111111] p-6 text-left transition-shadow duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_22px_46px_-24px_rgba(17,17,17,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb4d6d]"
    >
      <div className="absolute inset-0">
        <SafeImage
          src={article.image}
          alt={article.title}
          fallbackTitle={article.title}
          entranceDelay={index * 0.06}
          className="h-full w-full object-cover opacity-80 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/95 via-[#111111]/60 to-[#111111]/25 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-90" />
      </div>

      <span
        aria-hidden="true"
        className="absolute top-5 right-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#faf7f3]/20 bg-[#111111]/60 text-[#faf7f3] backdrop-blur-sm opacity-0 translate-y-2 blur-[3px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0 group-hover:blur-0"
      >
        <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
      </span>

      <div className="relative z-10 flex flex-col gap-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5">
        <div className="text-[13px] font-normal text-[#faf7f3]/70">
          <span>{article.tag}</span>
        </div>

        <h3 className="text-[22px] md:text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#faf7f3] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#eb4d6d]">
          {article.title}
        </h3>

        <p className="text-[15px] leading-[1.5] tracking-[-0.02em] text-[#faf7f3]/80">
          {article.excerpt}
        </p>
      </div>
    </a>
  );
}

export function ThoughtsSection({ onSelectArticle, onViewAllArticles }: ThoughtsSectionProps) {
  const featuredItems = PRACTICE_HIGHLIGHTS.filter((a) => a.featuredOnHome).slice(0, 2);

  return (
    <section className="mx-auto w-full max-w-[1180px] px-6 py-20 md:py-28">
      <div className="mb-12 md:mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-5">
          <h2 className="type-section-h2 text-[#111111]">Sobre e Parcerias</h2>
        </Reveal>

        <div className="lg:col-span-7 flex flex-col gap-4 text-[17px] md:text-[18px] leading-[1.5] tracking-[-0.02em] text-[#111111]/85">
          <Reveal delay={0.08}>
            <p>
              Sou profissional da área de negócios e tecnologia, com atuação no desenvolvimento
              comercial, direcionamento de projetos e construção de soluções digitais.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p>
              Meu trabalho envolve compreender necessidades empresariais, identificar oportunidades e
              conectar diferentes competências para transformar problemas em projetos bem
              direcionados.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featuredItems.map((article, idx) => (
          <Reveal key={article.slug} delay={idx * 0.08}>
            <ArticleCard article={article} onSelect={onSelectArticle} index={idx} />
          </Reveal>
        ))}

        {/* Card escuro de síntese preservando o formato All Posts Card */}
        <Reveal delay={0.16} className="md:col-span-2 lg:col-span-1">
          <div className="flex h-full min-h-[460px] flex-col justify-between gap-6 rounded-2xl bg-[#111111] p-6 text-[#faf7f3] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#161616] hover:shadow-[0_22px_46px_-24px_rgba(17,17,17,0.3)]">
            <div className="text-[13px] text-[#faf7f3]/55">
              <span>Visão de Negócio</span>
            </div>

            <div className="my-auto flex flex-col gap-4">
              <p className="text-[18px] md:text-[19px] font-medium leading-[1.4] tracking-[-0.02em] text-[#faf7f3]">
                Tenho interesse especial em entender como as empresas funcionam: como conquistam
                clientes, organizam suas operações, tomam decisões e encontram oportunidades de
                crescimento.
              </p>
              <p className="text-[15px] leading-[1.5] tracking-[-0.02em] text-[#faf7f3]/75">
                Acredito que boas soluções não dependem apenas de conhecimento técnico. Dependem,
                principalmente, da capacidade de compreender o contexto e fazer as escolhas certas.
              </p>
            </div>

            <div>
              <ArrowButton label="Conhecer visão completa" onClick={onViewAllArticles} variant="light" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
