Después de presentar los diferentes tipos de amenazas, **IEC 62351-1** comienza, en el apartado **5.3**, a organizar algunos conceptos fundamentales de ciberseguridad.

La idea es relacionar **qué necesitamos proteger**, **qué podría comprometer esta protección** y **qué debilidades podrían permitir que esto suceda**.

## 5.3.1 — Requisitos de seguridad

La norma presenta cuatro requisitos básicos de seguridad:

- **Confidencialidad**
- **Integridad**
- **Disponibilidad**
- **No repudio / Responsabilidad**

**confidencialidad** busca evitar el acceso no autorizado a la información.

**integridad** busca evitar modificaciones o apropiaciones no autorizadas.

**disponibilidad** busca garantizar que los usuarios autorizados tengan acceso a la información y evitar situaciones de denegación de servicio.

**El no repudio o rendición de cuentas** se relaciona con la capacidad de responsabilizar a una entidad por una determinada acción, evitando que luego se niegue una acción realizada o que alguien afirme haber realizado una acción que no ocurrió.

La norma también establece una premisa importante:

> **la autorización depende de la autenticación.**

Antes de determinar **qué puede hacer alguien**, es necesario establecer **quién es ese usuario o aplicación**.

## 5.3.2 — Amenazas a la seguridad

A continuación, IEC 62351 presenta cuatro amenazas directamente relacionadas con los requisitos anteriores:

**Acceso no autorizado a la información**
→ amenaza a la confidencialidad.

**Modificación no autorizada o robo de información**
→ amenaza a la integridad.

**Denegación de servicio**
→ amenaza a la disponibilidad.

**Repudio o falta de rendición de cuentas**
→ amenaza al no repudio/rendición de cuentas.

Pero el estándar hace una observación importante: una amenaza puede materializarse mediante diferentes vulnerabilidades y diferentes métodos de ataque.

Por tanto, proteger un requisito de seguridad no significa simplemente aplicar un control único.

Las contramedidas deben considerar **cómo podría ocurrir realmente esa amenaza**.

## 5.3.3 — Vulnerabilidades de seguridad

También merece atención la definición de vulnerabilidad presentada por IEC 62351.

Una vulnerabilidad es una **debilidad o apertura en el sistema capaz de permitir que una acción no autorizada materialice una amenaza**.

Y no necesariamente tiene que ser un CVE o una falla de software.

La norma cita los siguientes como posibles orígenes:

- insectos;
- defectos de diseño;
- fallas de equipos;
- acciones físicas.

Esto es especialmente importante en OT.

Una vulnerabilidad puede estar en el software, el equipo, la arquitectura o incluso las condiciones físicas que rodean ese sistema.

Además, es posible que solo exista teóricamente o que ya tenga un **exploit conocido**.

## El aprendizaje principal

Las secciones **5.3.1 a 5.3.3** comienzan a ensamblar una secuencia lógica:

**Requisito de seguridad → Amenaza → Vulnerabilidad**

Primero entendemos **qué queremos proteger**.

Luego identificamos **qué podría comprometer este objetivo**.

Y luego evaluamos **qué debilidades podrían permitir que esta amenaza se materialice**.

Para la ciberseguridad OT, todavía queda un mensaje importante:

> **vulnerabilidad no significa solo vulnerabilidad del software.**

Los defectos de diseño, equipamiento y aspectos físicos también pueden crear condiciones de riesgo.

En la siguiente parte, IEC 62351 añade otro elemento a esta relación:

**5.3.4 — Ataques de seguridad**, que muestra cómo los diferentes tipos de ataques pueden transformar una amenaza en un evento real.
