# Publicar artigos pelo editor local

O painel `/admin` edita conteúdo no navegador. O site público usa os arquivos do
repositório. Salvar no painel não modifica o GitHub nem publica no Cloudflare.

1. Crie ou edite o artigo no painel e confira a prévia.
2. Marque **Pronto para publicar**. Desmarcado, o arquivo continua sendo um
   rascunho exportável, mas o comando de publicação não o importa no site.
3. Clique em **Exportar artigo**. No editor, a exportação inclui as alterações
   atuais, mesmo antes de salvar no navegador. Na lista, exporta a edição salva.
4. No terminal do projeto, execute:

   ```sh
   npm run import:article -- "/caminho/artigo.ot-sec.json"
   ```

   Se estiver usando o terminal WSL e o download estiver no Windows, use o caminho
   montado, por exemplo `/mnt/c/Users/seu-usuario/Downloads/artigo.ot-sec.json`.

5. Revise `git diff` e `git status`. A importação cria ou atualiza o Markdown e os
   metadados. Imagens enviadas pelo editor são extraídas para
   `public/images/articles/`; URLs externas permanecem externas.
6. Valide:

   ```sh
   npm run test:articles
   npm run lint
   npm run build
   ```

7. Faça commit e envie para a branch conectada ao Cloudflare Pages. Aguarde a
   conclusão do deploy antes de conferir o site público.

Para atualizar um artigo, edite e exporte o mesmo artigo: o identificador é
preservado e a importação atualiza a entrada existente. Um slug ocupado por outro
artigo é recusado. A exportação preserva autor, tags, datas e conteúdo; contadores
do navegador não são publicados.

Ocultar um artigo na lista do painel só afeta esse navegador. Para retirá-lo do
site, remova a entrada correspondente dos metadados e o Markdown no projeto e
publique essa alteração pelo GitHub.

A importação não faz commit, push ou deploy automaticamente. Guarde o arquivo
exportado como cópia portátil: os dados do navegador podem ser apagados pelo
usuário ou pelo próprio navegador.
