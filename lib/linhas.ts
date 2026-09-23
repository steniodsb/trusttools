// Linhas / categorias institucionais da Trust Tools.
// Conteúdo fixo (não vem do banco) — usado na Home, na landing /produtos e
// nas páginas individuais /linhas/[slug].
//
// Desde set/2026 o catálogo de produtos do banco foi desativado: cada linha
// lista SUBCATEGORIAS, e cada subcategoria abre um catálogo em PDF
// (arquivos em /public/catalogos). Subcategoria sem `pdf` aparece como
// "catálogo em breve" com CTA de WhatsApp.

export type Subcategoria = {
  slug: string;
  name: string;
  /** Texto curto exibido no card */
  description?: string;
  /** Foto do card (em /public/linhas). Sem foto → placeholder */
  image?: string;
  /** Caminho do PDF em /public/catalogos. Sem PDF → "em breve" */
  pdf?: string;
};

export type Linha = {
  slug: string;
  name: string;
  image: string;
  /** Descrição curta usada nos blocos da página /produtos e nos cards da Home */
  cardDescription: string;
  /** Subtítulo opcional exibido no topo da página individual */
  subtitle?: string;
  /** Parágrafos de introdução da página individual */
  intro: string[];
  /** Título da seção de subcategorias (default: "Catálogos") */
  subcategoriasTitle?: string;
  subcategorias: Subcategoria[];
};

