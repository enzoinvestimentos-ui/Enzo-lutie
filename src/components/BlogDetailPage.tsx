import { ArrowLeft } from 'lucide-react';
import { PRACTICE_HIGHLIGHTS } from '../data/portfolioData';
import { SafeImage } from './SafeImage';
import { Reveal } from './Reveal';

interface BlogDetailPageProps {
  slug: string;
  onBack: () => void;
}

export function BlogDetailPage({ slug, onBack }: BlogDetailPageProps) {
  const article = PRACTICE_HIGHLIGHTS.find((a) => a.slug === slug) ?? PRACTICE_HIGHLIGHTS[0];

  return (
    <main id="article-section" className="mx-auto w-full max-w-[1180px] px-6 pt-32 pb-20">
      <button
        type="button"
        onClick={onBack}
        className="group mb-10 inline-flex items-center gap-2 text-[15px] font-medium text-[#a1a1a1] transition-colors duration-300 hover:text-[#f5f5f5] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5f5f5]"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1" />
        <span>Voltar para Sobre</span>
      </button>

      <article className="mx-auto max-w-[820px]">
        <header className="mb-10 flex flex-col gap-5">
          <Reveal>
            <div className="text-[14px] text-[#8e8e8e]">
              <span>{article.tag}</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="type-display-lg text-[#f5f5f5]">{article.title}</h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-[20px] leading-[1.5] tracking-[-0.015em] text-[#d4d4d4]">
              {article.excerpt}
            </p>
          </Reveal>
        </header>

        <div className="mb-14 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#252525] bg-[#121212]">
          <SafeImage
            src={article.image}
            alt={article.title}
            fallbackTitle={article.title}
            entranceDelay={0.12}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-10">
          {article.sections.map((section, idx) => (
            <Reveal key={idx} delay={idx * 0.06}>
              <section className="flex flex-col gap-4">
                {section.heading && (
                  <h2 className="text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] text-[#f5f5f5]">
                    {section.heading}
                  </h2>
                )}
                {section.paragraphs.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-[17px] leading-[1.65] tracking-[-0.01em] text-[#a1a1a1]"
                  >
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-2 flex flex-col gap-2.5 pl-5 list-disc text-[17px] leading-[1.55] text-[#a1a1a1]">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            </Reveal>
          ))}
        </div>
      </article>
    </main>
  );
}
