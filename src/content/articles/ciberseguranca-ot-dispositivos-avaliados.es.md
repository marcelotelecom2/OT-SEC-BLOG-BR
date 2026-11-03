*Un enfoque basado en IEC 62443, IEC 62351, NIST y NERC CIP para identificar activos cibernéticos, superficies de ataque y dependencias físicas en sistemas industriales.*

**¿Un equipo sin Ethernet o dirección IP necesita evaluarse desde la perspectiva de la ciberseguridad? ¿Y un componente hardwired puede formar parte de un escenario de ataque cibernético?**

Estas preguntas son frecuentes en la Ingeniería de Protección y Control (P&C), especialmente en proyectos de subestaciones, sistemas de automatización y equipos FACTS, como SVC, STATCOM y FSC.

Una dificultad recurrente consiste en definir qué componentes de una solución industrial deben someterse a evaluaciones de ciberseguridad. En algunos casos, se excluyen del análisis los dispositivos sin comunicación en red. En otros, todos los componentes electrónicos reciben requisitos de seguridad que no corresponden a sus características o funciones.

Ambos enfoques pueden producir resultados inadecuados.

El desafío consiste en establecer una metodología capaz de identificar los componentes relevantes, comprender sus interfaces y dependencias y determinar la profundidad de la evaluación necesaria.

## 1. La primera decisión no se refiere a los controles de seguridad

Una evaluación de ciberseguridad no debería comenzar verificando si un equipo admite autenticación, cifrado, registros o gestión de usuarios.

Antes de eso, es necesario determinar:

- ¿Cuál es la función del componente dentro de la solución?
- ¿El componente es programable?
- ¿Qué interfaces permiten la interacción, configuración u operación?
- ¿Existe la posibilidad de influir en su comportamiento sin autorización?
- ¿Cuáles serían las consecuencias para el sistema?
- ¿El componente desempeña una función de protección o sostiene una contramedida de seguridad?

Estas preguntas permiten distinguir tres actividades que se confunden con frecuencia.

**Identificación de activos:** reconocer los componentes que pertenecen a la solución y comprender sus funciones.

**Identificación de superficies de ataque:** identificar interfaces, servicios, mecanismos y puntos de interacción que pueden representar oportunidades de compromiso.

**Evaluación de riesgos:** analizar cómo una amenaza podría explotar estas exposiciones, qué consecuencias serían posibles y qué medidas de protección serían necesarias.

La existencia de una superficie de ataque no significa necesariamente que exista una vulnerabilidad explotable.

De igual manera, un componente puede formar parte de un escenario de riesgo sin ser, individualmente, un activo cibernético.

## 2. ¿Cómo abordan el problema las principales normas?

### IEC 62443-3-2 — La evaluación comienza por el sistema

La IEC 62443-3-2:2020, dedicada a la evaluación de riesgos de seguridad en el diseño de sistemas de automatización y control industrial, proporciona una de las principales bases para estructurar esta actividad.

La norma establece requisitos para definir el *System Under Consideration* (SUC), organizar el sistema en zonas y conductos, evaluar riesgos y documentar los requisitos de seguridad.

Su principal contribución a nuestro problema es la necesidad de comprender el sistema antes de determinar sus requisitos de seguridad.

Un dispositivo no debería analizarse de forma aislada solo por sus características tecnológicas. Su función, ubicación, interfaces y dependencias también importan.

Esto es particularmente relevante en los sistemas eléctricos, en los que una función operativa puede involucrar controladores digitales, sensores, circuitos hardwired, relés y dispositivos electromecánicos.

### IEC 62443-4-2 — Requisitos aplicables a los componentes

La IEC 62443-4-2:2019 establece requisitos técnicos de seguridad para cuatro tipos de componentes de sistemas IACS:

1. Software Applications — aplicaciones de software.
2. Embedded Devices — dispositivos embebidos.
3. Host Devices — dispositivos que alojan sistemas operativos y aplicaciones.
4. Network Devices — dispositivos de red.

Esta clasificación ayuda a identificar los requisitos pertinentes a las características del componente.

Un controlador industrial, por ejemplo, puede tratarse como un dispositivo embebido, mientras que una estación Windows puede clasificarse como host device.

Sin embargo, la norma no debe utilizarse como una lista genérica de requisitos que se aplique indiscriminadamente a todos los componentes eléctricos.

La aplicabilidad de cada requisito depende del tipo de componente, las capacidades exigidas y los requisitos de seguridad establecidos para el sistema.

### IEC 62351-1 — La seguridad no se limita a la red

En la sección 5.3.5, *Security Categories*, la IEC 62351-1 presenta cuatro perspectivas complementarias:

- Interfaz hombre-máquina.
- Aplicaciones de software.
- Protocolos de comunicación.
- Medios de comunicación.

La norma destaca la importancia de medidas de seguridad integradas para lograr una protección de extremo a extremo.

El ejemplo de una VPN ilustra esta necesidad: proteger el canal de comunicación no garantiza que el usuario sea legítimo ni que la aplicación conectada esté libre de compromiso.

