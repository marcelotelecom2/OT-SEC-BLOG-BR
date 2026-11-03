*Uma abordagem baseada em IEC 62443, IEC 62351, NIST e NERC CIP para identificar ativos cibernéticos, superfícies de ataque e dependências físicas em sistemas industriais.*

**Um equipamento sem Ethernet ou endereço IP precisa ser avaliado sob a perspectiva da cibersegurança? E um componente hardwired pode fazer parte de um cenário de ataque cibernético?**

Essas questões são frequentes na Engenharia de Proteção e Controle (P&C), especialmente em projetos de subestações, sistemas de automação e equipamentos FACTS, como SVC, STATCOM e FSC.

Uma dificuldade recorrente está em definir quais componentes de uma solução industrial devem ser submetidos a avaliações de cibersegurança. Em alguns casos, dispositivos sem comunicação em rede são excluídos da análise. Em outros, todos os componentes eletrônicos acabam recebendo requisitos de segurança que não correspondem às suas características ou funções.

Ambas as abordagens podem produzir resultados inadequados.

O desafio consiste em estabelecer uma metodologia capaz de identificar os componentes relevantes, compreender suas interfaces e dependências e determinar a profundidade da avaliação necessária.

## 1. A primeira decisão não é sobre controles de segurança

Uma avaliação de cibersegurança não deveria começar verificando se determinado equipamento suporta autenticação, criptografia, logs ou gerenciamento de usuários.

Antes disso, é necessário determinar:

- Qual é a função do componente dentro da solução?
- O componente é programável?
- Quais interfaces permitem interação, configuração ou operação?
- Existe possibilidade de influenciar seu comportamento de forma não autorizada?
- Quais seriam as consequências para o sistema?
- O componente desempenha uma função de proteção ou sustenta uma contramedida de segurança?

Essas questões permitem distinguir três atividades que frequentemente são confundidas.

**Identificação de ativos:** reconhecer os componentes pertencentes à solução e compreender suas funções.

**Identificação de superfícies de ataque:** identificar interfaces, serviços, mecanismos e pontos de interação que podem representar oportunidades de comprometimento.

**Avaliação de riscos:** analisar como uma ameaça poderia explorar essas exposições, quais consequências seriam possíveis e quais medidas de proteção seriam necessárias.

A existência de uma superfície de ataque não significa necessariamente que exista uma vulnerabilidade explorável.

Da mesma forma, um componente pode fazer parte de um cenário de risco sem ser, individualmente, um ativo cibernético.

## 2. Como as principais normas abordam o problema?

### IEC 62443-3-2 — A avaliação começa pelo sistema

A IEC 62443-3-2:2020, dedicada à avaliação de riscos de segurança no projeto de sistemas de automação e controle industrial, fornece uma das principais bases para estruturar essa atividade.

A norma estabelece requisitos para definir o *System Under Consideration* (SUC), organizar o sistema em zonas e conduítes, avaliar riscos e documentar requisitos de segurança.

A principal contribuição para nosso problema é a necessidade de compreender o sistema antes de determinar seus requisitos de segurança.

Um dispositivo não deveria ser analisado isoladamente apenas por suas características tecnológicas. Sua função, localização, interfaces e dependências também importam.

Isso é particularmente relevante em sistemas de potência, nos quais uma função operacional pode envolver controladores digitais, sensores, circuitos hardwired, relés e dispositivos eletromecânicos.

### IEC 62443-4-2 — Requisitos aplicáveis aos componentes

A IEC 62443-4-2:2019 estabelece requisitos técnicos de segurança para quatro tipos de componentes de sistemas IACS:

1. Software Applications — aplicações de software.
2. Embedded Devices — dispositivos embarcados.
3. Host Devices — dispositivos que hospedam sistemas operacionais e aplicações.
4. Network Devices — dispositivos de rede.

Essa classificação ajuda a identificar os requisitos pertinentes às características do componente.

Um controlador industrial, por exemplo, pode ser tratado como dispositivo embarcado, enquanto uma estação Windows pode ser enquadrada como host device.

Entretanto, a norma não deve ser utilizada como uma lista genérica de requisitos a ser aplicada indiscriminadamente a todos os componentes elétricos.

A aplicabilidade de cada requisito depende do tipo de componente, das capacidades exigidas e dos requisitos de segurança estabelecidos para o sistema.

### IEC 62351-1 — A segurança não está restrita à rede

Na seção 5.3.5, *Security Categories*, a IEC 62351-1 apresenta quatro perspectivas complementares:

- Interface homem-máquina.
- Aplicações de software.
- Protocolos de comunicação.
- Meios de comunicação.

A norma ressalta a importância de medidas de segurança integradas para alcançar uma proteção de ponta a ponta.

O exemplo de uma VPN ilustra essa necessidade: proteger o canal de comunicação não garante que o usuário seja legítimo ou que a aplicação conectada esteja livre de comprometimento.

Essas quatro categorias oferecem uma referência útil para examinar diferentes pontos de exposição de componentes e sistemas de energia.

