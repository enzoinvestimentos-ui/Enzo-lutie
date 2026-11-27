export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  capabilities: [string, string, string];
}

export interface ApproachStep {
  number: string;
  title: string;
  description: string;
}

export interface ProjectDecisionPillar {
  label: string;
  description: string;
}

export interface ProjectItem {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  scope: string;
  image: string;
  featured: boolean;
  summary: string;
  decisionDetails: {
    contexto: string;
    desafio: string;
    direcionamento: string;
    solucao: string;
    impacto: string;
  };
}

export interface ValuePerspectiveItem {
  id: string;
  statement: string;
  pillarTitle: string;
  pillarSubtitle: string;
  iconId: 'site' | 'crm' | 'automation' | 'strategy';
}

export interface PracticeHighlightItem {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  image: string;
  featuredOnHome: boolean;
  sections: {
    heading?: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
}

export const HERO_MEDIA = {
  frontAvatar: '/foto-frente.jpg.PNG',
  backAvatar: '/foto-verso.jpg.PNG',
};

export const WHATSAPP_CONTACT_URL =
  'https://api.whatsapp.com/send?phone=5551984049837&text=Fala%20Luti%C3%AA%2C%20tudo%20bem%3F%20';

export const INSTAGRAM_URL = 'https://www.instagram.com/enzolutie/';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/enzo-brum-042546423/';

export const APPROACH_STEPS: ApproachStep[] = [
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
];

export const SERVICES: ServiceItem[] = [
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
];

export const PROJECT_DECISION_PILLARS: ProjectDecisionPillar[] = [
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
];

export const PROJECTS: ProjectItem[] = [
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
];

export const VALUE_PERSPECTIVES: ValuePerspectiveItem[] = [
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
];

export const PRACTICE_HIGHLIGHTS: PracticeHighlightItem[] = [
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
];
