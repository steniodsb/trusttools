// Linhas / categorias institucionais da Trust Tools.
// Conteúdo fixo (não vem do banco) — usado na landing /produtos e nas
// páginas individuais /linhas/[slug].

export type Linha = {
  slug: string;
  name: string;
  image: string;
  /** Slug da categoria correspondente no banco (para listar os produtos) */
  categorySlug: string;
  /** Descrição curta usada nos blocos da página /produtos */
  cardDescription: string;
  /** Subtítulo opcional exibido no topo da página individual */
  subtitle?: string;
  /** Parágrafos de introdução da página individual */
  intro: string[];
  /** Lista "linha de produtos" da categoria (opcional) */
  productLine?: {
    title: string;
    items: string[];
  };
  /** Parágrafo de fechamento (opcional) */
  closing?: string;
};

export const linhas: Linha[] = [
  {
    slug: "construcao",
    name: "Construção",
    image: "/cat-construcao.avif",
    categorySlug: "construcao-civil",
    cardDescription:
      "Oferecemos uma linha completa de ferramentas para corte e retrabalho de concretos em geral, incluindo concreto protendido, pré-moldado, lajes alveolares, concreto curado e outros tipos de aplicações estruturais.",
    subtitle: "Ferramentas para Corte e Retrabalho de Concreto",
    intro: [
      "Oferecemos uma linha completa de ferramentas para corte e retrabalho de concretos em geral, incluindo concreto protendido, pré-moldado, lajes alveolares, concreto curado e outros tipos de aplicações estruturais.",
    ],
    productLine: {
      title: "Nossa linha de produtos inclui:",
      items: [
        "Serras diamantadas: de 250 mm a 1300 mm, disponíveis nas versões novas e repastilhadas.",
        "Cálices e coroas diamantadas: de ½” a 20”, também nas versões novas e repastilhadas.",
        "Pratos para lixadeiras: de 100 mm a 180 mm, com ou sem rosca.",
      ],
    },
    closing:
      "Produtos de alta performance para garantir precisão, durabilidade e eficiência no seu projeto.",
  },
  {
    slug: "refratarios",
    name: "Refratários",
    image: "/cat-refratarios.avif",
    categorySlug: "refratarios",
    cardDescription:
      "Trabalhamos com ferramentas específicas para corte, furo e desbaste de materiais refratários e cerâmicas refratárias em geral, garantindo alto desempenho mesmo nas aplicações mais exigentes.",
    intro: [
      "Trabalhamos com ferramentas específicas para corte, furo e desbaste de materiais refratários e cerâmicas refratárias em geral, garantindo alto desempenho mesmo nas aplicações mais exigentes.",
    ],
    productLine: {
      title: "Linha de produtos para refratários:",
      items: [
        "Serras diamantadas: de 250 mm a 600 mm",
        "Fresas diamantadas: de 200 mm a 800 mm",
        "Pratos para lixadeiras: de 100 mm a 180 mm, com ou sem rosca",
        "Brocas diamantadas: de 6 mm a 100 mm, disponíveis em diferentes comprimentos",
      ],
    },
    closing:
      "Ferramentas desenvolvidas para máxima resistência e precisão no trabalho com materiais de alta dureza térmica.",
  },
  {
    slug: "pedras",
    name: "Pedras",
    image: "/cat-pedras.avif",
    categorySlug: "pedras-marmore",
    cardDescription:
      "Soluções completas em ferramentas para corte, furo, desbaste e acabamento em mármores, granitos e pedras preciosas, com alta durabilidade e precisão para os mais diversos tipos de aplicação.",
    intro: [
      "Soluções completas em ferramentas para corte, furo, desbaste e acabamento em mármores, granitos e pedras preciosas, com alta durabilidade e precisão para os mais diversos tipos de aplicação.",
    ],
    productLine: {
      title: "Linha de produtos para pedras:",
      items: [
        "Serras diamantadas: de 250 mm a 900 mm",
        "Pratos para lixadeiras: de 100 mm a 180 mm, com rosca",
        "Brocas diamantadas: de 6 mm a 180 mm",
        "Adesivo PU (Poliuretano): disponível nas cores preto, branco, cinza e incolor",
      ],
    },
    closing:
      "Equipamentos e insumos ideais para garantir acabamento de qualidade e máxima eficiência nos seus projetos com pedras naturais.",
  },
  {
    slug: "segmentos",
    name: "Segmentos",
    image: "/cat-segmentos.avif",
    categorySlug: "segmentos-diamantados",
    cardDescription:
      "Desenvolvemos e fornecemos segmentos diamantados de alta performance, compostos por diamante industrial, ligas metálicas, cobalto e tungstênio. São ideais para o corte e refino de diversos materiais, garantindo durabilidade e precisão em aplicações exigentes.",
    subtitle: "Segmentos Diamantados",
    intro: [
      "Desenvolvemos e fornecemos segmentos diamantados de alta performance, compostos por diamante industrial, ligas metálicas, cobalto e tungstênio. São ideais para o corte e refino de diversos materiais, garantindo durabilidade e precisão em aplicações exigentes.",
    ],
    productLine: {
      title: "Segmentos para diferentes ferramentas:",
      items: [
        "Coroas e Cálices: de 1½” a 20”",
        "Fresas: de 200 mm a 800 mm",
        "Serras diamantadas: de 250 mm a 1300 mm",
      ],
    },
    closing:
      "Segmentos sob medida para aplicações em cálices, coroas, serras, fresas e brocas tipo serra copo.",
  },
  {
    slug: "ferramentas-diversas",
    name: "Ferramentas Diversas",
    image: "/cat-ferramentas-diversas.avif",
    categorySlug: "ferramentaria-geral",
    cardDescription:
      "Disponibilizamos uma ampla variedade de ferramentas manuais e acessórios para uso profissional e doméstico, ideais para aplicações em metal, madeira, alvenaria e outros materiais. Qualidade, resistência e praticidade para o dia a dia no canteiro de obras, oficinas ou manutenção em geral.",
    intro: [
      "Disponibilizamos uma ampla variedade de ferramentas manuais e acessórios para uso profissional e doméstico, ideais para aplicações em metal, madeira, alvenaria e outros materiais. Qualidade, resistência e praticidade para o dia a dia no canteiro de obras, oficinas ou manutenção em geral.",
    ],
    productLine: {
      title: "Nossa linha inclui:",
      items: [
        "Alicates: universal, de bico, corte e arrebitador",
        "Chaves: Torx, Allen, combinada e catraca",
        "Escovas de aço",
        "Discos de corte: para aço, ferro, madeira e alvenaria",
        "Discos de desbaste: para aço, ferro e alvenaria",
        "Maletas de ferramentas",
        "Brocas: para aço, alvenaria e madeira",
      ],
    },
    closing:
      "Ferramentas essenciais para quem busca eficiência, segurança e desempenho em cada tarefa.",
  },
  {
    slug: "repastilhamento",
    name: "Repastilhamento",
    image: "/cat-repastilhamento.avif",
    categorySlug: "recapagem",
    cardDescription:
      "Com a expertise da Trust Tools na fabricação e no desenvolvimento de ferramentas diamantadas, oferecemos o serviço de repastilhamento de serras, coroas, cálices e fresas, garantindo economia de até 40% para nossos clientes e contribuindo para um processo mais sustentável.",
    intro: [
      "Com a expertise da Trust Tools na fabricação e no desenvolvimento de ferramentas diamantadas, oferecemos o serviço de repastilhamento de serras, coroas, cálices e fresas, garantindo economia de até 40% para nossos clientes e contribuindo para um processo mais sustentável.",
      "Todo o processo segue rigorosamente as normas de segurança vigentes (NR12), assegurando desempenho, confiabilidade e a durabilidade que você precisa para a sua operação.",
    ],
  },
];

export function getLinha(slug: string): Linha | undefined {
  return linhas.find((l) => l.slug === slug);
}