Contudo, não constituem, por si só, um procedimento normativo de classificação de ativos cibernéticos.

### NIST SP 800-82 — A relação entre sistemas digitais e processos físicos

O NIST SP 800-82 Rev. 3, *Guide to Operational Technology (OT) Security*, considera as particularidades dos sistemas OT, incluindo disponibilidade, confiabilidade, desempenho e segurança operacional.

Sua abordagem contempla sistemas programáveis que monitoram ou controlam processos físicos, diretamente ou por meio de outros dispositivos.

Essa perspectiva é especialmente importante na avaliação de componentes que, embora não sejam programáveis, podem receber comandos ou fornecer sinais para sistemas digitais.

A análise de segurança precisa compreender a interação entre o ambiente cibernético e o processo físico.

### NERC CIP — A distinção entre Cyber Asset e BES Cyber Asset

A NERC utiliza definições específicas para a classificação de ativos no contexto do Bulk Electric System (BES).

Na terminologia vigente em outubro de 2026, um *Cyber Asset* corresponde a um dispositivo eletrônico programável, incluindo hardware, software e dados.

Portanto, um dispositivo programável não precisa possuir endereço IP para ser considerado Cyber Asset.

Entretanto, a classificação como *BES Cyber Asset* exige critérios adicionais relacionados ao impacto sobre a operação confiável do BES, incluindo o critério temporal de 15 minutos definido pela NERC.

A distinção é fundamental: nem todo Cyber Asset é um BES Cyber Asset, e nem todo componente fisicamente importante para uma instalação elétrica é necessariamente um Cyber Asset.

Essas definições possuem aplicação regulatória específica e não devem ser generalizadas automaticamente a qualquer instalação industrial.

## 3. Proposta de metodologia para seleção de dispositivos

A partir das referências anteriores, podemos estruturar um processo de triagem destinado a determinar quais componentes precisam de avaliação de cibersegurança.

**Etapa 1 — Identificar a função do componente**

Registrar a função operacional, sua localização na arquitetura e os sistemas com os quais interage.

**Etapa 2 — Identificar características tecnológicas**

Determinar se possui firmware, software, lógica programável, interfaces digitais, mecanismos de atualização ou funcionalidades de configuração.

**Etapa 3 — Identificar interfaces e pontos de exposição**

Considerar Ethernet, USB, serial, comunicação proprietária, interfaces locais de engenharia e outros mecanismos de interação.

Para sistemas OT, também devem ser consideradas as interfaces com o processo físico, como entradas e saídas digitais ou analógicas.

**Etapa 4 — Avaliar dependências e consequências**

Determinar se o comprometimento de um componente cibernético poderia influenciar o dispositivo analisado, alterar sinais ou provocar consequências operacionais.

**Etapa 5 — Determinar o tratamento necessário**

Com base nos resultados, o componente poderá ser encaminhado à avaliação cibernética direta, à avaliação de interfaces e dependências ou à análise por disciplinas de engenharia elétrica, proteção, controle ou safety.

A decisão deverá ser documentada, inclusive quando não houver necessidade de avaliação cibernética detalhada.

Essa metodologia é uma proposta de aplicação prática fundamentada nos princípios das normas, e não um procedimento literalmente estabelecido por elas.

## 4. Uma classificação prática para a Engenharia P&C

Para facilitar a triagem, os componentes podem ser distribuídos em quatro grupos de tratamento.

| Grupo | Característica | Tratamento |
|---|---|---|
| A — Ativo programável | Firmware, software ou lógica programável | Avaliação cibernética direta |
| B — Interface ou dependência | Componente ou circuito que pode transmitir efeitos de comprometimento | Avaliação de interfaces e cenários de risco |
| C — Componente físico ou funcional | Riscos predominantemente elétricos, mecânicos ou funcionais | Avaliação pela disciplina aplicável |
| D — Sem relevância cibernética identificada | Sem exposição ou dependência relevante após triagem | Exclusão justificada da avaliação detalhada |

Esses grupos não substituem as definições formais de Cyber Asset, BES Cyber Asset ou os tipos de componentes da IEC 62443-4-2.

Seu propósito é organizar a decisão sobre o tratamento necessário.

## 5. E os dispositivos hardwired?

Uma conexão hardwired é uma interligação física direta, normalmente utilizada para transmitir comandos, indicações ou sinais elétricos entre componentes.

Exemplos incluem contatos secos, entradas digitais, saídas digitais, sinais analógicos, circuitos de trip, bloqueios e permissivos.

O fato de uma conexão ser hardwired não determina automaticamente sua classificação de segurança.

Considere um controlador programável conectado, por uma saída digital, a um circuito de comando.

Um agente malicioso que comprometa o controlador poderá, dependendo da arquitetura e dos controles existentes, modificar a condição da saída.

A alteração poderá ser transmitida ao circuito hardwired e influenciar uma função operacional.

