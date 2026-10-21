# Radar OT

A seção pública permanece em `/insights`, com o título Radar OT. O cadastro é
manual, separado das notas históricas em `src/content/notes.ts`. Estas não foram
apagadas nem republicadas; continuam acessíveis no arquivo de notas do painel.

Em **Admin → Radar OT**, crie uma publicação e informe:

- Tipo: notícia, vulnerabilidade, advisory, incidente ou atualização regulatória.
- Título, data, nome da fonte original e link absoluto HTTP/HTTPS da fonte.
- Breve comentário técnico, com até 2.000 caracteres, e idioma original.
- Traduções opcionais de título e comentário em português, inglês e espanhol.

O cadastro começa como rascunho. Para publicação, todos os campos acima são
obrigatórios, exceto as traduções. Uma tradução iniciada exige título e
comentário juntos. Quando não há tradução, a página identifica o idioma original.
O cadastro não traduz automaticamente nem afirma que uma fonte foi verificada.
A revisão editorial da fonte e do comentário é feita pelo responsável.

Salvar grava `src/content/radar.json` por uma Pages Function autenticada,
usando os mesmos secrets e a mesma branch do painel de artigos. O commit inicia
o deploy configurado no Cloudflare Pages. A alteração só fica pública quando o
deploy termina. Despublicar preserva o registro e retira-o no próximo deploy.

Somente registros explicitamente publicados entram no bundle público.
O registro inicial está vazio: não há notícias de exemplo, feeds, raspagem,
agendamento ou coleta automática. Filtros por tipo e ordenação por data operam
somente sobre as publicações cadastradas manualmente.
