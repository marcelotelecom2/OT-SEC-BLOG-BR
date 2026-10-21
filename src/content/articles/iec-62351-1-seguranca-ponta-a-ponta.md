A seção **5.3.5 — Security Categories**, da IEC 62351-1, apresenta um princípio importante para a cibersegurança dos sistemas elétricos: **a proteção de uma única camada não é suficiente para garantir a segurança de toda a infraestrutura.**

A norma organiza a cibersegurança em quatro categorias complementares:

1. **Interface Homem-Máquina (HMI):** proteção contra acessos indevidos, falsificação de identidade e uso inadequado de privilégios, por meio de autenticação e autorização de usuários.
2. **Aplicações de software:** proteção contra códigos maliciosos, vulnerabilidades e falhas, utilizando controles de acesso, testes e gerenciamento de atualizações.
3. **Protocolos de comunicação:** proteção contra interceptação, ataques Man-in-the-Middle, repetição de mensagens e falsificação de identidade, utilizando criptografia, autenticação e assinaturas digitais.
4. **Meios de comunicação:** proteção contra indisponibilidade, interferências e falhas nos canais de transmissão, por meio de controle de acesso, redundância e outros mecanismos de proteção.

![IEC 62351-1 — Figura 2: categorias de cibersegurança, ataques típicos e contramedidas. Figura fornecida para esta publicação, com rótulos em inglês.](/images/articles/iec-62351-1-categorias-seguranca-figura-2.png)

## Por que proteger apenas a comunicação não é suficiente?

A norma utiliza o exemplo de uma **VPN** para demonstrar essa limitação.

Embora uma VPN possa proteger a comunicação entre dispositivos, ela não impede necessariamente que um usuário se passe por outro ou que uma aplicação maliciosa, instalada em um computador comprometido, utilize o túnel protegido para acessar equipamentos de campo.

Portanto, **um canal de comunicação seguro não significa, por si só, que os usuários, as aplicações e os dispositivos conectados sejam confiáveis.**

## Síntese

A IEC 62351-1 reforça que a segurança *end-to-end* depende da aplicação coordenada de medidas de proteção nas quatro categorias.

Além de implementar controles individuais, é necessário garantir sua integração, evitando que os próprios mecanismos de segurança introduzam problemas operacionais.

Em ambientes OT, especialmente nas infraestruturas críticas de energia elétrica, esse princípio evidencia a importância de uma abordagem integrada, que considere tanto a proteção cibernética quanto os requisitos operacionais dos sistemas.

## Referências

1. IEC 62351-1 — Seção 5.3.5, *Security Categories*, Figura 2. [Catálogo oficial da IEC](https://webstore.iec.ch/en/publication/6903).

*Síntese editorial elaborada a partir da norma. O conteúdo não representa uma transcrição literal do documento normativo.*
