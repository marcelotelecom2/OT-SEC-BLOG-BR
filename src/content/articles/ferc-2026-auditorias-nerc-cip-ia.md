**Seção:** Radar OT | Regulation & Compliance

**Fonte:** Federal Energy Regulatory Commission (FERC)

**Publicado pela FERC:** 13 de outubro de 2026

**Referências:** NERC CIP-002, CIP-004, CIP-005, CIP-007, CIP-011 e CIP-013

---

## Introdução

A segurança cibernética de infraestruturas críticas de energia elétrica depende não apenas da implementação de controles técnicos, mas também da identificação correta dos sistemas que precisam ser protegidos.

Em 13 de outubro de 2026, a Federal Energy Regulatory Commission (FERC) publicou o relatório *2026 Lessons Learned from Commission-Led CIP Reliability Audits*, reunindo constatações e recomendações decorrentes de auditorias de conformidade com os requisitos NERC CIP.

O documento apresenta três questões relevantes:

- Atrasos na identificação e classificação de BES Cyber Systems associados a novos recursos de geração.
- Classificação inadequada de sistemas utilizados por empresas afiliadas e prestadores de serviços que exercem funções agregadas de monitoramento e controle.
- Riscos relacionados ao acesso a sistemas críticos e informações protegidas por ferramentas de inteligência artificial.

Embora o relatório tenha como foco entidades submetidas aos requisitos NERC CIP nos Estados Unidos, suas constatações oferecem reflexões importantes para a engenharia de cibersegurança em ambientes OT/ICS.

## 1. A classificação dos sistemas deve refletir sua função real

Um dos principais achados está relacionado ao NERC CIP-002-5.1a, que estabelece critérios para identificação e categorização dos BES Cyber Systems.

A FERC identificou situações em que recursos de geração já estavam em operação comercial, mas seus sistemas cibernéticos ainda não haviam sido devidamente avaliados ou classificados.

Parte desses atrasos estava associada à interpretação incorreta da *Commercial Operation Date* (COD), especialmente em projetos de geração implementados por etapas.

O problema é significativo porque a classificação de impacto estabelece quais requisitos de segurança devem ser aplicados.

Uma classificação incorreta pode resultar na ausência de controles obrigatórios ou na adoção de proteções insuficientes.

**A classificação de um sistema não deve ser tratada apenas como uma atividade documental. Ela representa uma decisão que influencia diretamente a arquitetura e a governança de segurança.**

## 2. Terceirizar a operação não significa transferir a responsabilidade

Outra descoberta importante envolve centros de controle utilizados para supervisionar diferentes instalações de geração.

A FERC identificou duas situações: uma envolvendo empresas afiliadas controladas por uma organização central e outra envolvendo fornecedores responsáveis pelo monitoramento e controle de instalações pertencentes a diferentes operadores.

Individualmente, os operadores classificavam determinados sistemas como Low Impact.

Entretanto, quando consideradas as capacidades agregadas de controle, os sistemas centralizados atendiam aos critérios de Medium Impact.

Isso significa que os controles aplicados poderiam ser insuficientes diante do impacto potencial sobre o Bulk Electric System (BES).

O relatório reforça um princípio importante: a delegação de atividades operacionais não elimina as responsabilidades regulatórias das entidades registradas.

Para a arquitetura OT, a principal reflexão é que a avaliação de segurança precisa considerar não apenas os ativos locais, mas também as funções executadas remotamente e suas dependências operacionais.

## 3. Inteligência artificial entra na discussão sobre acesso a ambientes NERC CIP

Um dos aspectos mais relevantes do relatório é a atenção dedicada à utilização de ferramentas de inteligência artificial em ambientes conectados a sistemas sujeitos aos requisitos CIP.

A FERC utiliza o termo *Super Intelligence (SI)* para incluir ferramentas como chatbots, assistentes digitais e sistemas automatizados de análise.

Essas tecnologias podem trazer benefícios operacionais, especialmente em atividades de análise e automação.

Entretanto, também introduzem questões importantes:

