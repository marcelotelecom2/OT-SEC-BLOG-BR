**Sección:** Radar OT | Regulación y cumplimiento

**Fuente:** Federal Energy Regulatory Commission (FERC)

**Publicado por la FERC:** 13 de octubre de 2026

**Referencias:** NERC CIP-002, CIP-004, CIP-005, CIP-007, CIP-011 y CIP-013

---

## Introducción

La ciberseguridad de las infraestructuras críticas de energía eléctrica depende no solo de la implementación de controles técnicos, sino también de la identificación correcta de los sistemas que necesitan protección.

El 13 de octubre de 2026, la Federal Energy Regulatory Commission (FERC) publicó el informe técnico *2026 Lessons Learned from Commission-Led CIP Reliability Audits*, que reúne hallazgos y recomendaciones de auditorías de cumplimiento de los requisitos NERC CIP.

El documento presenta tres cuestiones relevantes:

- Retrasos en la identificación y categorización de BES Cyber Systems asociados a nuevos recursos de generación.
- Categorización inadecuada de sistemas utilizados por empresas afiliadas y proveedores de servicios que realizan funciones agregadas de supervisión y control.
- Riesgos relacionados con el acceso de herramientas de inteligencia artificial a sistemas críticos e información protegida.

Aunque el informe se centra en entidades sujetas a los requisitos NERC CIP en Estados Unidos, sus hallazgos ofrecen reflexiones importantes para la ingeniería de ciberseguridad en entornos OT/ICS.

## 1. La categorización de los sistemas debe reflejar su función real

Uno de los principales hallazgos se relaciona con NERC CIP-002-5.1a, que establece criterios para identificar y categorizar BES Cyber Systems.

El equipo técnico de la FERC identificó situaciones en las que los recursos de generación ya estaban en operación comercial, pero sus sistemas cibernéticos aún no habían sido evaluados o categorizados adecuadamente.

Parte de estos retrasos se asociaba a una interpretación incorrecta de la *Commercial Operation Date* (COD), especialmente en proyectos de generación implementados por etapas.

El problema es significativo porque la categorización de impacto determina qué requisitos de seguridad deben aplicarse.

Una categorización incorrecta puede provocar la ausencia de controles obligatorios o la adopción de protecciones insuficientes.

**La categorización de un sistema no debe tratarse únicamente como una actividad documental. Representa una decisión que influye directamente en la arquitectura y la gobernanza de la seguridad.**

## 2. Externalizar la operación no significa transferir la responsabilidad

Otro hallazgo importante afecta a centros de control utilizados para supervisar diferentes instalaciones de generación.

El equipo de la FERC identificó dos situaciones: una relacionada con empresas afiliadas controladas por una organización matriz, y otra con proveedores responsables de supervisar y controlar instalaciones pertenecientes a distintos operadores.

Individualmente, los operadores categorizaban determinados sistemas como Low Impact.

Sin embargo, al considerar las capacidades agregadas de control, los sistemas centralizados cumplían los criterios de Medium Impact.

Esto significa que los controles aplicados podían resultar insuficientes frente al impacto potencial sobre el Bulk Electric System (BES).

El informe refuerza un principio importante: delegar actividades operativas no elimina las responsabilidades regulatorias de las entidades registradas.

Para la arquitectura OT, la principal reflexión es que la evaluación de seguridad debe considerar tanto los activos locales como las funciones realizadas a distancia y sus dependencias operativas.

## 3. La inteligencia artificial entra en el debate sobre el acceso a entornos NERC CIP

Uno de los aspectos más relevantes del informe es la atención dedicada al uso de herramientas de inteligencia artificial en entornos conectados a sistemas sujetos a los requisitos CIP.

El equipo de la FERC utiliza el término *Super Intelligence (SI)* para incluir herramientas como chatbots, asistentes digitales y sistemas automatizados de análisis.

Estas tecnologías pueden aportar beneficios operativos, especialmente en actividades de análisis y automatización.

Sin embargo, también plantean cuestiones importantes:

