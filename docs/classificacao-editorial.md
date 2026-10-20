# Classificação editorial de artigos

A categoria é armazenada em `area`, nos metadados do artigo, com uma chave
canônica em inglês. A mesma tradução é usada na home, na listagem, na página
individual, no HTML pré-renderizado, no painel e na prévia do editor. A busca
do painel aceita a chave original e o nome traduzido da categoria.

- **Normas Técnicas / Technical Standards:** estudo, interpretação e aplicação
  de normas e especificações técnicas. Não implica notícia de revisão normativa
  nem que uma norma técnica seja uma regulamentação.
- **Atualização Regulatória / Regulation Update:** notícias de mudanças em
  regras, obrigações ou exigências regulatórias. A simples menção a uma norma
  ou a conformidade não caracteriza uma atualização regulatória.
- **Pesquisas:** resultados e métodos de investigação devem ser classificados
  pela área técnica efetivamente abordada, sem apresentar um resumo de norma
  como pesquisa original.
- **Análises técnicas:** preservam as áreas temáticas existentes, como Análise
  de Vulnerabilidades, Engenharia de Redes e Inteligência Artificial, de acordo
  com o conteúdo. Não foi criada outra categoria genérica para esses artigos.

## Revisão dos artigos publicados

Os quatro estudos publicados da IEC 62351, IDs `9`, `10`, `11` e `12`, passaram
de `Regulation Update` para `Technical Standards`. Eles comentam os conceitos
de ameaças, requisitos, vulnerabilidades e ataques da IEC 62351-1, sem noticiar
uma alteração regulatória. A IEC identifica a parte 1 como especificação técnica:
https://webstore.iec.ch/en/publication/6903.

O artigo de ID `6`, sobre a classificação de sistemas BES na NERC CIP-002,
recebeu a mesma categoria: seu conteúdo é uma explicação de critérios da norma,
sem uma mudança regulatória identificada. Isso é uma classificação do artigo,
não uma conclusão sobre a obrigatoriedade ou aplicação jurídica da norma.

Os demais artigos publicados mantiveram suas áreas temáticas. Títulos, slugs,
URLs, textos, traduções e navegação foram preservados. Os dois artigos da IEC
62351 já despublicados ficaram fora do escopo desta revisão.

## Organização da home

**Artigos Recentes** apresenta artigos técnicos, estudos de normas e análises.
O link **Ver Artigos** e o botão de artigos da abertura apontam para `/articles`;
os cards apontam para as páginas dos artigos no idioma selecionado.

**Pesquisas**, em `/insights`, é destinada a investigações originais, resultados
técnicos e trabalhos próprios do laboratório. O menu, o botão **Explorar Pesquisas**
e o link das Notas de Campo apontam para essa área. Sem pesquisas publicadas,
a página informa esse estado e a seção de Notas de Campo continua oculta na home.
Artigos de estudo não são copiados para preencher a área de pesquisas.

As áreas temáticas da home são apresentadas como **Áreas de Interesse**, sem
afirmar a existência de investigações em andamento. Os mesmos conceitos são
usados nas versões em inglês e espanhol. Rotas, estilos e estrutura dos cards
permanecem os mesmos.
