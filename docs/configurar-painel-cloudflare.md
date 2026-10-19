# Configuração do painel administrativo

O painel em `/admin` grava artigos no repositório por uma Cloudflare Pages Function. Cada alteração cria um commit na branch configurada e o próprio Cloudflare Pages inicia o deploy.

Configure estes **secrets** em **Cloudflare Dashboard → Workers & Pages → ot-sec-blog → Settings → Variables and Secrets**:

- `ADMIN_PASSWORD`: senha exclusiva do painel (não use a antiga senha de demonstração).
- `ADMIN_SESSION_SECRET`: texto aleatório longo, com pelo menos 32 bytes.
- `GITHUB_TOKEN`: fine-grained personal access token restrito ao repositório `OT-SEC-BLOG-BR`, com permissão **Contents: Read and write**.

Estas variáveis são opcionais porque já possuem os valores usados pelo projeto:

- `GITHUB_OWNER=marcelotelecom2`
- `GITHUB_REPO=OT-SEC-BLOG-BR`
- `GITHUB_BRANCH=main`

Depois de cadastrar os secrets, faça um novo deploy. A senha e o token ficam disponíveis apenas na Function e nunca entram no JavaScript público.

Ao salvar um artigo, o painel atualiza os metadados, os Markdown nos três idiomas e eventuais imagens incorporadas em um único commit. Ao excluir uma publicação, o painel altera `published` para `false`; o conteúdo permanece recuperável no Git, mas sai das rotas, listagens, sitemap e bundle público no deploy seguinte.