- ¿A qué sistemas puede acceder una herramienta de IA?
- ¿Qué permisos se conceden a usuarios y aplicaciones?
- ¿Cómo identificar las credenciales y cuentas utilizadas?
- ¿Qué información puede procesarse o compartirse externamente?
- ¿Cómo distinguir actividades automatizadas legítimas de comportamientos maliciosos?

El equipo de la FERC destaca la necesidad de considerar estos riesgos en los procesos existentes de gestión del acceso.

NERC CIP-004-7, especialmente los requisitos R4, R5 y R6, constituye una referencia central para autorizar, verificar y revocar accesos.

El informe también presenta recomendaciones complementarias sobre seguridad del perímetro (CIP-005), cuentas de servicio (CIP-007), protección de la información (CIP-011) y riesgos de la cadena de suministro (CIP-013).

**Importante:** el informe no establece una nueva prohibición ni una regulación específica para el uso de IA. Recomienda evaluar estas tecnologías teniendo en cuenta los requisitos y procesos de seguridad existentes.

## 4. Implicaciones para subestaciones, transmisión y FACTS

Aunque los ejemplos de categorización presentados por el equipo de la FERC se refieren a sistemas de generación, algunas lecciones pueden considerarse en la ingeniería de subestaciones, sistemas de transmisión y soluciones FACTS, como SVC y STATCOM.

En las arquitecturas OT modernas, distintos componentes pueden participar en una misma función operativa: controladores industriales, estaciones de ingeniería, sistemas SCADA, dispositivos de red y plataformas de acceso remoto.

Esta integración exige comprender los flujos de comunicación y los permisos existentes entre los sistemas.

Desde el punto de vista técnico, cuatro aspectos merecen atención:

**Arquitectura y segmentación:** identificar las conexiones y dependencias entre redes industriales, sistemas centralizados y plataformas externas.

**Gestión de identidades y accesos:** establecer mecanismos adecuados de autenticación, autorización y control de privilegios.

**Hardening y trazabilidad:** identificar cuentas de servicio, proteger credenciales y mantener registros de las actividades relevantes.

**Seguridad de la cadena de suministro:** evaluar las funcionalidades de IA incorporadas a productos y servicios de proveedores, especialmente cuando impliquen comunicación externa o acceso a información sensible.

Estos puntos no significan que las instalaciones FACTS deban recibir automáticamente una determinada categorización NERC CIP.

La aplicabilidad regulatoria y la categorización deben evaluarse según las funciones realizadas, las características de la instalación y los criterios normativos correspondientes.

## 5. Consideraciones finales

El informe técnico de la FERC presenta un mensaje importante para la ciberseguridad de la infraestructura eléctrica: los controles de protección deben acompañar la evolución de las arquitecturas y las capacidades operativas.

La centralización del control, la participación de terceros y la introducción de IA pueden modificar las relaciones de confianza y los riesgos asociados a los sistemas.

Para la ingeniería OT, la reflexión va más allá del cumplimiento documental.

Es necesario comprender qué funciones desempeña cada componente, quién puede acceder a él y qué consecuencias podría producir un compromiso.

La publicación no introduce nuevos requisitos obligatorios NERC CIP, sino que refuerza la importancia de aplicar correctamente los requisitos existentes ante tecnologías y modelos operativos en evolución.

**La ciberseguridad de los sistemas eléctricos críticos comienza por comprender las funciones que deben protegerse — y los accesos capaces de influir en ellas.**

---

### Fuente original

Federal Energy Regulatory Commission (FERC). *2026 Lessons Learned from Commission-Led CIP Reliability Audits*. Office of Electric Reliability, Division of Cyber Security. 13 de octubre de 2026.

[Consultar el informe técnico oficial de la FERC (PDF)](https://www.ferc.gov/sites/default/files/2026-10/26_Lessons%20Learned_1013.pdf)

*Nota editorial: este artículo presenta una síntesis técnica y comentarios sobre el documento oficial. Las implicaciones para subestaciones, transmisión y FACTS son interpretaciones de ingeniería y no representan determinaciones regulatorias específicas de la FERC para estas tecnologías. La fuente es un informe técnico no vinculante cuyo contenido no representa necesariamente las opiniones de la Comisión, su presidente o sus comisionados individuales.*
