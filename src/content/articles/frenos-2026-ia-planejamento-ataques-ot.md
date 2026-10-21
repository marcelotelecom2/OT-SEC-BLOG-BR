*Uma pesquisa publicada em outubro de 2026 mostra avanços importantes na capacidade de modelos de inteligência artificial de elaborar caminhos de ataque contra ambientes industriais. Mas os resultados exigem uma interpretação cuidadosa.*

## O que foi pesquisado?

A empresa **Frenos** publicou o relatório *2026: The State of AI in OT Security*, investigando até que ponto modelos de inteligência artificial conseguem auxiliar no planejamento de ataques contra sistemas de Tecnologia Operacional (OT).

A pesquisa avaliou **10 modelos de IA** em diferentes desafios envolvendo ativos industriais, conexões de rede, vulnerabilidades e privilégios de acesso.

Ao todo, foram realizados:

- **16.980 testes**;
- Mais de **13 mil tentativas de decisão**;
- Aproximadamente **2.500 tentativas de planejamento**;
- Mais de **500 observações em simulações**.

O objetivo era verificar se os modelos conseguiam identificar sequências de ações capazes de atingir determinados objetivos em cenários simulados.

## O principal resultado

Três dos modelos mais avançados conseguiram produzir planos de ataque válidos em aproximadamente **90% das tentativas de planejamento**.

Esse resultado demonstra que a IA já apresenta capacidade significativa para relacionar informações técnicas e construir caminhos de ataque em cenários estruturados.

Entretanto, os pesquisadores também identificaram limitações importantes.

Alguns modelos ignoraram etapas necessárias, presumiram privilégios inexistentes ou produziram planos inconsistentes.

**A pesquisa não demonstrou que esses modelos conseguem descobrir, comprometer e atacar autonomamente uma infraestrutura OT real.**

Essa distinção é fundamental: elaborar um plano tecnicamente válido em uma simulação não equivale a executar um ataque contra sistemas industriais em operação.

## O que isso representa para o setor elétrico?

**Análise técnica do autor:** Em infraestruturas críticas de energia elétrica, a preocupação não deve estar apenas na exploração de vulnerabilidades individuais, mas também na combinação de diferentes fraquezas de segurança.

Considere, por exemplo, um ambiente de subestação com estações de engenharia, sistemas SCADA, IHMs e dispositivos de proteção e controle.

Um caminho de ataque pode depender de diferentes condições: acesso inicial, permissões disponíveis, comunicação entre redes e ausência de controles adequados.

A IA pode auxiliar na análise dessas relações, reduzindo o esforço necessário para identificar possíveis caminhos de comprometimento.

Isso reforça a importância de avaliar **a arquitetura completa do ambiente OT**, e não apenas a segurança isolada de cada equipamento.

## O que os defensores devem priorizar?

O relatório destaca quatro direções:

1. **Defesa em profundidade:** segmentação de redes, restrição de privilégios, controle de acesso remoto e capacidade de recuperação.
2. **Detecção e resposta:** monitoramento de autenticações, sessões remotas e alterações não autorizadas.
3. **Uso defensivo da IA:** correlação entre inventário de ativos, vulnerabilidades, conectividade e eventos de segurança, com validação humana.
4. **Análise contextualizada da exposição:** avaliação dos caminhos de ataque considerando os controles existentes e as condições reais de acesso.

Essas recomendações são particularmente relevantes para sistemas elétricos, nos quais qualquer medida de segurança também precisa respeitar os requisitos de disponibilidade e continuidade operacional.

## Síntese

O estudo da Frenos aponta para uma evolução importante: **a inteligência artificial pode tornar o planejamento de ataques contra ambientes OT mais acessível e eficiente.**

Porém, os resultados ainda dependem do contexto fornecido aos modelos, das condições de simulação e da interpretação humana.

Para o setor elétrico, a principal reflexão não é se a IA substituirá um atacante especializado, mas como sua utilização poderá modificar a velocidade e a complexidade das ameaças.

**A resposta continua fundamentada em uma arquitetura segura, controles integrados, visibilidade dos ativos e capacidade efetiva de detecção e resposta.**

## Referências

1. **Frenos (2026).** *2026: The State of AI in OT Security*. [Consultar a pesquisa original](https://frenos.io/2026-ai-ot-report).

*Comentário técnico independente elaborado a partir dos resultados publicados pela Frenos. Os percentuais apresentados correspondem aos testes conduzidos pelos pesquisadores e não representam taxas de sucesso de ataques contra infraestruturas elétricas reais.*