- Quais sistemas uma ferramenta de IA pode acessar?
- Quais permissões são concedidas aos usuários e às aplicações?
- Como identificar as credenciais e contas utilizadas?
- Quais informações podem ser processadas ou compartilhadas externamente?
- Como distinguir atividades automatizadas legítimas de comportamentos maliciosos?

A FERC destaca a necessidade de considerar esses riscos nos processos existentes de gestão de acesso.

O NERC CIP-004-7, especialmente os requisitos R4, R5 e R6, constitui uma referência central para autorização, verificação e revogação de acessos.

O relatório também apresenta recomendações complementares relacionadas à segurança de perímetro (CIP-005), contas de serviço (CIP-007), proteção de informações (CIP-011) e riscos da cadeia de suprimentos (CIP-013).

**Importante:** o relatório não estabelece uma nova proibição ou uma regulamentação específica para utilização de IA. Ele orienta a avaliação dessas tecnologias considerando os requisitos e processos de segurança existentes.

## 4. Implicações para Substations, Transmission e FACTS

Embora os exemplos de classificação apresentados pela FERC estejam associados a sistemas de geração, algumas lições podem ser consideradas na engenharia de subestações, sistemas de transmissão e soluções FACTS, como SVC e STATCOM.

Em arquiteturas OT modernas, diferentes componentes podem participar de uma mesma função operacional: controladores industriais, estações de engenharia, sistemas SCADA, dispositivos de rede e plataformas de acesso remoto.

Essa integração exige compreender os fluxos de comunicação e as permissões existentes entre os sistemas.

Do ponto de vista técnico, quatro aspectos merecem atenção:

**Arquitetura e segmentação:** identificar as conexões e dependências entre redes industriais, sistemas centralizados e plataformas externas.

**Identity and Access Management:** estabelecer mecanismos adequados de autenticação, autorização e controle de privilégios.

**Hardening e rastreabilidade:** identificar contas de serviço, proteger credenciais e manter registros das atividades relevantes.

**Supply Chain Security:** avaliar funcionalidades de inteligência artificial incorporadas aos produtos e serviços de fornecedores, especialmente quando envolvem comunicação externa ou acesso a informações sensíveis.

Esses pontos não significam que instalações FACTS devam receber automaticamente uma determinada classificação NERC CIP.

A aplicabilidade regulatória e a categorização precisam ser avaliadas conforme as funções desempenhadas, as características da instalação e os critérios normativos correspondentes.

## 5. Considerações finais

O relatório da FERC apresenta uma mensagem importante para a segurança cibernética de infraestrutura elétrica: os controles de proteção precisam acompanhar a evolução das arquiteturas e das capacidades operacionais.

A centralização do controle, a participação de terceiros e a introdução de inteligência artificial podem modificar as relações de confiança e os riscos associados aos sistemas.

Para a engenharia OT, a reflexão vai além da conformidade documental.

É necessário compreender quais funções cada componente desempenha, quem pode acessá-lo e quais consequências um comprometimento pode produzir.

A publicação não introduz novos requisitos obrigatórios de NERC CIP, mas reforça a importância de aplicar corretamente os requisitos existentes diante de tecnologias e modelos operacionais em evolução.

**A cibersegurança de sistemas elétricos críticos começa pela compreensão das funções que precisam ser protegidas — e dos acessos capazes de influenciá-las.**

---

### Fonte original

Federal Energy Regulatory Commission (FERC). *2026 Lessons Learned from Commission-Led CIP Reliability Audits*. Office of Electric Reliability, Division of Cyber Security. 13 October 2026.

[Consultar relatório oficial da FERC (PDF)](https://www.ferc.gov/sites/default/files/2026-10/26_Lessons%20Learned_1013.pdf)

*Nota editorial: este artigo apresenta uma síntese técnica e comentários sobre o documento oficial. As implicações para subestações, transmissão e FACTS são interpretações de engenharia e não representam determinações regulatórias específicas da FERC para essas tecnologias.*

*O documento-fonte é um relatório não vinculante da equipe técnica da FERC; seu conteúdo não representa necessariamente a posição da Comissão, de seu presidente ou dos comissários individualmente.*
