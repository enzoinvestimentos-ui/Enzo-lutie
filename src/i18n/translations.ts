import type {
  ApproachStep,
  PracticeHighlightItem,
  ProjectDecisionPillar,
  ProjectItem,
  ServiceItem,
  ValuePerspectiveItem,
} from '../data/portfolioData';
import type { VideoTestimonialItem } from '../data/socialProofData';

export type Language = 'pt' | 'en';

export interface SiteTranslations {
  seo: {
    htmlLang: string;
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  intro: {
    subtitle: string;
  };
  nav: {
    brand: string;
    mainAria: string;
    mobileAria: string;
    openMenuAria: string;
    closeMenuAria: string;
    languageSwitcherAria: string;
    switchToPtAria: string;
    switchToEnAria: string;
    items: {
      home: string;
      diagnosis: string;
      practice: string;
      projects: string;
      about: string;
    };
    cta: string;
  };
  hero: {
    kicker: string;
    headline: string;
    leadPrimary: string;
    leadThesis: string;
    ctaPrimary: string;
    ctaSecondary: string;
    portraitAria: string;
    portraitMobileHint: string;
    portraitDesktopHint: string;
    portraitFrontAlt: string;
    portraitBackAlt: string;
    portraitFallback: string;
    bottomKeywords: string;
    bottomPartners: string;
    bottomYear: string;
  };
  diagnosis: {
    kicker: string;
    headline: string;
    intro: string;
    rows: [
      { indexLabel: string; title: string; description: string },
      { indexLabel: string; title: string; description: string },
      { indexLabel: string; title: string; description: string },
    ];
    closing: string;
    cta: string;
  };
  quote: {
    sectionAria: string;
    kicker: string;
    manifesto: string;
    subcopy: string;
    approachKicker: string;
    approachTitle: string;
    mobileSwipeHint: string;
    steps: ApproachStep[];
  };
  services: {
    kicker: string;
    title: string;
    subtitle: string;
    items: ServiceItem[];
  };
  projects: {
    kicker: string;
    title: string;
    cta: string;
    introBold: string;
    introSub: string;
    viewStudy: string;
    pillars: ProjectDecisionPillar[];
    items: ProjectItem[];
    workPage: {
      kicker: string;
      title: string;
      subtitle: string;
    };
    workDetail: {
      backLabel: string;
      trackLabel: string;
      scopeLabel: string;
      headings: {
        contexto: string;
        desafio: string;
        direcionamento: string;
        solucao: string;
        impacto: string;
      };
      moreProjects: string;
    };
  };
  socialProof: {
    kicker: string;
    title: string;
    subtitle: string;
    video: VideoTestimonialItem;
    placeholderBadge: string;
    watchLabel: string;
    placeholderLabel: string;
    inlineMissingHint: string;
    playAriaPrefix: string;
    infoAriaPrefix: string;
    closeModalAria: string;
  };
  testimonials: {
    kicker: string;
    title: string;
    subtitle: string;
    mobileCue: string;
    cardKicker: string;
    cardAriaSuffix: string;
    marks: {
      site: string;
      crm: string;
      automation: string;
      strategy: string;
    };
    items: ValuePerspectiveItem[];
  };
  thoughts: {
    kicker: string;
    title: string;
    leadPrimary: string;
    leadSecondary: string;
    synthesisTag: string;
    synthesisTitle: string;
    synthesisBody: string;
    synthesisCta: string;
    articles: PracticeHighlightItem[];
    blogPage: {
      kicker: string;
      title: string;
      subtitle: string;
    };
    blogDetail: {
      backLabel: string;
    };
  };
  contact: {
    kicker: string;
    headline: string;
    intro: string;
    scenarios: [string, string, string, string];
    closing: string;
    socialEmailLabel: string;
    formTitle: string;
    formSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    projectLabel: string;
    projectPlaceholder: string;
    errorRequired: string;
    submitLabel: string;
    successTitle: string;
    successBodyPrefix: string;
    successBodySuffix: string;
    resetLabel: string;
  };
  footer: {
    headline: string;
    subheadline: string;
    navTitle: string;
    navItems: {
      home: string;
      diagnosis: string;
      practice: string;
      projects: string;
      contact: string;
    };
    channelsTitle: string;
    emailChannel: string;
    signatureTitle: string;
    signatureSubtitle: string;
    copyright: string;
  };
}

export const TRANSLATIONS: Record<Language, SiteTranslations> = {
  pt: {
    seo: {
      htmlLang: 'pt-BR',
      title: 'Estratégia de negócios, processos e tecnologia',
      description:
        'Ajudo empresas a identificar oportunidades, superar gargalos e transformar necessidades de negócio em soluções que conectam estratégia comercial, processos e tecnologia.',
      ogTitle: 'Estratégia de negócios, processos e tecnologia',
      ogDescription:
        'Negócios primeiro. Tecnologia com propósito. Estratégia, processos e soluções digitais.',
    },
    intro: {
      subtitle: 'Estratégia · Processos · Tecnologia',
    },
    nav: {
      brand: 'Enzo Lutiê',
      mainAria: 'Navegação principal',
      mobileAria: 'Navegação móvel',
      openMenuAria: 'Abrir menu de navegação',
      closeMenuAria: 'Fechar menu de navegação',
      languageSwitcherAria: 'Seletor de idioma',
      switchToPtAria: 'Alternar idioma para Português',
      switchToEnAria: 'Alternar idioma para Inglês',
      items: {
        home: 'Início',
        diagnosis: 'Diagnóstico',
        practice: 'Atuação',
        projects: 'Projetos',
        about: 'Sobre',
      },
      cta: 'Vamos conversar',
    },
    hero: {
      kicker: 'Enzo Lutiê · Negócios, estratégia comercial e tecnologia',
      headline: 'Estratégia de negócios, processos e tecnologia.',
      leadPrimary:
        'Ajudo empresas a identificar oportunidades, superar gargalos e conectar estratégia comercial, operação e soluções digitais para melhorar resultados.',
      leadThesis: 'A tecnologia entra como parte da solução, não como ponto de partida.',
      ctaPrimary: 'Vamos conversar',
      ctaSecondary: 'Conhecer projetos',
      portraitAria: 'Alternar cartão do retrato',
      portraitMobileHint: 'Toque ou role para girar',
      portraitDesktopHint: 'Clique para girar',
      portraitFrontAlt: 'Retrato editorial em preto e branco',
      portraitBackAlt: 'Retrato editorial em fundo vermelho',
      portraitFallback: 'Estratégia & Tecnologia',
      bottomKeywords: 'Estratégia · Processos · Tecnologia',
      bottomPartners: 'Lumo · Krios Creative',
      bottomYear: '©2026',
    },
    diagnosis: {
      kicker: 'Diagnóstico',
      headline: 'O problema, muitas vezes, está antes da tecnologia.',
      intro:
        'É comum empresas investirem em sites, sistemas e automações sem resolver o que motivou o investimento:',
      rows: [
        {
          indexLabel: '01',
          title: 'Novo CRM',
          description: 'Não organiza, por si só, um processo comercial desestruturado.',
        },
        {
          indexLabel: '02',
          title: 'Novo site',
          description: 'Não resolve uma comunicação que não deixa claro o valor da empresa.',
        },
        {
          indexLabel: '03',
          title: 'Automação',
          description: 'Não corrige um processo que nunca foi bem definido.',
        },
      ],
      closing:
        'Por isso, minha primeira preocupação é entender a operação, os objetivos e a experiência dos clientes para direcionar soluções que realmente evoluem o negócio.',
      cta: 'Vamos conversar',
    },
    quote: {
      sectionAria: 'Abordagem e Critério',
      kicker: 'Critério de Trabalho',
      manifesto:
        'Não acredito em aplicar ferramentas ou metodologias simplesmente porque estão em alta.',
      subcopy:
        'Cada empresa possui uma realidade, estrutura e momento próprios. Antes de definir o que fazer, compreendo o contexto para identificar onde uma mudança gera valor real.',
      approachKicker: 'Método em quatro etapas',
      approachTitle: 'Como transformo diagnóstico em execução',
      mobileSwipeHint: 'Deslize as etapas →',
      steps: [
        {
          number: '01',
          title: 'Entendimento do negócio',
          description:
            'Conhecer a empresa, seus objetivos, operação, clientes e os desafios que fazem parte da rotina.',
        },
        {
          number: '02',
          title: 'Diagnóstico de gargalos',
          description:
            'Identificar oportunidades comerciais, processos ineficientes e pontos de desconexão entre estratégia e execução.',
        },
        {
          number: '03',
          title: 'Direcionamento integrado',
          description:
            'Estruturar um caminho coerente conectando estratégia, comunicação, processos e tecnologia.',
        },
        {
          number: '04',
          title: 'Coordenação e entrega',
          description:
            'Transformar o direcionamento em soluções concretas, conectando as competências necessárias para tirar as ideias do papel.',
        },
      ],
    },
    services: {
      kicker: 'Frentes integradas',
      title: 'Áreas de Atuação',
      subtitle:
        'Áreas que costumam ser tratadas de forma isolada, mas que precisam operar juntas para gerar resultado.',
      items: [
        {
          id: 'comercial',
          title: 'Estratégia Comercial',
          description:
            'Mapeamento da jornada do cliente e estruturação do processo de vendas para ampliar aquisição e oportunidades de conversão.',
          capabilities: ['Jornada do cliente', 'Processos de venda', 'Conversão'],
        },
        {
          id: 'processos',
          title: 'Processos e Operação',
          description:
            'Análise e organização de fluxos de trabalho para reduzir gargalos e integrar atividades entre diferentes áreas da empresa.',
          capabilities: ['Fluxos de trabalho', 'Gargalos', 'Integração'],
        },
        {
          id: 'posicionamento',
          title: 'Posicionamento e Experiência Digital',
          description:
            'Direcionamento de experiências digitais que fortalecem o posicionamento, comunicam valor com clareza e facilitam a relação com clientes.',
          capabilities: ['Posicionamento', 'Comunicação de ofertas', 'Relacionamento'],
        },
        {
          id: 'tecnologia',
          title: 'Tecnologia e Implementação',
          description:
            'Desenvolvimento de sites, sistemas, CRM, integrações e automações sempre orientados às necessidades e objetivos reais da operação.',
          capabilities: ['Sites e sistemas', 'CRM', 'Integrações e automações'],
        },
      ],
    },
    projects: {
      kicker: 'Direcionamento aplicado',
      title: 'Projetos',
      cta: 'Explorar projetos selecionados',
      introBold: 'Uma boa ideia só gera valor quando consegue se transformar em algo concreto.',
      introSub:
        'Cada projeto parte de um desafio real e apresenta o raciocínio por trás das decisões em cinco camadas:',
      viewStudy: 'Ver estudo',
      pillars: [
        {
          label: 'Contexto',
          description: 'a realidade da empresa e sua necessidade.',
        },
        {
          label: 'Desafio',
          description: 'o problema ou oportunidade identificada.',
        },
        {
          label: 'Direcionamento',
          description: 'as decisões e estratégias adotadas.',
        },
        {
          label: 'Solução',
          description: 'o que foi planejado, desenvolvido ou implementado.',
        },
        {
          label: 'Impacto',
          description: 'os resultados alcançados, sempre que houver dados disponíveis.',
        },
      ],
      items: [
        {
          slug: 'site-posicionamento-digital',
          title: 'Posicionamento e Presença Digital',
          subtitle: 'Comunicação de valor, clareza de oferta e aquisição',
          category: 'Sites e Experiência Digital',
          scope: 'Posicionamento & Web',
          image: '/src/assets/images/project_verbena_1795526752076.jpg',
          featured: true,
          summary:
            'Estruturação de presença digital orientada a clareza de posicionamento, comunicação objetiva de ofertas e geração qualificada de oportunidades comerciais.',
          decisionDetails: {
            contexto:
              'Empresas que já entregam bom serviço na operação, mas percebem que sua presença digital não traduz com clareza o valor da oferta para novos clientes.',
            desafio:
              'Um site novo não resolve uma comunicação que não deixa claro o valor da empresa. O desafio está em alinhar discurso comercial, jornada do visitante e hierarquia visual antes da construção.',
            direcionamento:
              'Organizar a narrativa a partir das dúvidas reais dos clientes, definindo proposta de valor, estrutura de páginas e pontos objetivos de conversão.',
            solucao:
              'Direcionamento e desenvolvimento de site institucional orientado a posicionamento, comunicação clara das soluções e integração direta com o canal comercial.',
            impacto:
              'Clareza imediata na apresentação da empresa e redução de atrito entre o primeiro contato digital e o início da conversa comercial, conforme acompanhamento disponível em cada operação.',
          },
        },
        {
          slug: 'estruturacao-crm-comercial',
          title: 'CRM e Processo Comercial',
          subtitle: 'Organização do funil, visibilidade e cadência de vendas',
          category: 'Estratégia Comercial & CRM',
          scope: 'Comercial & Processos',
          image: '/src/assets/images/project_pulsegrid_1795526752150.jpg',
          featured: true,
          summary:
            'Desenho e implementação de processo comercial integrado a CRM, garantindo rastreabilidade de oportunidades e ritmo consistente de atendimento.',
          decisionDetails: {
            contexto:
              'Operações comerciais com crescimento de demanda que dependem de controles dispersos, dificultando o acompanhamento de propostas e histórico de clientes.',
            desafio:
              'Um novo CRM não organiza, por si só, um processo comercial desestruturado. Era necessário definir etapas, critérios de passagem e responsabilidades antes da ferramenta.',
            direcionamento:
              'Mapear a jornada do cliente do primeiro contato ao fechamento, estabelecendo definições claras de cada etapa e indicadores de acompanhamento.',
            solucao:
              'Estruturação de fluxo comercial e configuração de CRM alinhada à rotina real da equipe, conectando entrada de contatos, acompanhamento e histórico.',
            impacto:
              'Maior visibilidade sobre oportunidades em andamento, previsibilidade no acompanhamento comercial e base organizada para decisões de crescimento.',
          },
        },
        {
          slug: 'automacoes-fluxos-operacionais',
          title: 'Automações e Fluxos Operacionais',
          subtitle: 'Eliminação de gargalos manuais e integração entre áreas',
          category: 'Processos & Automações',
          scope: 'Operação & Integrações',
          image: '/src/assets/images/project_solis_1795526752655.jpg',
          featured: true,
          summary:
            'Revisão de rotinas operacionais e implementação de integrações e automações para reduzir retrabalho manual entre atendimento, comercial e entrega.',
          decisionDetails: {
            contexto:
              'Equipes sobrecarregadas com repasses manuais de informação entre formulários, planilhas, atendimento e controles internos.',
            desafio:
              'Uma automação não corrige um processo que nunca foi bem definido. Automatizar sem critério apenas acelera inconsistências já existentes.',
            direcionamento:
              'Diagnosticar os pontos de gargalo e padronizar o fluxo de trabalho entre as áreas envolvidas antes de escolher quais integrações seriam construídas.',
            solucao:
              'Desenho de fluxo integrado e implantação de automações conectando captação, registro de dados, notificações e rotinas operacionais.',
            impacto:
              'Operação mais fluida, menor dependência de tarefas repetitivas e mais tempo da equipe dedicado a atividades estratégicas e de relacionamento.',
          },
        },
        {
          slug: 'arquitetura-sistemas-experiencias',
          title: 'Sistemas e Experiência Integrada',
          subtitle: 'Conexão entre necessidade de negócio e execução técnica',
          category: 'Sistemas & Direção Criativa',
          scope: 'Negócios & Tecnologia',
          image: '/src/assets/images/project_monolith_1795526752876.jpg',
          featured: true,
          summary:
            'Condução de projetos digitais multidisciplinares unindo entendimento de negócio, direção criativa e desenvolvimento técnico sob medida.',
          decisionDetails: {
            contexto:
              'Iniciativas que exigem coordenar estratégia de negócio, identidade visual, experiência de uso e implementação técnica em um mesmo projeto.',
            desafio:
              'Evitar a desconexão comum entre quem planeja a estratégia, quem desenha a interface e quem desenvolve o sistema final.',
            direcionamento:
              'Atuar como ponte entre a realidade da empresa e a execução técnica — conduzindo projetos na Lumo com visão técnica e na Krios Creative com direção criativa e posicionamento.',
            solucao:
              'Coordenação de ponta a ponta: levantamento de requisitos reais, arquitetura da solução, alinhamento visual e entrega estruturada.',
            impacto:
              'Soluções digitais coerentes com o momento da empresa, prontas para sustentar processos comerciais e operacionais sem complexidade desnecessária.',
          },
        },
      ],
      workPage: {
        kicker: 'Direcionamento aplicado',
        title: 'Projetos Selecionados',
        subtitle:
          'Projetos que conectam necessidades reais de negócio a soluções digitais, estruturados com foco em raciocínio estratégico e execução consistente.',
      },
      workDetail: {
        backLabel: 'Todos os projetos',
        trackLabel: 'Frente',
        scopeLabel: 'Escopo',
        headings: {
          contexto: 'Contexto',
          desafio: 'Desafio',
          direcionamento: 'Direcionamento',
          solucao: 'Solução',
          impacto: 'Impacto',
        },
        moreProjects: 'Outros Projetos',
      },
    },
    socialProof: {
      kicker: 'O que dizem sobre o trabalho',
      title: 'A experiência também fala.',
      subtitle: 'Resultados, relações e experiências compartilhadas por quem já trabalhou comigo.',
      video: {
        id: 'video-principal',
        label: 'Depoimento em vídeo · Principal',
        orientation: 'portrait',
        authorName: 'Depoimento Dra. Bruna',
        authorRole: 'Médica · Clínica especializada em odontologia',
        context: 'Presença digital e estruturação de CRM',
        durationHint: 'Formato 9:16 · Depoimento em vídeo',
        videoUrl: 'https://youtube.com/shorts/lrhIuCBxF9g?feature=share',
        posterUrl: 'https://i.ytimg.com/vi/lrhIuCBxF9g/hqdefault.jpg',
      },
      placeholderBadge: 'Espaço reservado',
      watchLabel: 'Assistir depoimento',
      placeholderLabel: 'Depoimento em vídeo',
      inlineMissingHint: 'Adicione o arquivo ou link do vídeo em src/data/socialProofData.ts.',
      playAriaPrefix: 'Reproduzir',
      infoAriaPrefix: 'Visualizar informações do',
      closeModalAria: 'Fechar visualização',
    },
    testimonials: {
      kicker: 'Critério de decisão',
      title: 'O valor de cada solução',
      subtitle:
        'É essa perspectiva que orienta minhas decisões e a forma como participo de cada projeto.',
      mobileCue: 'Toque para virar · Deslize →',
      cardKicker: 'Perspectiva de valor',
      cardAriaSuffix: 'Alternar cartão para visualizar síntese.',
      marks: {
        site: 'Site',
        crm: 'CRM',
        automation: 'Fluxos',
        strategy: 'Negócios',
      },
      items: [
        {
          id: 'v1',
          statement:
            'Um site pode ser muito mais do que uma presença digital: pode ser uma ferramenta de posicionamento, comunicação e aquisição de clientes.',
          pillarTitle: 'Site e Posicionamento',
          pillarSubtitle: 'Comunicação clara e aquisição de clientes',
          iconId: 'site',
        },
        {
          id: 'v2',
          statement:
            'Um CRM pode ser muito mais do que uma lista de contatos: pode estruturar o relacionamento comercial e dar visibilidade às oportunidades.',
          pillarTitle: 'CRM e Processo Comercial',
          pillarSubtitle: 'Relacionamento estruturado e visibilidade',
          iconId: 'crm',
        },
        {
          id: 'v3',
          statement:
            'Uma automação pode ser muito mais do que eliminar tarefas manuais: pode tornar uma operação mais eficiente e liberar tempo para atividades que realmente importam.',
          pillarTitle: 'Automação com Critério',
          pillarSubtitle: 'Eficiência operacional e foco no essencial',
          iconId: 'automation',
        },
        {
          id: 'v4',
          statement:
            'O valor de uma solução não está apenas naquilo que ela faz, mas na maneira como contribui para os objetivos da empresa.',
          pillarTitle: 'Negócios em Primeiro Lugar',
          pillarSubtitle: 'Decisões guiadas pelo contexto real',
          iconId: 'strategy',
        },
      ],
    },
    thoughts: {
      kicker: 'Sobre mim',
      title: 'Sobre e Parcerias',
      leadPrimary:
        'Atuo na interseção entre negócios, desenvolvimento comercial, direcionamento de projetos e construção de soluções digitais.',
      leadSecondary:
        'Compreendo necessidades empresariais e conecto diferentes competências — da execução técnica à direção criativa — para transformar problemas em projetos bem direcionados.',
      synthesisTag: 'Visão de Negócio',
      synthesisTitle: 'Entender como a empresa gera valor antes de escolher a ferramenta.',
      synthesisBody:
        'Boas soluções não dependem apenas de conhecimento técnico, mas da capacidade de compreender operação, clientes e decisões para fazer as escolhas certas.',
      synthesisCta: 'Conhecer visão completa',
      articles: [
        {
          slug: 'conducao-de-projetos-na-lumo',
          tag: 'Atuação Técnica e Comercial',
          title: 'Lumo: aproximando necessidades do negócio da execução técnica',
          excerpt:
            'Na Lumo, participo da condução de projetos envolvendo desenvolvimento de sites, sistemas, CRM e automações, aproximando as necessidades dos clientes da execução técnica.',
          image: '/src/assets/images/blog_editorial_1_1795526753222.jpg',
          featuredOnHome: true,
          sections: [
            {
              heading: 'Negócios e execução técnica caminhando juntos',
              paragraphs: [
                'Sou profissional da área de negócios e tecnologia, com atuação no desenvolvimento comercial, direcionamento de projetos e construção de soluções digitais.',
                'Meu trabalho envolve compreender necessidades empresariais, identificar oportunidades e conectar diferentes competências para transformar problemas em projetos bem direcionados.',
                'Na Lumo, participo da condução de projetos envolvendo desenvolvimento de sites, sistemas, CRM e automações, aproximando as necessidades dos clientes da execução técnica.',
              ],
            },
            {
              heading: 'Compreender antes de implementar',
              paragraphs: [
                'Tenho interesse especial em entender como as empresas funcionam: como conquistam clientes, organizam suas operações, tomam decisões e encontram oportunidades de crescimento.',
                'Acredito que boas soluções não dependem apenas de conhecimento técnico. Dependem, principalmente, da capacidade de compreender o contexto e fazer as escolhas certas.',
              ],
            },
          ],
        },
        {
          slug: 'parceria-na-krios-creative',
          tag: 'Posicionamento e Direção Criativa',
          title: 'Krios Creative: comunicação, identidade visual e experiência digital',
          excerpt:
            'Também sou parceiro na Krios Creative, onde a comunicação, a identidade visual e a direção criativa complementam minha visão sobre posicionamento e experiência digital.',
          image: '/src/assets/images/blog_editorial_2_1795526752783.jpg',
          featuredOnHome: true,
          sections: [
            {
              heading: 'Quando estratégia e estética se encontram',
              paragraphs: [
                'Também sou parceiro na Krios Creative, onde a comunicação, a identidade visual e a direção criativa complementam minha visão sobre posicionamento e experiência digital.',
                'Uma estratégia comercial bem estruturada ganha força quando é acompanhada por uma comunicação visual consistente e uma experiência digital que facilita a relação com os clientes.',
              ],
            },
            {
              heading: 'Clareza como base de decisão',
              paragraphs: [
                'O valor de uma solução não está apenas naquilo que ela faz, mas na maneira como contribui para os objetivos da empresa. É essa perspectiva que orienta minhas decisões e a forma como participo de cada projeto.',
              ],
            },
          ],
        },
        {
          slug: 'o-problema-antes-da-tecnologia',
          tag: 'Visão de Negócio',
          title: 'Por que o problema muitas vezes está antes da tecnologia',
          excerpt:
            'Um novo CRM não organiza um processo comercial desestruturado. Um site novo não resolve uma comunicação sem clareza de valor.',
          image: '/src/assets/images/project_verbena_1795526752076.jpg',
          featuredOnHome: false,
          sections: [
            {
              heading: 'Entender a empresa antes de escolher a ferramenta',
              paragraphs: [
                'É comum encontrar empresas que investem em sites, ferramentas, sistemas e automações sem necessariamente resolver aquilo que motivou o investimento.',
                'Um novo CRM não organiza, por si só, um processo comercial desestruturado. Um site novo não resolve uma comunicação que não deixa claro o valor da empresa. Uma automação não corrige um processo que nunca foi bem definido.',
                'O problema, muitas vezes, está antes da tecnologia.',
                'Por isso, minha primeira preocupação é entender o negócio: sua operação, seus objetivos, a experiência dos clientes e a maneira como as diferentes áreas se conectam.',
                'É a partir dessa visão que identifico oportunidades e direciono soluções que realmente contribuem para a evolução da empresa.',
              ],
            },
          ],
        },
      ],
      blogPage: {
        kicker: 'Sobre mim',
        title: 'Sobre e Visão de Trabalho',
        subtitle:
          'Atuação entre negócios, desenvolvimento comercial, direcionamento de projetos e construção de soluções digitais em parceria com a Lumo e a Krios Creative.',
      },
      blogDetail: {
        backLabel: 'Voltar para Sobre',
      },
    },
    contact: {
      kicker: 'Próximo passo',
      headline: 'Vamos entender o que seu negócio precisa.',
      intro:
        'Nem sempre o caminho está claro desde o início. O primeiro passo é entender o cenário para descobrir o que precisa mudar e quais frentes fazem sentido:',
      scenarios: [
        'Apresentação de serviços e fortalecimento da presença digital',
        'Organização de processo comercial e estruturação de CRM',
        'Redução de tarefas manuais e gargalos na operação',
        'Estrutura digital alinhada ao momento atual da empresa',
      ],
      closing:
        'Se existe algo que precisa ser compreendido, organizado ou desenvolvido, podemos começar por uma conversa.',
      socialEmailLabel: 'E-mail',
      formTitle: 'Envie uma mensagem',
      formSubtitle: 'Compartilhe o momento da empresa para iniciarmos a conversa.',
      nameLabel: 'Nome',
      namePlaceholder: 'Seu nome',
      emailLabel: 'E-mail',
      emailPlaceholder: 'voce@empresa.com.br',
      projectLabel: 'Cenário ou projeto',
      projectPlaceholder:
        'Conte sobre o momento da empresa, desafios ou o que precisa ser estruturado...',
      errorRequired: 'Por favor, preencha todos os campos antes de enviar.',
      submitLabel: 'Iniciar uma conversa',
      successTitle: 'Conversa iniciada.',
      successBodyPrefix: 'Obrigado, ',
      successBodySuffix:
        '. Suas informações foram registradas para entendermos o cenário e os próximos passos da sua empresa.',
      resetLabel: 'Enviar nova mensagem',
    },
    footer: {
      headline: 'Negócios primeiro. Tecnologia com propósito.',
      subheadline: 'Estratégia, processos e soluções digitais.',
      navTitle: 'Navegação',
      navItems: {
        home: 'Início',
        diagnosis: 'Diagnóstico',
        practice: 'Atuação',
        projects: 'Projetos',
        contact: 'Contato',
      },
      channelsTitle: 'Canais',
      emailChannel: 'E-mail',
      signatureTitle: 'Enzo Lutie',
      signatureSubtitle: 'Estratégias, Processos e Soluções Digitais',
      copyright: '© 2026 — Todos os direitos reservados.',
    },
  },
  en: {
    seo: {
      htmlLang: 'en',
      title: 'Business Strategy, Processes & Technology',
      description:
        'I help companies spot opportunities, remove bottlenecks, and turn business needs into solutions that connect commercial strategy, processes, and technology.',
      ogTitle: 'Business Strategy, Processes & Technology',
      ogDescription:
        'Business first. Technology with purpose. Strategy, processes, and digital solutions.',
    },
    intro: {
      subtitle: 'Strategy · Processes · Technology',
    },
    nav: {
      brand: 'Enzo Lutiê',
      mainAria: 'Main navigation',
      mobileAria: 'Mobile navigation',
      openMenuAria: 'Open navigation menu',
      closeMenuAria: 'Close navigation menu',
      languageSwitcherAria: 'Language selector',
      switchToPtAria: 'Switch language to Portuguese',
      switchToEnAria: 'Switch language to English',
      items: {
        home: 'Home',
        diagnosis: 'Diagnosis',
        practice: 'Practice',
        projects: 'Projects',
        about: 'About',
      },
      cta: "Let's talk",
    },
    hero: {
      kicker: 'Enzo Lutiê · Business, commercial strategy & technology',
      headline: 'Business strategy, processes, and technology.',
      leadPrimary:
        'I help companies uncover opportunities, clear operational bottlenecks, and connect commercial strategy, operations, and digital solutions to drive real results.',
      leadThesis: 'Technology enters as part of the solution — never as the starting point.',
      ctaPrimary: "Let's talk",
      ctaSecondary: 'Explore projects',
      portraitAria: 'Flip portrait card',
      portraitMobileHint: 'Tap or scroll to flip',
      portraitDesktopHint: 'Click to flip',
      portraitFrontAlt: 'Black-and-white editorial portrait',
      portraitBackAlt: 'Editorial portrait on crimson backdrop',
      portraitFallback: 'Strategy & Technology',
      bottomKeywords: 'Strategy · Processes · Technology',
      bottomPartners: 'Lumo · Krios Creative',
      bottomYear: '©2026',
    },
    diagnosis: {
      kicker: 'Diagnosis',
      headline: 'More often than not, the problem sits upstream of technology.',
      intro:
        'Companies frequently invest in websites, software, and automation without resolving what prompted the investment in the first place:',
      rows: [
        {
          indexLabel: '01',
          title: 'New CRM',
          description: 'Cannot organize an unstructured sales process on its own.',
        },
        {
          indexLabel: '02',
          title: 'New website',
          description: 'Cannot fix messaging that fails to communicate the company’s value.',
        },
        {
          indexLabel: '03',
          title: 'Automation',
          description: 'Cannot repair a workflow that was never properly defined.',
        },
      ],
      closing:
        'That is why my first step is always understanding the operation, business goals, and customer experience — so every solution genuinely moves the business forward.',
      cta: "Let's talk",
    },
    quote: {
      sectionAria: 'Approach and Principles',
      kicker: 'Working Principle',
      manifesto:
        'I do not believe in adopting tools or frameworks simply because they happen to be trending.',
      subcopy:
        'Every company has its own reality, structure, and stage of growth. Before deciding what to build, I examine the context to pinpoint where change creates real value.',
      approachKicker: 'Four-step method',
      approachTitle: 'How diagnosis turns into execution',
      mobileSwipeHint: 'Swipe steps →',
      steps: [
        {
          number: '01',
          title: 'Business understanding',
          description:
            'Getting to know the company, its goals, operations, customers, and the real challenges behind day-to-day execution.',
        },
        {
          number: '02',
          title: 'Bottleneck diagnosis',
          description:
            'Spotting commercial opportunities, inefficient workflows, and points of friction between strategy and delivery.',
        },
        {
          number: '03',
          title: 'Integrated direction',
          description:
            'Mapping a coherent path that aligns strategy, messaging, processes, and technology.',
        },
        {
          number: '04',
          title: 'Coordination & delivery',
          description:
            'Turning direction into tangible solutions by connecting the capabilities required to bring ideas to life.',
        },
      ],
    },
    services: {
      kicker: 'Integrated fronts',
      title: 'Areas of Practice',
      subtitle:
        'Disciplines that are often handled in silos, yet need to operate together to produce measurable results.',
      items: [
        {
          id: 'comercial',
          title: 'Commercial Strategy',
          description:
            'Mapping the customer journey and structuring the sales pipeline to expand acquisition and conversion opportunities.',
          capabilities: ['Customer journey', 'Sales processes', 'Conversion'],
        },
        {
          id: 'processos',
          title: 'Processes & Operations',
          description:
            'Reviewing and organizing workflows to eliminate bottlenecks and connect activities across different teams.',
          capabilities: ['Workflows', 'Bottlenecks', 'Integration'],
        },
        {
          id: 'posicionamento',
          title: 'Positioning & Digital Experience',
          description:
            'Shaping digital experiences that sharpen positioning, communicate offers with clarity, and make customer interaction effortless.',
          capabilities: ['Positioning', 'Offer clarity', 'Relationships'],
        },
        {
          id: 'tecnologia',
          title: 'Technology & Implementation',
          description:
            'Developing websites, systems, CRMs, integrations, and automations grounded in the real needs and goals of the operation.',
          capabilities: ['Sites & systems', 'CRM', 'Integrations & automation'],
        },
      ],
    },
    projects: {
      kicker: 'Applied direction',
      title: 'Projects',
      cta: 'Explore selected projects',
      introBold: 'A strong idea only creates value when it becomes something concrete.',
      introSub:
        'Each project starts from a real operational challenge and breaks down the reasoning behind key decisions across five layers:',
      viewStudy: 'View study',
      pillars: [
        {
          label: 'Context',
          description: 'the company’s reality and underlying need.',
        },
        {
          label: 'Challenge',
          description: 'the problem or opportunity uncovered.',
        },
        {
          label: 'Direction',
          description: 'the strategic choices and path taken.',
        },
        {
          label: 'Solution',
          description: 'what was planned, built, or implemented.',
        },
        {
          label: 'Impact',
          description: 'the outcomes achieved whenever measurable data is available.',
        },
      ],
      items: [
        {
          slug: 'site-posicionamento-digital',
          title: 'Positioning & Digital Presence',
          subtitle: 'Value communication, offer clarity, and acquisition',
          category: 'Websites & Digital Experience',
          scope: 'Positioning & Web',
          image: '/src/assets/images/project_verbena_1795526752076.jpg',
          featured: true,
          summary:
            'Structuring a digital presence built around sharp positioning, clear offer messaging, and qualified commercial lead generation.',
          decisionDetails: {
            contexto:
              'Companies that already deliver strong service in practice, yet find that their digital presence fails to communicate the real value of their offering to new clients.',
            desafio:
              'A new website cannot fix unclear messaging. The real challenge is aligning commercial positioning, visitor flow, and visual hierarchy before writing a line of code.',
            direcionamento:
              'Restructure the narrative around real client questions, defining the value proposition, page architecture, and purposeful conversion points.',
            solucao:
              'Strategic direction and development of a company website focused on positioning, crystal-clear service presentation, and direct integration with the sales channel.',
            impacto:
              'Immediate clarity in how the business presents itself and less friction between the first digital touchpoint and the start of a commercial conversation.',
          },
        },
        {
          slug: 'estruturacao-crm-comercial',
          title: 'CRM & Commercial Process',
          subtitle: 'Pipeline structure, visibility, and sales cadence',
          category: 'Commercial Strategy & CRM',
          scope: 'Sales & Processes',
          image: '/src/assets/images/project_pulsegrid_1795526752150.jpg',
          featured: true,
          summary:
            'Designing and implementing a commercial workflow integrated with CRM, ensuring opportunity tracking and consistent follow-up cadence.',
          decisionDetails: {
            contexto:
              'Growing commercial teams handling rising demand through scattered spreadsheets and ad-hoc notes, making it hard to track proposals and client history.',
            desafio:
              'A new CRM will not organize an unstructured sales process by itself. Stages, handoff criteria, and ownership needed to be defined before configuring any software.',
            direcionamento:
              'Map the buyer journey from initial inquiry to close, establishing clear definitions for every stage and reliable tracking metrics.',
            solucao:
              'Commercial pipeline architecture and CRM setup tailored to the team’s actual routine, linking lead capture, follow-ups, and full account history.',
            impacto:
              'Clear visibility into active opportunities, predictable sales follow-through, and a structured foundation for sustainable growth decisions.',
          },
        },
        {
          slug: 'automacoes-fluxos-operacionais',
          title: 'Automation & Operational Workflows',
          subtitle: 'Removing manual bottlenecks and connecting teams',
          category: 'Processes & Automation',
          scope: 'Operations & Integrations',
          image: '/src/assets/images/project_solis_1795526752655.jpg',
          featured: true,
          summary:
            'Redesigning operational routines and implementing integrations and automations to eliminate manual rework between support, sales, and delivery.',
          decisionDetails: {
            contexto:
              'Teams bogged down by manual handoffs of data across intake forms, spreadsheets, client support, and internal trackers.',
            desafio:
              'Automation cannot repair a workflow that was never clearly defined. Automating without discipline only accelerates existing inconsistencies.',
            direcionamento:
              'Pinpoint operational bottlenecks and standardize the workflow across participating teams before deciding which integrations to build.',
            solucao:
              'End-to-end workflow design and custom automations connecting lead intake, data logging, team alerts, and operational checklists.',
            impacto:
              'Smoother day-to-day execution, far less reliance on repetitive manual work, and more team bandwidth reserved for strategy and client relationships.',
          },
        },
        {
          slug: 'arquitetura-sistemas-experiencias',
          title: 'Systems & Integrated Experience',
          subtitle: 'Bridging business needs with technical execution',
          category: 'Systems & Creative Direction',
          scope: 'Business & Technology',
          image: '/src/assets/images/project_monolith_1795526752876.jpg',
          featured: true,
          summary:
            'Leading multidisciplinary digital initiatives that unite business understanding, creative direction, and tailored technical execution.',
          decisionDetails: {
            contexto:
              'Initiatives that require coordinating business strategy, visual identity, user experience, and custom engineering under one cohesive vision.',
            desafio:
              'Closing the common gap between the people shaping strategy, the team designing the interface, and the engineers building the underlying system.',
            direcionamento:
              'Act as the bridge between business reality and technical execution — leading technical projects with Lumo and creative direction and positioning with Krios Creative.',
            solucao:
              'End-to-end project leadership covering real requirement discovery, solution architecture, visual alignment, and structured delivery.',
            impacto:
              'Digital systems tailored to the company’s current stage, built to support commercial and operational routines without unnecessary complexity.',
          },
        },
      ],
      workPage: {
        kicker: 'Applied direction',
        title: 'Selected Projects',
        subtitle:
          'Projects that translate real business needs into digital solutions, built around clear strategic thinking and consistent execution.',
      },
      workDetail: {
        backLabel: 'All projects',
        trackLabel: 'Focus',
        scopeLabel: 'Scope',
        headings: {
          contexto: 'Context',
          desafio: 'Challenge',
          direcionamento: 'Direction',
          solucao: 'Solution',
          impacto: 'Impact',
        },
        moreProjects: 'More Projects',
      },
    },
    socialProof: {
      kicker: 'What people say',
      title: 'Experience speaks too.',
      subtitle:
        'Outcomes, working relationships, and perspectives shared by people I have worked alongside.',
      video: {
        id: 'video-principal',
        label: 'Video testimonial · Featured',
        orientation: 'portrait',
        authorName: 'Dr. Bruna Testimonial',
        authorRole: 'Physician · Specialized dental clinic',
        context: 'Digital presence and CRM structuring',
        durationHint: '9:16 format · Video testimonial',
        videoUrl: 'https://youtube.com/shorts/lrhIuCBxF9g?feature=share',
        posterUrl: 'https://i.ytimg.com/vi/lrhIuCBxF9g/hqdefault.jpg',
      },
      placeholderBadge: 'Placeholder slot',
      watchLabel: 'Watch testimonial',
      placeholderLabel: 'Video testimonial',
      inlineMissingHint: 'Add the video file or URL in src/data/socialProofData.ts.',
      playAriaPrefix: 'Play',
      infoAriaPrefix: 'View details for',
      closeModalAria: 'Close video modal',
    },
    testimonials: {
      kicker: 'Decision lens',
      title: 'The value of each solution',
      subtitle:
        'This is the perspective that guides my decisions and how I contribute to every project.',
      mobileCue: 'Tap to flip · Swipe →',
      cardKicker: 'Value perspective',
      cardAriaSuffix: 'Flip card to view summary.',
      marks: {
        site: 'Site',
        crm: 'CRM',
        automation: 'Flows',
        strategy: 'Business',
      },
      items: [
        {
          id: 'v1',
          statement:
            'A website can be far more than an online presence: it can act as a tool for positioning, clear communication, and client acquisition.',
          pillarTitle: 'Website & Positioning',
          pillarSubtitle: 'Clear messaging and client acquisition',
          iconId: 'site',
        },
        {
          id: 'v2',
          statement:
            'A CRM can be far more than a contact list: it can structure your commercial relationship and bring clarity to every opportunity.',
          pillarTitle: 'CRM & Sales Process',
          pillarSubtitle: 'Structured relationships and visibility',
          iconId: 'crm',
        },
        {
          id: 'v3',
          statement:
            'Automation can be far more than removing manual tasks: it can make an operation sharper and free up time for work that truly matters.',
          pillarTitle: 'Intentional Automation',
          pillarSubtitle: 'Operational efficiency and focus on essentials',
          iconId: 'automation',
        },
        {
          id: 'v4',
          statement:
            'The value of a solution lies not only in what it does, but in how directly it serves the goals of the business.',
          pillarTitle: 'Business First',
          pillarSubtitle: 'Decisions grounded in real context',
          iconId: 'strategy',
        },
      ],
    },
    thoughts: {
      kicker: 'About me',
      title: 'About & Partnerships',
      leadPrimary:
        'I work at the intersection of business, commercial development, project direction, and digital solution building.',
      leadSecondary:
        'I understand business needs and bring together complementary disciplines — from technical execution to creative direction — to turn challenges into well-directed projects.',
      synthesisTag: 'Business Perspective',
      synthesisTitle: 'Understanding how a company creates value before choosing the tool.',
      synthesisBody:
        'Effective solutions do not rely on technical skill alone — they depend on understanding the operation, the customers, and the trade-offs required to make the right calls.',
      synthesisCta: 'Explore full perspective',
      articles: [
        {
          slug: 'conducao-de-projetos-na-lumo',
          tag: 'Technical & Commercial Practice',
          title: 'Lumo: connecting business needs with technical execution',
          excerpt:
            'At Lumo, I help lead projects spanning websites, systems, CRMs, and automations, bridging client business needs with technical execution.',
          image: '/src/assets/images/blog_editorial_1_1795526753222.jpg',
          featuredOnHome: true,
          sections: [
            {
              heading: 'Business and technical execution moving together',
              paragraphs: [
                'I work across business and technology, focusing on commercial development, project direction, and building digital solutions.',
                'My role is to understand what a company actually needs, uncover opportunities, and connect the right capabilities to turn messy problems into well-structured projects.',
                'At Lumo, I help lead initiatives involving custom websites, software systems, CRM setups, and operational automations — keeping client objectives closely tied to engineering execution.',
              ],
            },
            {
              heading: 'Understand before building',
              paragraphs: [
                'I am especially drawn to how businesses operate beneath the surface: how they win clients, structure internal workflows, make decisions, and find room to grow.',
                'Good solutions rarely depend on technical know-how alone. Above all, they depend on reading the context accurately and making the right calls.',
              ],
            },
          ],
        },
        {
          slug: 'parceria-na-krios-creative',
          tag: 'Positioning & Creative Direction',
          title: 'Krios Creative: communication, visual identity, and digital experience',
          excerpt:
            'I am also a partner at Krios Creative, where communication, visual identity, and creative direction complement my perspective on positioning and digital experience.',
          image: '/src/assets/images/blog_editorial_2_1795526752783.jpg',
          featuredOnHome: true,
          sections: [
            {
              heading: 'Where strategy and aesthetics meet',
              paragraphs: [
                'I am also a partner at Krios Creative, where communication, visual identity, and creative direction complement my work on positioning and digital experience.',
                'A solid commercial strategy carries far more weight when paired with consistent visual communication and a digital experience that makes building trust with clients natural.',
              ],
            },
            {
              heading: 'Clarity as the foundation for decisions',
              paragraphs: [
                'The value of a solution is never just what it can do on paper — it is how meaningfully it contributes to the company’s goals. That lens guides my decisions across every engagement.',
              ],
            },
          ],
        },
        {
          slug: 'o-problema-antes-da-tecnologia',
          tag: 'Business Perspective',
          title: 'Why the problem often comes before the technology',
          excerpt:
            'A new CRM will not organize a broken sales process. A new website cannot fix messaging that lacks clarity.',
          image: '/src/assets/images/project_verbena_1795526752076.jpg',
          featuredOnHome: false,
          sections: [
            {
              heading: 'Understand the business before picking the tool',
              paragraphs: [
                'It is common to see companies invest in new websites, software tools, systems, and automations without resolving the root issue that triggered the investment.',
                'A new CRM does not fix an unstructured sales process on its own. A new website cannot rescue positioning that leaves customers guessing. Automation does not fix a workflow that was never properly defined.',
                'More often than not, the problem sits upstream of technology.',
                'That is why my first priority is always understanding the business: its operations, objectives, customer experience, and how its teams connect.',
                'From that foundation, it becomes clear where real opportunities lie — and which solutions will actually move the company forward.',
              ],
            },
          ],
        },
      ],
      blogPage: {
        kicker: 'About me',
        title: 'About & Working Perspective',
        subtitle:
          'Working across business, commercial development, project direction, and digital solution building alongside Lumo and Krios Creative.',
      },
      blogDetail: {
        backLabel: 'Back to About',
      },
    },
    contact: {
      kicker: 'Next step',
      headline: "Let's understand what your business needs.",
      intro:
        'The right path is not always obvious at the start. The first step is understanding your context to see what needs to change and which fronts make sense:',
      scenarios: [
        'Clarifying your service offering and strengthening digital presence',
        'Structuring commercial workflows and implementing CRM',
        'Reducing manual work and operational bottlenecks',
        'Aligning digital infrastructure with your company’s current stage',
      ],
      closing:
        'If there is something that needs to be understood, organized, or built, we can start with a conversation.',
      socialEmailLabel: 'Email',
      formTitle: 'Send a message',
      formSubtitle: 'Share where your company stands right now so we can start the conversation.',
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email',
      emailPlaceholder: 'you@company.com',
      projectLabel: 'Context or project',
      projectPlaceholder:
        "Tell me about your company's current stage, challenges, or what needs to be structured...",
      errorRequired: 'Please complete all fields before sending.',
      submitLabel: 'Start a conversation',
      successTitle: 'Conversation started.',
      successBodyPrefix: 'Thank you, ',
      successBodySuffix:
        '. Your information has been noted so we can review your context and next steps together.',
      resetLabel: 'Send another message',
    },
    footer: {
      headline: 'Business first. Technology with purpose.',
      subheadline: 'Strategy, processes, and digital solutions.',
      navTitle: 'Navigation',
      navItems: {
        home: 'Home',
        diagnosis: 'Diagnosis',
        practice: 'Practice',
        projects: 'Projects',
        contact: 'Contact',
      },
      channelsTitle: 'Channels',
      emailChannel: 'Email',
      signatureTitle: 'Enzo Lutie',
      signatureSubtitle: 'Strategies, Processes & Digital Solutions',
      copyright: '© 2026 — All rights reserved.',
    },
  },
};
