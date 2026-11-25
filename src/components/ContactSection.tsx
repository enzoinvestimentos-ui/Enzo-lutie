import { useEffect, useState, type FocusEvent, type FormEvent } from 'react';
import { Check, Mail } from 'lucide-react';
import { Reveal } from './Reveal';
import { RollingText } from './RollingText';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
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

  const isEngaged = (isFinePointer && isHovered) || isFocusedWithin;

  const handleCardBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsFocusedWithin(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !project.trim()) {
      setError('Por favor, preencha todos os campos antes de enviar.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/',
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/',
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none" strokeWidth="2" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: 'E-mail',
      href: '#contact-name',
      isAnchor: true,
      icon: <Mail className="h-4 w-4" strokeWidth={2} aria-hidden="true" />,
    },
  ];

  return (
    <section id="contact" className="mx-auto w-full max-w-[1180px] px-6 py-14 md:py-24">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">
        {/* Coluna Esquerda: Narrativa em camadas para decisão de contato */}
        <div className="flex flex-1 flex-col justify-between gap-8">
          <div className="flex flex-col gap-5">
            <Reveal className="flex flex-col gap-3">
              <span className="text-[13px] font-medium tracking-[0.02em] text-[#8e8e8e]">
                Próximo passo
              </span>
              <h2 className="type-display-lg text-[#f2f2f2]">
                Vamos entender o que seu negócio precisa.
              </h2>
            </Reveal>

            <Reveal delay={0.05}>
              <p className="max-w-[520px] text-[16px] md:text-[18px] leading-[1.55] tracking-[-0.015em] text-[#a1a1a1]">
                Nem sempre o caminho está claro desde o início. O primeiro passo é entender o
                cenário para descobrir o que precisa mudar e quais frentes fazem sentido:
              </p>
            </Reveal>

            {/* Chunking dos cenários de conversa */}
            <ul className="flex max-w-[500px] flex-col divide-y divide-[#252525] border-y border-[#252525] text-[15px] leading-[1.5] text-[#d4d4d4]">
              <li className="py-3">
                <Reveal delay={0.06}>Apresentação de serviços e fortalecimento da presença digital</Reveal>
              </li>
              <li className="py-3">
                <Reveal delay={0.1}>Organização de processo comercial e estruturação de CRM</Reveal>
              </li>
              <li className="py-3">
                <Reveal delay={0.14}>Redução de tarefas manuais e gargalos na operação</Reveal>
              </li>
              <li className="py-3">
                <Reveal delay={0.18}>Estrutura digital alinhada ao momento atual da empresa</Reveal>
              </li>
            </ul>

            <Reveal delay={0.14}>
              <p className="max-w-[520px] text-[16px] font-medium leading-[1.55] tracking-[-0.015em] text-[#f2f2f2]">
                Se existe algo que precisa ser compreendido, organizado ou desenvolvido, podemos
                começar por uma conversa.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.16}>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
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
        <Reveal delay={0.1} className="flex-1">
          <div
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
                  Conversa iniciada.
                </h3>
                <p
                  className={`max-w-[400px] text-[16px] leading-[1.55] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isEngaged ? 'text-[#3f3f3c]' : 'text-[#a1a1a1]'
                  }`}
                >
                  Obrigado, {name}. Suas informações foram registradas para entendermos o cenário e
                  os próximos passos da sua empresa.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
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
                  Enviar nova mensagem
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
                    Envie uma mensagem
                  </h3>
                  <p
                    className={`text-[14px] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isEngaged ? 'text-[#52524e]' : 'text-[#8e8e8e]'
                    }`}
                  >
                    Compartilhe o momento da empresa para iniciarmos a conversa.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-name"
                    className={`text-[14px] font-medium transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isEngaged ? 'text-[#3f3f3c]' : 'text-[#a1a1a1]'
                    }`}
                  >
                    Nome
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
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
                    E-mail
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@empresa.com.br"
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
                    Cenário ou projeto
                  </label>
                  <textarea
                    id="contact-project"
                    rows={4}
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder="Conte sobre o momento da empresa, desafios ou o que precisa ser estruturado..."
                    required
                    className={`w-full resize-none rounded-xl border px-4 py-3.5 text-[16px] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none ${
                      isEngaged
                        ? 'border-[#d0ccc2] bg-[#faf9f5] text-[#111111] placeholder:text-[#6e6e6a] focus:border-[#111111]'
                        : 'border-[#262626] bg-[#0b0b0b] text-[#f2f2f2] placeholder:text-[#6e6e6e] focus:border-[#f2f2f2]'
                    }`}
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className={`text-[14px] font-medium transition-colors duration-300 ${
                      isEngaged ? 'text-[#991b1b]' : 'text-[#fca5a5]'
                    }`}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className={`btn-interactive group mt-1 inline-flex w-full cursor-pointer items-center justify-center rounded-xl py-3.5 text-[16px] font-semibold tracking-[-0.02em] active:scale-[0.99] ${
                    isEngaged
                      ? 'bg-[#111111] text-[#f1efe9]'
                      : 'bg-[#f2f2f2] text-[#080808]'
                  }`}
                >
                  <RollingText text="Iniciar uma conversa" />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
