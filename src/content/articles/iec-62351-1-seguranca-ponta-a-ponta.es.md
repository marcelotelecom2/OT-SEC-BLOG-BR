La sección **5.3.5 — Security Categories** de IEC 62351-1 presenta un principio importante para la ciberseguridad de los sistemas eléctricos: **la protección de una sola capa no es suficiente para garantizar la seguridad de toda la infraestructura.**

La norma organiza la ciberseguridad en cuatro categorías complementarias:

1. **Interfaz Hombre-Máquina (HMI):** protección contra accesos no autorizados, suplantación de identidad y uso indebido de privilegios mediante la autenticación y autorización de usuarios.
2. **Aplicaciones de software:** protección contra código malicioso, vulnerabilidades y fallos mediante controles de acceso, pruebas y gestión de actualizaciones.
3. **Protocolos de comunicación:** protección contra interceptación, ataques Man-in-the-Middle, repetición de mensajes y suplantación de identidad mediante cifrado, autenticación y firmas digitales.
4. **Medios de comunicación:** protección contra indisponibilidad, interferencias y fallos en los canales de transmisión mediante control de acceso, redundancia y otros mecanismos de protección.

![IEC 62351-1 — Figura 2: categorías de ciberseguridad, ataques típicos y contramedidas. Figura proporcionada para esta publicación, con etiquetas en inglés.](/images/articles/iec-62351-1-categorias-seguranca-figura-2.png)

## ¿Por qué no basta con proteger solo la comunicación?

La norma utiliza el ejemplo de una **VPN** para ilustrar esta limitación.

Aunque una VPN puede proteger la comunicación entre dispositivos, no impide necesariamente que un usuario suplante a otro o que una aplicación maliciosa, instalada en un ordenador comprometido, utilice el túnel protegido para acceder a equipos de campo.

Por lo tanto, **un canal de comunicación seguro no significa, por sí solo, que los usuarios, las aplicaciones y los dispositivos conectados sean fiables.**

## Síntesis

IEC 62351-1 subraya que la seguridad *end-to-end* depende de la aplicación coordinada de medidas de protección en las cuatro categorías.

Además de implementar controles individuales, es necesario garantizar su integración para evitar que los propios mecanismos de seguridad introduzcan problemas operativos.

En entornos OT, especialmente en infraestructuras críticas de energía eléctrica, este principio pone de manifiesto la importancia de un enfoque integrado que considere tanto la protección cibernética como los requisitos operativos de los sistemas.

## Referencias

1. IEC 62351-1 — Sección 5.3.5, *Security Categories*, Figura 2. [Catálogo oficial de IEC](https://webstore.iec.ch/en/publication/6903).

*Síntesis editorial elaborada a partir de la norma. El contenido no representa una transcripción literal del documento normativo.*
