import { useEffect, useState, type FocusEvent, type FormEvent } from 'react';
import { Check, Mail } from 'lucide-react';
import { Reveal } from './Reveal';
import { RollingText } from './RollingText';
import { useMobileScrollActive } from '../hooks/useMobileScrollActive';
import { handleSpotlightLeave, handleSpotlightMove } from '../utils/cursorSpotlight';
import { useLanguage } from '../i18n/LanguageContext';
import { INSTAGRAM_URL, LINKEDIN_URL } from '../data/portfolioData';

export function ContactSection() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hasValidationError, setHasValidationError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusedWithin, setIsFocusedWithin] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setIsFinePointer(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const { ref: socialRowRef } = useMobileScrollActive<HTMLDivElement>({
    mode: 'pulse',
    delayMs: 120,
    pulseMs: 1000,
  });
  const { ref: formCardRef, isActive: isMobileFormEngaged } = useMobileScrollActive<HTMLDivElement>({
    mode: 'once',
    delayMs: 140,
  });
  const { ref: submitBtnRef } = useMobileScrollActive<HTMLButtonElement>({
    mode: 'pulse',
    delayMs: 360,
    pulseMs: 1100,
  });

  const isEngaged = (isFinePointer && isHovered) || isFocusedWithin || isMobileFormEngaged;

  const handleCardBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsFocusedWithin(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !project.trim()) {
      setHasValidationError(true);
      return;
    }
    setHasValidationError(false);
    setSubmitted(true);
  };

  const socialLinks = [
    {
      key: 'linkedin',
      name: 'LinkedIn',
      href: LINKEDIN_URL,
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    },
    {
      key: 'instagram',
      name: 'Instagram',
      href: INSTAGRAM_URL,
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none" strokeWidth="2" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      key: 'email',
      name: t.contact.socialEmailLabel,
      href: '#contact-name',
      isAnchor: true,
      icon: <Mail className="h-4 w-4" strokeWidth={2} aria-hidden="true" />,
    },
  ];

  return (
    <section
      id="contact"
      className="relative w-full md:bg-[radial-gradient(ellipse_54%_52%_at_18%_82%,rgba(158,27,30,0.085)_0%,rgba(8,8,8,0)_76%)]"
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 py-14 md:py-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">
          {/* Coluna Esquerda: Narrativa em camadas para decisão de contato */}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-8">
            <div className="flex flex-col gap-5">
              <Reveal className="flex flex-col gap-3">
                <span className="text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]">
                  {t.contact.kicker}
                </span>
                <h2 className="type-display-lg text-[#f2f2f2]">
                  {t.contact.headline}
                </h2>
              </Reveal>

              <Reveal delay={0.05}>
                <p className="max-w-[520px] text-[16px] md:text-[18px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1]">
                  {t.contact.intro}
                </p>
              </Reveal>

              {/* Chunking dos cenários de conversa: grid interativo no mobile e desktop */}
              <ul className="grid max-w-[540px] grid-cols-2 gap-2.5 md:gap-3 text-[13px] md:text-[14px] leading-[1.4] md:leading-[1.48] text-[#d4d4d4]">
                {t.contact.scenarios.map((scenario, idx) => (
                  <li
                    key={idx}
                    onMouseMove={handleSpotlightMove}
                    onMouseLeave={handleSpotlightLeave}
                    className="group/item desktop-spotlight-surface min-w-0 rounded-xl border border-[#222222] bg-[#111111] p-3.5 md:p-4 md:transition-[transform,border-color,background-color] md:duration-300 md:hover:-translate-y-0.5 md:hover:border-[#422325] md:hover:bg-[#151212]"
                  >
                    <Reveal delay={0.06 + idx * 0.04} className="relative z-10 flex min-w-0 flex-col gap-1.5">
                      <span className="text-[11px] font-semibold tabular-nums tracking-[0.06em] text-[#9e1b1e] md:text-[#666666] md:transition-colors md:duration-300 md:group-hover/item:text-[#9e1b1e]">
                        0{idx + 1}
                      </span>
                      <span className="min-w-0 break-words md:transition-colors md:duration-300 md:group-hover/item:text-[#f2f2f2]">
                        {scenario}
                      </span>
                    </Reveal>
                  </li>
                ))}
              </ul>

              <Reveal delay={0.14}>
                <p className="max-w-[520px] text-[16px] font-medium leading-[1.55] tracking-[-0.015em] text-[#f2f2f2] max-md:border-l-2 max-md:border-[#9e1b1e]/75 max-md:pl-3.5 md:border-t md:border-[#242424] md:pt-4">
                  {t.contact.closing}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.16}>
              <div ref={socialRowRef} className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.key}
                    href={social.href}
                    target={social.isAnchor ? undefined : '_blank'}
                    rel={social.isAnchor ? undefined : 'noopener noreferrer'}
                    aria-label={social.name}
                    className="btn-interactive inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#111111] text-[#f2f2f2]"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Coluna Direita: Formulário editorial (escuro em repouso -> off-white quente #F1EFE9 no hover/foco) */}
          <Reveal delay={0.1} className="relative min-w-0 flex-1">
            <div
              aria-hidden="true"
              className={`pointer-events-none hidden md:block absolute -inset-6 -z-10 rounded-3xl transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isEngaged ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(158, 27, 30, 0.2) 0%, rgba(8, 8, 8, 0) 72%)',
              }}
            />
            <div
              ref={formCardRef}
              onMouseEnter={() => {
                if (isFinePointer) setIsHovered(true);
              }}
              onMouseLeave={() => setIsHovered(false)}
              onFocus={() => setIsFocusedWithin(true)}
              onBlur={handleCardBlur}
              className={`rounded-2xl border p-6 sm:p-7 md:p-9 transition-[border-color,background-color,color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isEngaged
                  ? 'border-[#e2dfd7] bg-[#f1efe9] text-[#111111] shadow-[0_28px_60px_-24px_rgba(0,0,0,0.85)]'
                  : 'border-[#252525] bg-[#121212] text-[#f2f2f2]'
              }`}
            >
            {submitted ? (
              <div className="flex min-h-[380px] flex-col items-start justify-center gap-4">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isEngaged ? 'bg-[#111111] text-[#f1efe9]' : 'bg-[#f2f2f2] text-[#080808]'
                  }`}
                >
                  <Check className="h-5 w-5" />
                </span>
                <h3
                  className={`text-[28px] font-semibold tracking-[-0.02em] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isEngaged ? 'text-[#111111]' : 'text-[#f2f2f2]'
                  }`}
                >
                  {t.contact.successTitle}
                </h3>
                <p
                  className={`max-w-[400px] text-[16px] leading-[1.55] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isEngaged ? 'text-[#3f3f3c]' : 'text-[#a1a1a1]'
                  }`}
                >
                  {t.contact.successBodyPrefix}
                  {name}
                  {t.contact.successBodySuffix}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setHasValidationError(false);
                    setName('');
                    setEmail('');
                    setProject('');
                  }}
                  className={`btn-interactive mt-2 cursor-pointer rounded-full border px-5 py-2.5 text-[14px] font-medium ${
                    isEngaged
                      ? 'border-[#c7c2b7] text-[#111111]'
                      : 'border-[#2a2a2a] text-[#f2f2f2]'
                  }`}
                >
                  {t.contact.resetLabel}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <div className="flex flex-col gap-1 pb-1">
                  <h3
                    className={`text-[20px] font-semibold tracking-[-0.02em] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isEngaged ? 'text-[#111111]' : 'text-[#f2f2f2]'
                    }`}
                  >
                    {t.contact.formTitle}
                  </h3>
                  <p
                    className={`text-[14px] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isEngaged ? 'text-[#52524e]' : 'text-[#8e8e8e]'
                    }`}
                  >
                    {t.contact.formSubtitle}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-name"
                    className={`text-[14px] font-medium transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isEngaged ? 'text-[#3f3f3c]' : 'text-[#a1a1a1]'
                    }`}
                  >
                    {t.contact.nameLabel}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.contact.namePlaceholder}
                    required
                    className={`w-full rounded-xl border px-4 py-3.5 text-[16px] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none ${
                      isEngaged
                        ? 'border-[#d0ccc2] bg-[#faf9f5] text-[#111111] placeholder:text-[#6e6e6a] focus:border-[#111111]'
                        : 'border-[#262626] bg-[#0b0b0b] text-[#f2f2f2] placeholder:text-[#6e6e6e] focus:border-[#f2f2f2]'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-email"
                    className={`text-[14px] font-medium transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isEngaged ? 'text-[#3f3f3c]' : 'text-[#a1a1a1]'
                    }`}
                  >
                    {t.contact.emailLabel}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.contact.emailPlaceholder}
                    required
                    className={`w-full rounded-xl border px-4 py-3.5 text-[16px] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none ${
                      isEngaged
                        ? 'border-[#d0ccc2] bg-[#faf9f5] text-[#111111] placeholder:text-[#6e6e6a] focus:border-[#111111]'
                        : 'border-[#262626] bg-[#0b0b0b] text-[#f2f2f2] placeholder:text-[#6e6e6e] focus:border-[#f2f2f2]'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-project"
                    className={`text-[14px] font-medium transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isEngaged ? 'text-[#3f3f3c]' : 'text-[#a1a1a1]'
                    }`}
                  >
                    {t.contact.projectLabel}
                  </label>
                  <textarea
                    id="contact-project"
                    rows={4}
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder={t.contact.projectPlaceholder}
                    required
                    className={`w-full resize-none rounded-xl border px-4 py-3.5 text-[16px] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none ${
                      isEngaged
                        ? 'border-[#d0ccc2] bg-[#faf9f5] text-[#111111] placeholder:text-[#6e6e6a] focus:border-[#111111]'
                        : 'border-[#262626] bg-[#0b0b0b] text-[#f2f2f2] placeholder:text-[#6e6e6e] focus:border-[#f2f2f2]'
                    }`}
                  />
                </div>

                {hasValidationError && (
                  <p
                    role="alert"
                    className={`text-[14px] font-medium transition-colors duration-300 ${
                      isEngaged ? 'text-[#991b1b]' : 'text-[#fca5a5]'
                    }`}
                  >
                    {t.contact.errorRequired}
                  </p>
                )}

                <button
                  ref={submitBtnRef}
                  type="submit"
                  className={`btn-interactive group mt-1 inline-flex w-full cursor-pointer items-center justify-center rounded-xl py-3.5 text-[16px] font-semibold tracking-[-0.02em] active:scale-[0.99] ${
                    isEngaged
                      ? 'bg-[#111111] text-[#f1efe9]'
                      : 'bg-[#f2f2f2] text-[#080808]'
                  }`}
                >
                  <RollingText text={t.contact.submitLabel} />
                </button>
              </form>
            )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
