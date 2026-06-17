// Linhas / categorias institucionais da Trust Tools.
// Conteúdo fixo (não vem do banco) — usado na landing /produtos e nas
// páginas individuais /linhas/[slug]. Os produtos em si vêm do banco.

export type Linha = {
  slug: string;
  name: string;
  image: string;
  /** Slug da categoria correspondente no banco (para listar os produtos) */
  categorySlug: string;
  /** Descrição curta usada nos blocos da página /produtos e nos cards da Home */
  cardDescription: string;
  /** Subtítulo opcional exibido no topo da página individual */
  subtitle?: string;
  /** Parágrafos de introdução da página individual */
  intro: string[];
};

export const linhas: Linha[] = [
  {
    slug: "segmentos",
    name: "Segmentos Diamantados",
    image: "/cat-segmentos.avif",
    categorySlug: "segmentos-diamantados",
    cardDescription:
      "Segmentos diamantados de alta performance desenvolvidos para maximizar produtividade, velocidade de corte e vida útil da ferramenta.",
    intro: [
      "Segmentos diamantados de alta performance desenvolvidos para maximizar produtividade, velocidade de corte e vida útil da ferramenta.",
      "Atendemos aplicações em concreto, concreto protendido, pré-fabricados, perfuração, mármore, granito, pedras naturais, refratários e processos especiais, com soluções específicas para cada necessidade operacional.",
      "Nossa equipe técnica auxilia na definição da melhor especificação para garantir o máximo desempenho em campo.",
    ],
  },
  {
    slug: "construcao",
    name: "Construção Civil",
    image: "/cat-construcao.avif",
    categorySlug: "construcao-civil",
    subtitle: "Soluções para Concreto, Pré-Moldados, Lajes Alveolares e Pisos Industriais",
    cardDescription:
      "Linha completa de ferramentas para concreto armado, protendido, lajes alveolares, pré-moldados, alvenaria, pisos industriais e estruturas especiais.",
    intro: [
      "A Trust Tools oferece uma linha completa de ferramentas para aplicações em concreto armado, concreto protendido, lajes alveolares, pré-moldados, alvenaria, pisos industriais e estruturas especiais.",
      "Nosso portfólio inclui serras diamantadas, brocas e coroas, segmentos, pratos de desbaste, discos diamantados e abrasivos, discos para corte de aço, talhadeiras, ponteiros, ferramentas elétricas e acessórios.",
      "Atendemos desde obras, empresas de corte e perfuração até indústrias de pré-fabricados, sempre com foco em produtividade, segurança, durabilidade e melhor desempenho em campo.",
    ],
  },
  {
    slug: "refratarios",
    name: "Refratários",
    image: "/cat-refratarios.avif",
    categorySlug: "refratarios",
    subtitle: "Ferramentas para os Materiais Mais Exigentes da Indústria",
    cardDescription:
      "Soluções para corte, perfuração e desbaste de materiais refratários em fornos industriais, siderurgia, fundições, cimenteiras, vidro, alumínio e processos de alta temperatura.",
    intro: [
      "Desenvolvemos e fornecemos soluções para corte, perfuração e desbaste de materiais refratários utilizados em fornos industriais, siderurgia, fundições, cimenteiras, indústrias de vidro, alumínio e demais processos de alta temperatura.",
      "Nossa experiência permite especificar a ferramenta ideal para cada aplicação, proporcionando maior produtividade, melhor acabamento e redução dos custos operacionais.",
      "Disponibilizamos discos diamantados, serras, brocas, segmentos e ferramentas especiais para os mais diversos tipos de materiais refratários e cerâmicas técnicas.",
    ],
  },
  {
    slug: "pedras",
    name: "Rochas Ornamentais",
    image: "/cat-pedras.avif",
    categorySlug: "pedras-marmore",
    subtitle: "Soluções para Corte, Perfuração, Desbaste, Polimento e Acabamento",
    cardDescription:
      "Linha completa de ferramentas para mármores, granitos, quartzitos, quartzos, superfícies ultracompactas e demais rochas ornamentais.",
    intro: [
      "A Trust Tools oferece uma linha completa de ferramentas para processamento de mármores, granitos, quartzitos, quartzos, superfícies ultracompactas e demais rochas ornamentais.",
      "Nosso portfólio inclui discos diamantados, brocas, coroas, rebolos, pratos de desbaste, ferramentas de polimento e acessórios desenvolvidos para proporcionar máxima produtividade, excelente acabamento e longa vida útil.",
      "Atendemos marmorarias, beneficiadoras de pedras, fabricantes de superfícies especiais e profissionais que buscam precisão, qualidade e desempenho em cada etapa do processo.",
    ],
  },
  {
    slug: "ferramentas-diversas",
    name: "Ferramentas Profissionais",
    image: "/cat-ferramentas-diversas.avif",
    categorySlug: "ferramentaria-geral",
    subtitle: "Complementando Soluções para os Mais Diversos Segmentos",
    cardDescription:
      "Ampla variedade de ferramentas profissionais para construção civil, indústria, manutenção e oficinas especializadas.",
    intro: [
      "Além de nossa linha de ferramentas diamantadas e abrasivas, disponibilizamos uma ampla variedade de ferramentas profissionais para atender às necessidades da construção civil, indústria, manutenção e oficinas especializadas.",
      "Oferecemos discos de corte e desbaste, brocas, escovas, talhadeiras, ponteiros, acessórios, ferramentas manuais e diversos produtos de apoio, sempre priorizando qualidade, segurança e desempenho.",
      "Nosso objetivo é proporcionar aos clientes a conveniência de encontrar em um único fornecedor as soluções necessárias para suas operações.",
    ],
  },
  {
    slug: "repastilhamento",
    name: "Repastilhamento e Recuperação de Ferramentas",
    image: "/cat-repastilhamento.avif",
    categorySlug: "recapagem",
    subtitle: "Mais vida útil, menor custo operacional",
    cardDescription:
      "Serviços especializados de repastilhamento e recuperação de ferramentas diamantadas, com redução significativa de custos versus comprar novo.",
    intro: [
      "A Trust Tools oferece serviços especializados de repastilhamento e recuperação de ferramentas diamantadas, proporcionando significativa redução de custos em comparação à aquisição de ferramentas novas.",
      "Recuperamos serras diamantadas, coroas, cálices, brocas e outras ferramentas, utilizando processos desenvolvidos por nossa equipe técnica e executados em nossa unidade de Jundiaí.",
      "Além da substituição dos segmentos, avaliamos as condições da ferramenta para garantir segurança, desempenho e máxima vida útil, contribuindo para a redução de desperdícios e para uma operação mais sustentável.",
      "Todo o processo é realizado seguindo rigorosos padrões de qualidade e segurança, assegurando confiabilidade e produtividade para nossos clientes.",
    ],
  },
];

export function getLinha(slug: string): Linha | undefined {
  return linhas.find((l) => l.slug === slug);
}
