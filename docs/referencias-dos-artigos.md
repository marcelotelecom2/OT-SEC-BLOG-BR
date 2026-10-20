# Referências bibliográficas e normativas

## Auditoria inicial

Os artigos tinham menções a normas e identificadores de vulnerabilidade no
texto, mas não possuíam seções finais de referências nem links bibliográficos.
Foram identificadas referências explícitas à IEC 62351-1, à NERC CIP-002-5.1a
e à CVE-2010-2568. Os quatro estudos publicados da IEC 62351, o artigo sobre
NERC CIP-002 e a análise de Stuxnet receberam referências nos três idiomas.

As URLs foram verificadas em fontes oficiais em 20/10/2026:

- IEC: https://webstore.iec.ch/en/publication/6903
- NERC, documento CIP-002-5.1a: https://www.nerc.com/globalassets/standards/reliability-standards/cip/cip-002-5.1a.pdf
- NERC, catálogo CIP: https://www.nerc.com/standards/reliability-standards/cip
- Microsoft, comunicado sobre CVE-2010-2568: https://learn.microsoft.com/en-us/security-updates/securityadvisories/2010/2286198

O catálogo IEC identifica uma publicação específica, mas isso não demonstra
qual edição foi consultada pelo autor. Por isso, essa lacuna é explicitada na
referência, sem atribuir ao artigo um ano ou edição não registrados. A versão
CIP-002-5.1a já consta do corpo do artigo; as versões de CIP-003 e CIP-010 não
constam e não foram presumidas. A referência Microsoft cobre a vulnerabilidade
citada, sem servir de comprovação para todas as afirmações sobre Stuxnet.

Não foram acrescentadas bibliografias presumidas aos artigos sobre IA, 5G,
Zero Trust e engenharia reversa de PLCs. Eles não identificam documentos,
autores ou papers utilizados. Os dados experimentais e demais afirmações
nesses textos continuam sem fontes registradas; esta alteração não os valida.

## Padrão reutilizável

Ao final do Markdown de cada versão do artigo, use o título de nível 2
`## Referências` em português, `## References` em inglês ou `## Referencias`
em espanhol. Depois dele, use uma lista numerada e não acrescente novas seções
técnicas: a bibliografia deve encerrar o artigo. O título recebe o identificador
`references`, permitindo um link Markdown para `#references` dentro do texto.

Cada entrada deve informar:

1. **Tipo da fonte:** norma/especificação técnica, documento oficial, paper,
   relatório, conjunto de dados ou outra fonte identificada.
2. **Instituição ou autoria:** somente quando confirmada no documento.
3. **Título e identificador:** preserve o nome do documento; para normas, inclua
   parte, versão ou edição apenas quando souber qual foi utilizada.
4. **Ano, DOI e detalhes bibliográficos:** opcionais, somente se verificáveis.
   Não complete lacunas por suposição. Para papers, use o registro da editora,
   repositório original ou DOI confirmado.
5. **Link:** prefira a instituição emissora ou o documento oficial. Identifique
   quando se trata de catálogo, PDF ou página que exige aquisição/autenticação.
   Um link de catálogo não garante acesso gratuito ao texto integral.
6. **Escopo:** quando necessário, informe a seção ou o conceito ao qual a
   referência se aplica, sem sugerir que ela comprova todo o artigo.

A seção só deve existir quando houver referências identificadas. Fontes sem
URL podem ser descritas com os dados bibliográficos confirmados, sem criar um
link fictício. Leitura complementar deve ser distinguida de fonte efetivamente
citada ou utilizada.

## Editor, publicação e apresentação

O padrão usa o Markdown existente: funciona na prévia do editor, na exportação,
na importação, na publicação pelo painel e no HTML pré-renderizado, sem novo
campo de metadados ou formato de arquivo. As traduções mantêm seus próprios
títulos de seção e compartilham os identificadores oficiais dos documentos.

O renderizador usa uma borda separadora, título menor e texto discreto para a
bibliografia. Não há uma caixa visual adicional. O texto técnico, as imagens,
suas legendas, títulos dos artigos e URLs permanecem preservados.

## Arquivos desta implementação

- `src/components/article/ArticleContent.tsx`
- `src/components/article/ArticleContent.test.tsx`
- `src/index.css`
- `docs/referencias-dos-artigos.md`

Em `src/content/articles/`, foram acrescentadas somente as referências aos
seguintes arquivos:

- `iec-62351-ataques-seguranca.md`
- `iec-62351-ataques-seguranca.en.md`
- `iec-62351-ataques-seguranca.es.md`
- `iec-62351-requisitos-ameacas-vulnerabilidades.md`
- `iec-62351-requisitos-ameacas-vulnerabilidades.en.md`
- `iec-62351-requisitos-ameacas-vulnerabilidades.es.md`
- `iec-62351-ameacas-deliberadas-sistemas-eletricos.md`
- `iec-62351-ameacas-deliberadas-sistemas-eletricos.en.md`
- `iec-62351-ameacas-deliberadas-sistemas-eletricos.es.md`
- `iec-62351-ameacas-nao-intencionais.md`
- `iec-62351-ameacas-nao-intencionais.en.md`
- `iec-62351-ameacas-nao-intencionais.es.md`
- `nerc-cip-002-bes-classification.md`
- `nerc-cip-002-bes-classification.pt.md`
- `nerc-cip-002-bes-classification.es.md`
- `stuxnet-payload-retrospective.md`
- `stuxnet-payload-retrospective.pt.md`
- `stuxnet-payload-retrospective.es.md`