export const linhas: Linha[] = [
  {
    slug: "construcao",
    name: "Construção Civil",
    image: "/cat-construcao.avif",
    subtitle: "Soluções para Concreto, Pré-Moldados, Lajes Alveolares e Pisos Industriais",
    cardDescription:
      "Linha completa de ferramentas para concreto armado, protendido, lajes alveolares, pré-moldados, alvenaria, pisos industriais e estruturas especiais.",
    intro: [
      "A Trust Tools oferece uma linha completa de ferramentas para aplicações em concreto armado, concreto protendido, lajes alveolares, pré-moldados, alvenaria, pisos industriais e estruturas especiais.",
      "Nosso portfólio inclui serras diamantadas, brocas e coroas, segmentos, pratos de desbaste, discos diamantados e abrasivos, discos para corte de aço, talhadeiras, ponteiros, ferramentas elétricas e acessórios.",
      "Atendemos desde obras, empresas de corte e perfuração até indústrias de pré-fabricados, sempre com foco em produtividade, segurança, durabilidade e melhor desempenho em campo.",
    ],
    subcategorias: [
      {
        slug: "protendidos",
        name: "Protendidos",
        description: "Serras diamantadas para concreto protendido: lajes alveolares, vigas e pilares.",
        image: "/linhas/protendidos.webp",
        pdf: "/catalogos/construcao-protendidos-pre-moldados.pdf",
      },
      {
        slug: "pre-moldados",
        name: "Pré-moldados",
        description: "Serras diamantadas para pré-fabricados de concreto, com modelos de 600 a 1200 mm.",
        image: "/linhas/pre-moldados.webp",
        pdf: "/catalogos/construcao-protendidos-pre-moldados.pdf",
      },
      {
        slug: "calices",
        name: "Cálices",
        description:
          "Cálices inteiriços e cálices para coroa, com rosca ou ALEC, para perfuratrizes de concreto.",
        image: "/linhas/calices.webp",
        pdf: "/catalogos/construcao-calices-coroas.pdf",
      },
      {
        slug: "coroas",
        name: "Coroas",
        description: "Coroas segmentadas para perfuração em concreto, de 3/4\" a 6.1/2\", comprimentos de 290 a 400 mm.",
        image: "/linhas/coroas.webp",
        pdf: "/catalogos/construcao-calices-coroas.pdf",
      },
      {
        slug: "brocas",
        name: "Brocas",
        description: "Brocas diamantadas e de widia para concreto, alvenaria e pisos.",
      },
      {
        slug: "concreto-asfalto",
        name: "Concreto e Asfalto",
        description:
          "Serras para concreto curado, concreto verde e asfalto, de 350 a 600 mm, com dureza de segmento ajustada à aplicação.",
        image: "/linhas/concreto-asfalto.webp",
        pdf: "/catalogos/construcao-concreto-asfalto.pdf",
      },
    ],
  },
  {
    slug: "segmentos",
    name: "Segmentos Diamantados",
    image: "/cat-segmentos.avif",
    cardDescription:
      "Segmentos diamantados de alta performance desenvolvidos para maximizar produtividade, velocidade de corte e vida útil da ferramenta.",
    intro: [
      "Segmentos diamantados de alta performance desenvolvidos para maximizar produtividade, velocidade de corte e vida útil da ferramenta.",
      "Atendemos aplicações em concreto, concreto protendido, pré-fabricados, perfuração, mármore, granito, pedras naturais, refratários e processos especiais, com soluções específicas para cada necessidade operacional.",
      "Nossa equipe técnica auxilia na definição da melhor especificação para garantir o máximo desempenho em campo.",
    ],
    subcategoriasTitle: "Catálogo",
    subcategorias: [
      {
        slug: "segmentos-diamantados",
        name: "Segmentos Diamantados",
        description:
          "Pastilhas diamantadas em diversos formatos e tamanhos (1.1/4\" a 12\"), modelos Comum e HD, para brocas, serras e rebolos.",
        image: "/linhas/segmentos.webp",
        pdf: "/catalogos/segmentos-diamantados.pdf",
      },
    ],
  },
  {
    slug: "refratarios",
    name: "Refratários",
    image: "/cat-refratarios.avif",
    subtitle: "Ferramentas para os Materiais Mais Exigentes da Indústria",
    cardDescription:
      "Soluções para corte, perfuração e desbaste de materiais refratários em fornos industriais, siderurgia, fundições, cimenteiras, vidro, alumínio e processos de alta temperatura.",
    intro: [
      "Desenvolvemos e fornecemos soluções para corte, perfuração e desbaste de materiais refratários utilizados em fornos industriais, siderurgia, fundições, cimenteiras, indústrias de vidro, alumínio e demais processos de alta temperatura.",
      "Nossa experiência permite especificar a ferramenta ideal para cada aplicação, proporcionando maior produtividade, melhor acabamento e redução dos custos operacionais.",
      "Disponibilizamos discos diamantados, serras, brocas, segmentos e ferramentas especiais para os mais diversos tipos de materiais refratários e cerâmicas técnicas.",
    ],
    subcategoriasTitle: "Catálogo",
    subcategorias: [
      {
        slug: "refratarios",
        name: "Ferramentas para Refratários",
        description: "Discos, serras, brocas e segmentos para materiais refratários e cerâmicas técnicas.",
      },
    ],
  },
  {
    slug: "pedras",
    name: "Pedras Naturais",
    image: "/cat-pedras.avif",
    subtitle: "Soluções para Corte, Perfuração, Desbaste, Polimento e Acabamento",
    cardDescription:
      "Linha completa de ferramentas para mármores, granitos, quartzitos, quartzos, porcelanatos, superfícies ultracompactas e demais pedras naturais.",
    intro: [
      "A Trust Tools oferece uma linha completa de ferramentas para processamento de mármores, granitos, quartzitos, quartzos, porcelanatos, superfícies ultracompactas e demais pedras naturais.",
      "Nosso portfólio inclui discos diamantados, brocas, coroas, rebolos, pratos de desbaste, ferramentas de polimento e acessórios desenvolvidos para proporcionar máxima produtividade, excelente acabamento e longa vida útil.",
      "Atendemos marmorarias, beneficiadoras de pedras, fabricantes de superfícies especiais e profissionais que buscam precisão, qualidade e desempenho em cada etapa do processo.",
    ],
    subcategorias: [
      {
        slug: "serras-marmores-granitos",
        name: "Serras para Mármores e Granitos",
        description:
          "Serras de 250 a 600 mm com alma de aço nova, versões silenciosas, para mármores nacionais e importados e granitos de média e alta dureza.",
        image: "/linhas/serras-marmores-granitos.webp",
        pdf: "/catalogos/pedras-serras-marmores-granitos.pdf",
      },
      {
        slug: "marmores-granitos-porcelanato",
        name: "Mármores, Granitos e Porcelanato",
        description:
          "Adaptadores escariadores, brocas de chanfro, serras copo, discos de corte e desbaste, lixas diamantadas, rebolos e ferramentas de medição.",
        image: "/linhas/marmores-granitos-porcelanato.webp",
        pdf: "/catalogos/pedras-marmores-granitos-porcelanato.pdf",
      },
    ],
  },
  {
    slug: "ferramentas-diversas",
    name: "Ferramentas e Máquinas",
    image: "/cat-ferramentas-diversas.avif",
    subtitle: "Complementando Soluções para os Mais Diversos Segmentos",
    cardDescription:
      "Ampla variedade de ferramentas profissionais para construção civil, indústria, manutenção e oficinas especializadas.",
    intro: [
      "Além de nossa linha de ferramentas diamantadas e abrasivas, disponibilizamos uma ampla variedade de ferramentas profissionais para atender às necessidades da construção civil, indústria, manutenção e oficinas especializadas.",
      "Oferecemos discos de corte e desbaste, brocas, escovas, talhadeiras, ponteiros, acessórios, ferramentas manuais e diversos produtos de apoio, sempre priorizando qualidade, segurança e desempenho.",
      "Nosso objetivo é proporcionar aos clientes a conveniência de encontrar em um único fornecedor as soluções necessárias para suas operações.",
    ],
    subcategorias: [
      {
        slug: "lixadeiras",
        name: "Lixadeiras",
        description: "Lixadeiras angulares e retas para corte e desbaste.",
      },
      {
        slug: "serra-marmore",
        name: "Serra Mármore",
        description: "Serras mármore para corte de pedras, cerâmicas e alvenaria.",
      },
      {
        slug: "roquite",
        name: "Roquite",
        description: "Linha Roquite de ferramentas profissionais.",
      },
      {
        slug: "ferramentas-gerais",
        name: "Ferramentas em Geral e Manuais",
        description: "Discos, brocas, escovas, talhadeiras, ponteiros, acessórios e ferramentas manuais.",
      },
    ],
  },
  {
    slug: "repastilhamento",
    name: "Repastilhamento",
    image: "/cat-repastilhamento.avif",
    subtitle: "Mais vida útil, menor custo operacional",
    cardDescription:
      "Serviços especializados de repastilhamento e recuperação de ferramentas diamantadas, com redução significativa de custos versus comprar novo.",
    intro: [
      "A Trust Tools oferece serviços especializados de repastilhamento e recuperação de ferramentas diamantadas, proporcionando significativa redução de custos em comparação à aquisição de ferramentas novas.",
      "Recuperamos serras diamantadas, coroas, cálices, brocas e outras ferramentas, utilizando processos desenvolvidos por nossa equipe técnica e executados em nossa unidade de Jundiaí.",
      "Além da substituição dos segmentos, avaliamos as condições da ferramenta para garantir segurança, desempenho e máxima vida útil, contribuindo para a redução de desperdícios e para uma operação mais sustentável.",
      "Todo o processo é realizado seguindo rigorosos padrões de qualidade e segurança, assegurando confiabilidade e produtividade para nossos clientes.",
    ],
    subcategoriasTitle: "Catálogo",
    subcategorias: [
      {
        slug: "repastilhamento",
        name: "Repastilhamento de Ferramentas Diamantadas",
        description:
          "Recuperamos serras, brocas, coroas, cálices, fresas, dressadores e outras ferramentas diamantadas. Menor custo, maior vida útil, menos descarte.",
        image: "/linhas/repastilhamento.webp",
        pdf: "/catalogos/repastilhamento.pdf",
      },
    ],
  },
];

export function getLinha(slug: string): Linha | undefined {
  return linhas.find((l) => l.slug === slug);
}