Estas cuatro categorías ofrecen una referencia útil para examinar diferentes puntos de exposición de componentes y sistemas de energía.

Sin embargo, no constituyen, por sí solas, un procedimiento normativo de clasificación de activos cibernéticos.

### NIST SP 800-82 — La relación entre los sistemas digitales y los procesos físicos

El NIST SP 800-82 Rev. 3, *Guide to Operational Technology (OT) Security*, considera las particularidades de los sistemas OT, incluidas la disponibilidad, confiabilidad, el rendimiento y la seguridad operacional.

Su enfoque contempla sistemas programables que supervisan o controlan procesos físicos, directamente o por medio de otros dispositivos.

Esta perspectiva es especialmente importante para evaluar componentes que, aunque no sean programables, pueden recibir órdenes de sistemas digitales o proporcionarles señales.

El análisis de seguridad necesita comprender la interacción entre el entorno cibernético y el proceso físico.

### NERC CIP — La distinción entre Cyber Asset y BES Cyber Asset

La NERC utiliza definiciones específicas para clasificar activos en el contexto del Bulk Electric System (BES).

En la terminología vigente en octubre de 2026, un *Cyber Asset* corresponde a un dispositivo electrónico programable, incluidos hardware, software y datos.

Por lo tanto, un dispositivo programable no necesita tener una dirección IP para considerarse un Cyber Asset.

Sin embargo, la clasificación como *BES Cyber Asset* exige criterios adicionales relacionados con el impacto sobre la operación confiable del BES, incluido el criterio temporal de 15 minutos definido por la NERC.

La distinción es fundamental: no todo Cyber Asset es un BES Cyber Asset, y no todo componente físicamente importante para una instalación eléctrica es necesariamente un Cyber Asset.

Estas definiciones tienen una aplicación regulatoria específica y no deben generalizarse automáticamente a cualquier instalación industrial.

## 3. Propuesta de metodología para seleccionar dispositivos

A partir de las referencias anteriores, podemos estructurar un proceso de selección inicial destinado a determinar qué componentes necesitan una evaluación de ciberseguridad.

**Etapa 1 — Identificar la función del componente**

Registrar su función operativa, su ubicación en la arquitectura y los sistemas con los que interactúa.

**Etapa 2 — Identificar las características tecnológicas**

Determinar si cuenta con firmware, software, lógica programable, interfaces digitales, mecanismos de actualización o funcionalidades de configuración.

**Etapa 3 — Identificar interfaces y puntos de exposición**

Considerar Ethernet, USB, comunicación serie, comunicación propietaria, interfaces locales de ingeniería y otros mecanismos de interacción.

Para los sistemas OT, también deben considerarse las interfaces con el proceso físico, como las entradas y salidas digitales o analógicas.

**Etapa 4 — Evaluar dependencias y consecuencias**

Determinar si el compromiso de un componente cibernético podría influir en el dispositivo analizado, alterar señales o provocar consecuencias operativas.

**Etapa 5 — Determinar el tratamiento necesario**

Con base en los resultados, el componente podrá remitirse a una evaluación cibernética directa, a una evaluación de interfaces y dependencias o al análisis por disciplinas de ingeniería eléctrica, protección, control o safety.

La decisión deberá documentarse, incluso cuando no sea necesaria una evaluación cibernética detallada.

Esta metodología es una propuesta de aplicación práctica fundamentada en los principios de las normas, y no un procedimiento establecido literalmente por ellas.

## 4. Una clasificación práctica para la Ingeniería P&C

Para facilitar la selección inicial, los componentes pueden distribuirse en cuatro grupos de tratamiento.

| Grupo | Característica | Tratamiento |
|---|---|---|
| A — Activo programable | Firmware, software o lógica programable | Evaluación cibernética directa |
| B — Interfaz o dependencia | Componente o circuito que puede transmitir los efectos de un compromiso | Evaluación de interfaces y escenarios de riesgo |
| C — Componente físico o funcional | Riesgos predominantemente eléctricos, mecánicos o funcionales | Evaluación por la disciplina aplicable |
| D — Sin relevancia cibernética identificada | Sin exposición o dependencia relevante tras la selección inicial | Exclusión justificada de la evaluación detallada |

Estos grupos no sustituyen las definiciones formales de Cyber Asset, BES Cyber Asset ni los tipos de componentes de la IEC 62443-4-2.

Su propósito es organizar la decisión sobre el tratamiento necesario.

## 5. ¿Y los dispositivos hardwired?

Una conexión hardwired es una interconexión física directa, normalmente utilizada para transmitir órdenes, indicaciones o señales eléctricas entre componentes.

Los ejemplos incluyen contactos secos, entradas digitales, salidas digitales, señales analógicas, circuitos de disparo, bloqueos y permisivos.

El hecho de que una conexión sea hardwired no determina automáticamente su clasificación de seguridad.

Considere un controlador programable conectado, mediante una salida digital, a un circuito de mando.

Un actor malicioso que comprometa el controlador podrá, dependiendo de la arquitectura y los controles existentes, modificar el estado de la salida.

La alteración podrá transmitirse al circuito hardwired e influir en una función operativa.

