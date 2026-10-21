*Una investigación publicada en octubre de 2026 muestra avances importantes en la capacidad de los modelos de inteligencia artificial para elaborar rutas de ataque contra entornos industriales. Sin embargo, los resultados requieren una interpretación cuidadosa.*

## ¿Qué se investigó?

La empresa **Frenos** publicó el informe *2026: The State of AI in OT Security*, investigando hasta qué punto los modelos de inteligencia artificial pueden ayudar a planificar ataques contra sistemas de Tecnología Operacional (OT).

La investigación evaluó **10 modelos de IA** en diferentes desafíos relacionados con activos industriales, conexiones de red, vulnerabilidades y privilegios de acceso.

En total, se realizaron:

- **16.980 pruebas**;
- Más de **13 mil intentos de decisión**;
- Aproximadamente **2.500 intentos de planificación**;
- Más de **500 observaciones en simulaciones**.

El objetivo era comprobar si los modelos podían identificar secuencias de acciones capaces de alcanzar determinados objetivos en escenarios simulados.

## El principal resultado

Tres de los modelos más avanzados lograron producir planes de ataque válidos en aproximadamente el **90% de los intentos de planificación**.

Este resultado demuestra que la IA ya posee una capacidad significativa para relacionar información técnica y construir rutas de ataque en escenarios estructurados.

Sin embargo, los investigadores también identificaron limitaciones importantes.

Algunos modelos omitieron pasos necesarios, supusieron privilegios inexistentes o produjeron planes inconsistentes.

**La investigación no demostró que estos modelos puedan descubrir, comprometer y atacar de forma autónoma una infraestructura OT real.**

Esta distinción es fundamental: elaborar un plan técnicamente válido en una simulación no equivale a ejecutar un ataque contra sistemas industriales en funcionamiento.

## ¿Qué representa esto para el sector eléctrico?

**Análisis técnico del autor:** En infraestructuras críticas de energía eléctrica, la preocupación no debe centrarse únicamente en la explotación de vulnerabilidades individuales, sino también en la combinación de distintas debilidades de seguridad.

Considérese, por ejemplo, un entorno de subestación con estaciones de ingeniería, sistemas SCADA, HMI y dispositivos de protección y control.

Una ruta de ataque puede depender de diferentes condiciones: acceso inicial, permisos disponibles, comunicación entre redes y ausencia de controles adecuados.

La IA puede ayudar a analizar estas relaciones, reduciendo el esfuerzo necesario para identificar posibles rutas de compromiso.

Esto refuerza la importancia de evaluar **la arquitectura completa del entorno OT**, y no solo la seguridad aislada de cada equipo.

## ¿Qué deben priorizar los defensores?

El informe destaca cuatro líneas de actuación:

1. **Defensa en profundidad:** segmentación de redes, restricción de privilegios, control del acceso remoto y capacidad de recuperación.
2. **Detección y respuesta:** supervisión de autenticaciones, sesiones remotas y cambios no autorizados.
3. **Uso defensivo de la IA:** correlación entre inventario de activos, vulnerabilidades, conectividad y eventos de seguridad, con validación humana.
4. **Análisis contextualizado de la exposición:** evaluación de las rutas de ataque teniendo en cuenta los controles existentes y las condiciones reales de acceso.

Estas recomendaciones son especialmente relevantes para los sistemas eléctricos, en los que cualquier medida de seguridad también debe respetar los requisitos de disponibilidad y continuidad operativa.

## Síntesis

El estudio de Frenos apunta a una evolución importante: **la inteligencia artificial puede hacer que la planificación de ataques contra entornos OT sea más accesible y eficiente.**

Sin embargo, los resultados siguen dependiendo del contexto proporcionado a los modelos, de las condiciones de simulación y de la interpretación humana.

Para el sector eléctrico, la principal reflexión no es si la IA sustituirá a un atacante especializado, sino cómo su uso puede modificar la velocidad y la complejidad de las amenazas.

**La respuesta sigue basándose en una arquitectura segura, controles integrados, visibilidad de los activos y una capacidad efectiva de detección y respuesta.**

## Referencias

1. **Frenos (2026).** *2026: The State of AI in OT Security*. [Consultar la investigación original](https://frenos.io/2026-ai-ot-report).

*Comentario técnico independiente elaborado a partir de los resultados publicados por Frenos. Los porcentajes presentados corresponden a las pruebas realizadas por los investigadores y no representan tasas de éxito de ataques contra infraestructuras eléctricas reales.*
