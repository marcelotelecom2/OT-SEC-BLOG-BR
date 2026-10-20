## Síntese da norma

*Síntese editorial da IEC 62351-1. Os destaques não são apresentados como transcrições literais; o documento normativo continua sendo a referência.*

Na seção **5.3.4 — Security attacks**, a **IEC 62351-1** reforça uma ideia importante para quem trabalha com cibersegurança em sistemas elétricos e OT:

> **uma ameaça pode ser concretizada por diferentes tipos de ataques.**

Ou seja, não existe uma relação simples e direta entre requisito de segurança, ameaça e ataque.

### Um mesmo ataque pode aparecer em diferentes ameaças

A norma explica que os ataques de segurança formam uma espécie de rede.

Um mesmo tipo de ataque pode estar associado a ameaças diferentes, e uma mesma ameaça pode ser realizada por caminhos diferentes.

Isso significa que, na prática, proteger um requisito de segurança não depende de uma única medida.

Cada tipo de ataque capaz de concretizar uma ameaça precisa ser considerado na definição das contramedidas.

### Não existe relação 1:1

**Leitura do autor:** Esse é provavelmente o principal ponto da seção 5.3.4.

Não existe uma relação de **1 para 1** entre:

- requisito de segurança;
- ameaça;
- ataque.

**Comentário de aplicação do autor:** Por exemplo, uma ameaça à integridade pode surgir por diferentes técnicas. Da mesma forma, um mesmo ataque pode afetar mais de um requisito de segurança, dependendo de como ele é executado.

Por isso, a norma mostra que a proteção não deve ser pensada de forma isolada ou simplificada.

![IEC 62351-1 — Relação entre requisitos de segurança, ameaças e exemplos de ataques.](/images/articles/iec-62351-ataques-esquema.webp)

### A ideia de “chain of attacks”

Outro conceito importante apresentado aqui é o de **cadeia de ataques**.

A IEC 62351 reconhece que uma ameaça pode não se concretizar por uma única ação, mas por uma **sequência de ataques**.

Essa sequência pode:

- envolver diferentes ativos;
- acontecer em etapas;
- ocorrer ao longo do tempo.

## Análise técnica

*Leitura técnica do autor a partir dos conceitos sintetizados; não estabelece exigências normativas adicionais.*

Isso é especialmente relevante em OT, onde um incidente pode começar em um ativo menos crítico e, a partir dele, evoluir até afetar funções mais importantes da operação.

### O que isso significa na prática?

A principal mensagem da seção 5.3.4 é que a análise de risco não deve olhar apenas para ataques isolados.

Ela precisa considerar:

- diferentes caminhos de ataque;
- diferentes vetores;
- a possibilidade de encadeamento entre eventos;
- a necessidade de múltiplas contramedidas.

Em outras palavras, **não basta proteger contra um ataque específico**. É preciso entender como diferentes ataques podem contribuir para a concretização de uma mesma ameaça


## Referências

1. **Especificação técnica** — IEC. *IEC 62351-1 — Introduction to security issues*. [Catálogo oficial](https://webstore.iec.ch/en/publication/6903). A edição consultada não foi informada no artigo; o link identifica o registro no catálogo oficial.