En este escenario, el circuito físico no necesita considerarse un Cyber Asset. Sin embargo, forma parte del camino por el cual las consecuencias del compromiso cibernético pueden alcanzar el proceso.

Es importante distinguir este escenario de la manipulación exclusivamente física de un circuito por un actor con acceso directo a los conductores o terminales.

Ambos casos pueden producir consecuencias similares, pero tienen orígenes, superficies de exposición y contramedidas diferentes.

**Hardwired no significa automáticamente seguro frente a todas las amenazas, del mismo modo que tampoco significa automáticamente cibernético.**

## 6. Componentes no cibernéticos que aún necesitan evaluarse

La clasificación de un componente como no cibernético no concluye necesariamente su análisis.

Considere un enclavamiento electromecánico responsable de impedir una operación en condiciones inadecuadas.

Aunque este mecanismo puede no disponer de software ni conectividad digital, su actuación puede ser esencial para limitar las consecuencias de órdenes indebidas procedentes de un controlador comprometido.

En este caso, la evaluación de ciberseguridad de la solución necesita comprender si el enclavamiento es realmente independiente de la lógica potencialmente comprometida y qué condiciones son necesarias para su actuación.

Situaciones similares pueden involucrar:

- Relés electromecánicos de protección.
- Circuitos hardwired de disparo y bloqueo.
- Sensores analógicos no programables.
- Enclavamientos físicos.
- Dispositivos de protección eléctrica independientes.
- Elementos pasivos que sostienen comunicaciones críticas.

El objetivo no es aplicar políticas de contraseñas, cifrado o hardening a estos componentes.

El objetivo es verificar si desempeñan funciones relevantes para prevenir, propagar o limitar las consecuencias de un incidente cibernético.

Este análisis puede exigir la colaboración entre especialistas en ciberseguridad, Ingeniería P&C, protección eléctrica, confiabilidad y safety.

## 7. La decisión debe fundamentarse en la función y el riesgo

Una metodología eficiente no debe ampliar indiscriminadamente el alcance de la ciberseguridad.

Esto puede generar requisitos innecesarios, elevar costos y aumentar la complejidad de la solución sin proporcionar beneficios correspondientes.

Al mismo tiempo, una evaluación basada exclusivamente en interfaces IP puede dejar de identificar dispositivos programables aislados, interfaces locales de mantenimiento y dependencias relevantes con el proceso físico.

Por eso, la selección inicial debe considerar dos dimensiones complementarias:

**La naturaleza tecnológica del componente:** qué es, cómo funciona y qué interfaces presenta.

**Su papel en el sistema:** qué funciones ejecuta, de qué depende y qué consecuencias pueden derivarse de su manipulación o fallo.

La combinación de estas perspectivas permite establecer una delimitación del alcance técnicamente defendible.

## Conclusión

Determinar qué dispositivos necesitan evaluarse es una de las primeras decisiones de un análisis de ciberseguridad OT.

La IEC 62443-3-2 aporta la evaluación de riesgos orientada al sistema; la IEC 62443-4-2 establece requisitos para tipos específicos de componentes; la IEC 62351-1 presenta categorías complementarias de seguridad para los sistemas de energía; el NIST SP 800-82 considera la interacción entre los sistemas digitales y los procesos físicos; y la NERC CIP ofrece definiciones específicas para activos cibernéticos en el contexto del BES.

Estas referencias permiten desarrollar una metodología que no dependa exclusivamente de la existencia de Ethernet, TCP/IP o conexiones remotas.

**No todo componente de una solución industrial es un activo cibernético. Sin embargo, un componente que no sea cibernético puede seguir siendo relevante para el análisis de riesgos de ciberseguridad de la solución.**

La decisión adecuada no consiste en clasificar todos los equipos como cibernéticos, sino en identificar qué componentes presentan exposición digital, cuáles participan en caminos de influencia sobre el proceso y cuáles deben evaluarse por las demás disciplinas de ingeniería.

En proyectos de subestaciones y sistemas FACTS, esta distinción contribuye a evaluaciones más consistentes, requisitos proporcionales y una mejor integración entre la ciberseguridad y la Ingeniería de Protección y Control.

---

## Referencias

1. IEC 62443-3-2:2020 — *Security for industrial automation and control systems — Security risk assessment for system design*. https://webstore.iec.ch/en/publication/30727
2. IEC 62443-4-2:2019 — *Technical security requirements for IACS components*.
3. IEC 62351-1 — *Power systems management and associated information exchange — Data and communications security*, sección 5.3.5.
4. NIST SP 800-82 Rev. 3 — *Guide to Operational Technology (OT) Security*. https://csrc.nist.gov/pubs/sp/800/82/r3/final
5. NERC — *Glossary of Terms Used in NERC Reliability Standards*. https://www.nerc.com/glossary-of-terms

*Nota técnica: la metodología de selección inicial presentada es una interpretación aplicada de los principios normativos, no un método de clasificación oficialmente prescrito por las organizaciones citadas.*

**OT-SEC Digital Research Lab — Investigación y análisis técnico en ciberseguridad de sistemas industriales e infraestructura crítica de energía eléctrica.**
