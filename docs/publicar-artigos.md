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

Somente artigos com `published: true` entram no JavaScript público. Os demais
Markdown, metadados e traduções não são incluídos. Notas com `published: false`
também ficam fora das páginas, dos filtros e dos dados públicos gerados.
As notas antigas sem esse campo mantêm sua visibilidade por compatibilidade.
Rascunhos locais continuam disponíveis no editor. Não guarde documentos ou imagens
confidenciais em `public/`: essa pasta é copiada integralmente para o site.
Este repositório é público: qualquer arquivo enviado ao GitHub pode ser consultado,
mesmo que não entre no build. Mantenha material confidencial fora do repositório,
por exemplo no editor local e em arquivos exportados guardados de forma privada.

Para verificar o isolamento de rascunhos, execute `npm run test:drafts`. O teste
monta uma cópia temporária, gera um build e verifica conteúdo, rotas e filtros.

Ocultar um artigo na lista do painel só afeta esse navegador. Para retirá-lo do
site, remova a entrada correspondente dos metadados e o Markdown no projeto e
publique essa alteração pelo GitHub.

A importação não faz commit, push ou deploy automaticamente. Guarde o arquivo
exportado como cópia portátil: os dados do navegador podem ser apagados pelo
usuário ou pelo próprio navegador.

## Idiomas dos artigos

O idioma padrão da interface pública continua sendo inglês. Cada artigo, porém,
declara seu próprio **idioma original** no editor; novos artigos usam português
como padrão. Título, resumo e corpo original permanecem juntos na mesma entrada
editorial, e as versões em inglês e espanhol pertencem a essa entrada — não há
mais uma tabela global capaz de sobrescrever uma edição recente.

Em cada idioma adicional, preencha título, resumo e corpo. Um rascunho pode ser
guardado enquanto essas versões estão incompletas, mas o editor e o importador
bloqueiam a publicação até que inglês, português e espanhol estejam completos.
A importação cria um Markdown adjacente para cada corpo traduzido, como
`nome-do-artigo.en.md`. O aviso de idioma permanece como proteção para rascunhos e
dados antigos incompletos, mas artigos novos não podem ser publicados nessa condição.

O arquivo `.ot-sec.json` usa atualmente a versão 2 para transportar o idioma
original e todas as traduções. O importador continua aceitando arquivos da versão
1 e os interpreta como artigos originalmente em português.

O painel só confirma “salvo” depois de gravar e conferir os dados no navegador.
Se faltar espaço ou o armazenamento estiver bloqueado, a edição permanece aberta
e pode ser guardada com **Exportar artigo**. Bibliotecas de imagens não são
apagadas automaticamente para liberar espaço. Imagens rasterizadas são reduzidas
antes de entrar na biblioteca; GIFs mantêm a animação e SVGs mantêm o vetor.

Dados antigos são recuperados antes da limpeza. Quando há versões diferentes do
mesmo artigo ou dados inválidos, os originais ficam preservados em chaves de
recuperação ou no armazenamento antigo. **Exportar cópia de todos os dados locais**
baixa uma cópia técnica para recuperação, incluindo esses originais; esse arquivo
pode conter material privado e deve ser guardado fora do repositório público.
Senhas e informações de autenticação não entram nessa cópia.

Evite editar o mesmo conteúdo em várias abas. Se outra aba alterar os dados, o
painel bloqueia a sobrescrita: exporte sua edição antes de recarregar e comparar
as versões. Contadores podem funcionar apenas durante a sessão se o navegador
não permitir sua persistência; isso não impede a leitura do site público.
