Depois de apresentar os diferentes tipos de ameaças, a **IEC 62351-1** começa, na seção **5.3**, a organizar alguns conceitos fundamentais de cibersegurança.

A ideia é relacionar **o que precisamos proteger**, **o que pode comprometer essa proteção** e **quais fraquezas podem permitir que isso aconteça**.

## 5.3.1 — Security requirements

A norma apresenta quatro requisitos básicos de segurança:

- **Confidencialidade**
- **Integridade**
- **Disponibilidade**
- **Não repúdio / Accountability**

A **confidencialidade** busca impedir o acesso não autorizado à informação.

A **integridade** procura impedir sua modificação ou apropriação não autorizada.

A **disponibilidade** busca garantir que usuários autorizados tenham acesso à informação e evitar situações de negação de serviço.

Já o **não repúdio ou accountability** está relacionado à capacidade de responsabilizar uma entidade por determinada ação, evitando que uma ação realizada seja posteriormente negada ou que alguém alegue ter realizado uma ação que não ocorreu.

A norma também estabelece uma premissa importante:

> **autorização depende de autenticação.**

Antes de determinar **o que alguém pode fazer**, é necessário estabelecer **quem é esse usuário ou aplicação**.

## 5.3.2 — Security threats

Na sequência, a IEC 62351 apresenta quatro ameaças diretamente relacionadas aos requisitos anteriores:

**Acesso não autorizado à informação**  
→ ameaça à confidencialidade.

**Modificação ou roubo não autorizado de informação**  
→ ameaça à integridade.

**Negação de serviço**  
→ ameaça à disponibilidade.

**Repúdio ou ausência de responsabilização**  
→ ameaça ao não repúdio/accountability.

Mas a norma faz uma observação importante: uma ameaça pode ser concretizada por diferentes vulnerabilidades e diferentes métodos de ataque.

Por isso, proteger um requisito de segurança não significa simplesmente aplicar um único controle.

As contramedidas precisam considerar **como aquela ameaça pode realmente acontecer**.

## 5.3.3 — Security vulnerabilities

A definição de vulnerabilidade apresentada pela IEC 62351 também merece atenção.

Uma vulnerabilidade é uma **fraqueza ou abertura no sistema capaz de permitir que uma ação não autorizada concretize uma ameaça**.

E ela não precisa ser necessariamente um CVE ou uma falha de software.

A norma cita como possíveis origens:

- bugs;
- falhas de projeto;
- falhas de equipamentos;
- ações físicas.

Isso é especialmente importante em OT.

Uma vulnerabilidade pode estar no software, no equipamento, na arquitetura ou até nas condições físicas que envolvem aquele sistema.

Além disso, ela pode existir apenas teoricamente ou já possuir um **exploit conhecido**.

## O principal aprendizado

As seções **5.3.1 a 5.3.3** começam a montar uma sequência lógica:

**Requisito de segurança → Ameaça → Vulnerabilidade**

Primeiro entendemos **o que queremos proteger**.

Depois identificamos **o que pode comprometer esse objetivo**.

E então avaliamos **quais fraquezas podem permitir que essa ameaça se concretize**.

Para cibersegurança OT, existe ainda uma mensagem importante:

> **vulnerabilidade não significa apenas vulnerabilidade de software.**

Falhas de projeto, equipamentos e aspectos físicos também podem criar condições de risco.

Na próxima parte, a IEC 62351 adiciona outro elemento a essa relação:

**5.3.4 — Security attacks**, mostrando como diferentes tipos de ataques podem transformar uma ameaça em um evento real.
