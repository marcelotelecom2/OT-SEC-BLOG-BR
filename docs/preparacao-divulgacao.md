# Preparação para divulgação — 20/10/2026

## Projetos e publicação

Os três cadastros originais estavam no template do commit `e3dfdda`.
Os endereços `github.com/ot-sec/open-noc-ai`, `github.com/ot-sec/s7-fuzzer`
e `github.com/ot-sec/modbus-honeypot` responderam HTTP 404 na revisão.
As demonstrações não tinham vínculo oficial comprovado.

O [Open-NOC-AI oficial](https://github.com/marcelotelecom2/open-noc-ai)
é público e contém backend, frontend e documentação de uma plataforma AIOps
para NOC/SOC, com inventário, alertas, incidentes, assistência e automação.
Sua descrição anterior sobre SLMs e protocolos industriais não correspondia
ao escopo documentado. O cadastro agora descreve o escopo verificável,
usa `IN DEVELOPMENT` e não oferece demonstração. Não havia releases no GitHub
na data da revisão; o cadastro não afirma maturidade ou validação de produção.

S7-Comm Protocol Fuzzer e High-Interaction Modbus Honeypot permanecem em
`src/content/projects.ts` com `published: false`. As afirmações e status antigos
são registros históricos não validados; não devem ser reutilizados como fatos.
O plugin do Vite inclui no bundle apenas projetos com `published: true`.

A página pública segue os dados revisados do repositório. O painel mantém
suas operações locais e preserva cópias antigas do navegador em `adminProjects`.
Essas cópias não substituem os dados públicos. Para publicar uma iniciativa,
revisar origem, escopo, status e links em `src/content/projects.ts`, marcar
`published: true`, executar as validações e realizar um novo deploy.

## Artigos demonstrativos

Os cadastros de IDs 1 a 5 também vieram do template inicial. Foram despublicados
sem alterar seus corpos, traduções ou identificadores:

- IA em redes ICS: contém números de acurácia, latência e testes de 72 horas
  sem evidências, dataset ou método reproduzível no repositório.
- Stuxnet: esboço de poucos parágrafos, anunciado como leitura de 18 minutos.
- Zero Trust: esboço de um parágrafo, anunciado como leitura de 15 minutos.
- 5G: esboço de um parágrafo, anunciado como leitura de 10 minutos.
- Engenharia reversa de PLCs: uma frase, anunciada como guia de 22 minutos.

Os arquivos permanecem disponíveis para desenvolvimento editorial futuro.
Os estudos IEC 62351 e o artigo NERC CIP-002 foram preservados. Essa revisão
de publicação não equivale a uma validação técnica integral de cada afirmação
dos artigos remanescentes.

## Rodapé e compartilhamento

Não foi encontrada integração de newsletter em código, dependências ou rotas
do servidor. O formulário permanece desmontado, com estrutura e traduções
preservadas. Sua ativação exige integração funcional e tratamento de consentimento.
Nenhum e-mail é coletado por esse formulário.

O GitHub aponta para o repositório deste site. LinkedIn e RSS ficam ocultos
até existirem destinos oficiais confirmados.

A imagem institucional PNG de 1200 × 630 reutiliza o SVG do favicon e a paleta
existente. É gerada por `scripts/generate-social-image.ts` antes do build e usada
em URLs absolutas nos metadados estáticos e durante a navegação React.
As páginas Artigos, Pesquisas, Projetos e Sobre recebem canônicas próprias,
tanto no HTML estático quanto no navegador.

O sitemap é regenerado a partir dos artigos publicados. A alteração local
pré-existente que retirava dois artigos já despublicados foi preservada no
resultado gerado; as versões demonstrativas retiradas nesta revisão também
deixam de constar no sitemap e no bundle público.

## Verificação

`npm run lint` executa TypeScript (`tsc --noEmit`); não há ESLint separado.
Executar também `test:articles`, `test:routing`, `test:drafts`, `build` e
`test:performance`. A validação de isolamento cobre projetos antigos em cache,
preservação administrativa, ausência de newsletter e placeholders no rodapé,
além das verificações de artigos e notas já existentes.

Antes de divulgar, conferir o check Cloudflare Pages para o commit enviado e
validar novamente o domínio público, incluindo os HTTP 404 dos artigos retirados.
