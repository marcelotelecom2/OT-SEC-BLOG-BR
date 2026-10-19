## O que o CIP-002 realmente classifica?

O CIP-002 não classifica dispositivos simplesmente por serem CLPs, IHMs, servidores, firewalls ou sistemas de proteção.

**O processo começa com a compreensão da função do ativo.**

Na rede de energia elétrica em massa da América do Norte, a confiabilidade é regida pelos padrões de Proteção de Infraestrutura Crítica (CIP) da North American Electric Reliability Corporation (NERC). A norma CIP-002-5.1a (e revisões subsequentes) estabelece a metodologia fundamental para identificação e categorização de ativos.

### Hierarquia de classificação principal

Para definir o escopo adequado dos controles de segurança, os engenheiros devem passar por cinco conceitos fundamentais:

- **Entidade Responsável**: A organização registrada (Proprietário do Gerador, Operador de Transmissão, Autoridade de Balanceamento) responsável pela conformidade.
- **BES (Bulk Electric System)**: Todos os elementos de transmissão operando a 100 kV ou superior e instalações de geração de energia real que excedem os limites regionais de MVA.
- **BES Cyber ​​Asset (BCA)**: Dispositivo eletrónico programável que, se comprometido ou indisponível, afetaria a operação fiável em tempo real de 15 minutos do BES.
- **BES Cyber ​​System (BCS)**: Um ou mais BES Cyber ​​Assets agrupados lógica ou fisicamente para desempenhar uma ou mais funções de fiabilidade.
- **Classificação de Impacto**: O nível final (Alto, Médio ou Baixo) atribuído ao sistema com base em critérios quantitativos definidos no Anexo 1 da norma.

> O tipo de equipamento por si só não determina a Classificação de Impacto. A questão fundamental é sempre: *qual a consequência para a Interconexão se este sistema falhar ou for subvertido em tempo real?*

---

## Matriz de Categorização de Impacto

O Anexo 1 do CIP-002 fornece limites quantitativos explícitos para evitar determinações subjetivas:

| Nível de impacto | Instalações e sistemas típicos | Critérios de limite |
| :--- | :--- | :--- |
| **Alto Impacto** | Centros de Controle para grandes Autoridades de Balanceamento e Coordenadores de Confiabilidade | Grande impacto na fiabilidade da interligação (por exemplo, controlo de despacho de produção >3 000 MW) |
| **Impacto Médio** | Centrais de geração, grandes subestações de transmissão | Capacidade agregada de geração >1.500 MW, ou subestações de transmissão >=500 kV ou >=3.000 MVA |
| **Baixo Impacto** | Subestações de distribuição, pequenos parques solares/eólicos | Todos os restantes Cibersistemas BES não classificados como Alto ou Médio |

---

## Arquitetura de Subestação e Perímetro de Segurança Eletrônica

Um erro crítico nos preparativos de auditoria de TO é não distinguir entre o **Perímetro de Segurança Física (PSP)** e o **Perímetro de Segurança Eletrônica (ESP)**:

```
+--------------------------------------------------------------+
| Physical Security Perimeter (PSP)                            |
|  +--------------------------------------------------------+  |
|  | Electronic Security Perimeter (ESP)                    |  |
|  |   [RTU / Gateway] <---> [Substation LAN / IEC 61850]   |  |
|  |          ^                         ^                   |  |
|  |          |                         |                   |  |
|  |   [Protection Relays]     [Bay Controllers]            |  |
|  +--------------------------------------------------------+  |
|         | Electronic Access Control or Monitoring (EACM)     |
|   [Firewall / Dial-up Encryptor]                             |
+--------------------------------------------------------------+
```

### Principais conclusões para engenheiros de segurança industrial

1. **A regra dos 15 minutos**: Se um ativo puder falhar sem afetar as funções de confiabilidade do BES dentro de uma janela de 15 minutos, geralmente não é um ativo cibernético do BES.
2. **Ativos cibernéticos transitórios (TCAs)**: laptops, conjuntos de testes e unidades de manutenção USB estão sujeitos aos controles CIP-010 sempre que cruzam a barreira ESP.
3. **Obrigações de Baixo Impacto**: Nunca presuma que Baixo Impacto significa "sem segurança". O Anexo 1 do CIP-003 exige conscientização sobre segurança cibernética, controles de acesso físico, controles de acesso eletrônico e planejamento de resposta a incidentes para todos os ativos de baixo impacto.
