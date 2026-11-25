import { PRACTICE_HIGHLIGHTS } from '../data/portfolioData';
import { ArticleCard } from './ThoughtsSection';
import { Reveal } from './Reveal';

interface BlogPageProps {
  onSelectArticle: (slug: string) => void;
}

export function BlogPage({ onSelectArticle }: BlogPageProps) {
  return (
    <main id="blog-hero" className="mx-auto w-full max-w-[1180px] px-6 pt-36 pb-20">
      <div className="mb-14 md:mb-16 max-w-[740px]">
        <Reveal>
          <h1 className="type-display-lg text-[#f5f5f5]">Sobre e Visão de Trabalho</h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-5 text-[18px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1]">
            Atuação entre negócios, desenvolvimento comercial, direcionamento de projetos e
            construção de soluções digitais em parceria com a Lumo e a Krios Creative.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PRACTICE_HIGHLIGHTS.map((article, idx) => (
          <Reveal key={article.slug} delay={idx * 0.08}>
            <ArticleCard article={article} onSelect={onSelectArticle} index={idx} />
          </Reveal>
        ))}
      </div>
    </main>
  );
}