Nesse cenário, o circuito físico não precisa ser considerado um Cyber Asset. Entretanto, faz parte do caminho pelo qual as consequências do comprometimento cibernético podem alcançar o processo.

É importante distinguir esse cenário da manipulação exclusivamente física de um circuito por um agente com acesso direto aos condutores ou terminais.

Os dois casos podem produzir consequências semelhantes, mas possuem origens, superfícies de exposição e contramedidas distintas.

**Hardwired não significa automaticamente seguro contra todas as ameaças, assim como não significa automaticamente cibernético.**

## 6. Componentes não cibernéticos que ainda precisam ser avaliados

A classificação de um componente como não cibernético não encerra necessariamente sua análise.

Considere um intertravamento eletromecânico responsável por impedir uma operação em condição inadequada.

Embora esse mecanismo possa não possuir software nem conectividade digital, sua atuação pode ser essencial para limitar as consequências de comandos indevidos provenientes de um controlador comprometido.

Nesse caso, a avaliação de cibersegurança da solução precisa compreender se o intertravamento é realmente independente da lógica potencialmente comprometida e quais condições são necessárias para sua atuação.

Situações semelhantes podem envolver:

- Relés eletromecânicos de proteção.
- Circuitos hardwired de trip e bloqueio.
- Sensores analógicos não programáveis.
- Intertravamentos físicos.
- Dispositivos de proteção elétrica independentes.
- Elementos passivos que sustentam comunicações críticas.

O objetivo não é aplicar políticas de senha, criptografia ou hardening a esses componentes.

O objetivo é verificar se eles desempenham funções relevantes para a prevenção, propagação ou limitação de consequências de um incidente cibernético.

Essa análise pode exigir colaboração entre especialistas em cibersegurança, Engenharia P&C, proteção elétrica, confiabilidade e safety.

## 7. A decisão deve ser fundamentada na função e no risco

Uma metodologia eficiente não deve ampliar indiscriminadamente o escopo da cibersegurança.

Isso pode gerar requisitos desnecessários, elevar custos e aumentar a complexidade da solução sem proporcionar benefícios correspondentes.

Ao mesmo tempo, uma avaliação baseada exclusivamente em interfaces IP pode deixar de identificar dispositivos programáveis isolados, interfaces locais de manutenção e dependências relevantes com o processo físico.

Por isso, a triagem deve considerar duas dimensões complementares:

**A natureza tecnológica do componente:** o que ele é, como funciona e quais interfaces apresenta.

**Seu papel no sistema:** quais funções executa, de que depende e quais consequências podem decorrer de sua manipulação ou falha.

A combinação dessas perspectivas permite estabelecer uma delimitação de escopo tecnicamente defensável.

## Conclusão

Determinar quais dispositivos precisam ser avaliados é uma das primeiras decisões de uma análise de cibersegurança OT.

A IEC 62443-3-2 contribui com a avaliação de riscos orientada ao sistema; a IEC 62443-4-2 estabelece requisitos para tipos específicos de componentes; a IEC 62351-1 apresenta categorias complementares de segurança para os sistemas de energia; o NIST SP 800-82 considera a interação entre sistemas digitais e processos físicos; e a NERC CIP oferece definições específicas para ativos cibernéticos no contexto do BES.

Essas referências permitem desenvolver uma metodologia que não dependa exclusivamente da existência de Ethernet, TCP/IP ou conexões remotas.

**Nem todo componente de uma solução industrial é um ativo cibernético. Entretanto, um componente que não seja cibernético pode continuar sendo relevante para a análise de riscos de cibersegurança da solução.**

A decisão adequada não consiste em classificar todos os equipamentos como cibernéticos, mas em identificar quais componentes possuem exposição digital, quais participam de caminhos de influência sobre o processo e quais devem ser avaliados pelas demais disciplinas de engenharia.

Em projetos de subestações e sistemas FACTS, essa distinção contribui para avaliações mais consistentes, requisitos proporcionais e melhor integração entre cibersegurança e Engenharia de Proteção e Controle.

---

## Referências

1. IEC 62443-3-2:2020 — *Security for industrial automation and control systems — Security risk assessment for system design*. https://webstore.iec.ch/en/publication/30727
2. IEC 62443-4-2:2019 — *Technical security requirements for IACS components*.
3. IEC 62351-1 — *Power systems management and associated information exchange — Data and communications security*, seção 5.3.5.
4. NIST SP 800-82 Rev. 3 — *Guide to Operational Technology (OT) Security*. https://csrc.nist.gov/pubs/sp/800/82/r3/final
5. NERC — *Glossary of Terms Used in NERC Reliability Standards*. https://www.nerc.com/glossary-of-terms

*Nota técnica: a metodologia de triagem apresentada é uma interpretação aplicada dos princípios normativos, não um método de classificação oficialmente prescrito pelas organizações citadas.*

**OT-SEC Digital Research Lab — Pesquisa e análise técnica em cibersegurança de sistemas industriais e infraestrutura crítica de energia elétrica.**
