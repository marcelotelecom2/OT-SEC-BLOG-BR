# Métricas do painel

O relatório administrativo consulta a propriedade existente do Cloudflare Web Analytics
para ot-sec.blog.br. A coleta existente não é alterada. Os dados antigos de localStorage
são mantidos para compatibilidade e não são apresentados como audiência global.

Configure **CLOUDFLARE_ANALYTICS_TOKEN** como secret de produção no Cloudflare Pages.
Use uma credencial com apenas leitura de Account Analytics, restrita à conta do projeto.
Nunca coloque o valor em variáveis VITE, código, arquivos versionados ou no navegador.
Após configurar, um deployment deve receber o novo secret.

O endpoint GET /api/admin/analytics exige a sessão administrativa e retorna no-store.
Aceita days=1, 7 ou 30. Falhas ou ausência de configuração mostram indisponibilidade,
sem substituir erros por zeros. A consulta usa rumPageloadEventsAdaptiveGroups e a
propriedade e497662b337b4a6ebb3c397563bc10f6 na conta 4729b34deb4cf5a7f8033d8519eaf6ad.

Visitas são entradas conforme a definição da Cloudflare, não pessoas únicas. As métricas
incluem as páginas coletadas pela propriedade, inclusive /admin, sem filtro de bots
adicional. Para comparar no dashboard, use o mesmo período e os mesmos filtros.
Não há IPs, duração média ou rejeição simulados no relatório. A coleta RUM pode ser
bloqueada pelo cliente e o provedor pode usar amostragem e atraso de processamento.

Validação: npm run test:analytics, npm run lint e npm run build. Antes de considerar
a integração ativa, conferir a consulta real após configurar o secret e comparar
com Web Analytics. Os testes simulados não comprovam acesso à API da conta.
