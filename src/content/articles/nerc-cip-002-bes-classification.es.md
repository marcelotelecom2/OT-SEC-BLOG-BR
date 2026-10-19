## ¿Qué clasifica realmente CIP-002?

CIP-002 no clasifica los dispositivos simplemente porque son PLC, HMI, servidores, firewalls o sistemas de protección.

**El proceso comienza con la comprensión del papel del activo.**

En la red eléctrica masiva de América del Norte, la confiabilidad se rige por los estándares de Protección de Infraestructura Crítica (CIP) de la Corporación de Confiabilidad Eléctrica de América del Norte (NERC). La norma CIP-002-5.1a (y revisiones posteriores) establece la metodología fundamental para la identificación y categorización de activos.

### Jerarquía de clasificación principal

Para determinar el alcance adecuado de los controles de seguridad, los ingenieros deben analizar cinco conceptos fundamentales:

- **Entidad Responsable**: La organización registrada (Propietario del Generador, Operador de Transmisión, Autoridad de Balanceo) responsable del cumplimiento.
- **BES (Sistema Eléctrico a Granel)**: Todos los elementos de transmisión que operan a 100 kV o más, e instalaciones de generación de energía real que exceden los umbrales regionales de MVA.
- **BES Cyber ​​Asset (BCA)**: Un dispositivo electrónico programable que, si se ve comprometido o no está disponible, afectaría la operación confiable en tiempo real de 15 minutos del BES.
- **BES Cyber ​​System (BCS)**: Uno o más BES Cyber ​​Assets agrupados lógica o físicamente para realizar una o más funciones de confiabilidad.
- **Clasificación de impacto**: el nivel final (Alto, Medio o Bajo) asignado al sistema según los criterios cuantitativos definidos en el Anexo 1 del estándar.

> El tipo de equipo por sí solo no determina la clasificación de impacto. La pregunta fundamental es siempre: *¿cuál es la consecuencia para la Interconexión si este sistema falla o se subvierte en tiempo real?*

---

## Matriz de categorización de impacto

El Anexo 1 de CIP-002 proporciona umbrales cuantitativos explícitos para evitar determinaciones subjetivas:

| Nivel de impacto | Instalaciones y sistemas típicos | Criterios de umbral |
| :--- | :--- | :--- |
| **Alto Impacto** | Centros de Control para grandes Autoridades de Balance y Coordinadores de Confiabilidad | Gran impacto en la confiabilidad de la interconexión (por ejemplo, control de despacho de generación de >3.000 MW) |
| **Impacto medio** | Plantas de generación, grandes subestaciones de transmisión | Generación >1.500 MW de capacidad agregada, o subestaciones de transmisión >=500 kV o >=3.000 MVA |
| **Bajo impacto** | Subestaciones de distribución, pequeños parques solares/eólicos | Todos los demás BES Cyber ​​Systems no clasificados como Alto o Medio |

---

## Arquitectura de Subestaciones y Perímetro de Seguridad Electrónica

Un error crítico en los preparativos de la auditoría de OT es no distinguir entre el **Perímetro de seguridad física (PSP)** y el **Perímetro de seguridad electrónico (ESP)**:

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

### Conclusiones clave para ingenieros de seguridad industrial

1. **La regla de los 15 minutos**: Si un activo puede fallar sin afectar las funciones de confiabilidad del BES dentro de un período de 15 minutos, generalmente no es un activo cibernético de BES.
2. **Activos cibernéticos transitorios (TCA)**: las computadoras portátiles, los equipos de prueba y las unidades de mantenimiento USB están sujetos a controles CIP-010 cada vez que cruzan la barrera ESP.
3. **Obligaciones de bajo impacto**: Nunca asuma que bajo impacto significa "sin seguridad". El Anexo 1 de CIP-003 exige concienciación sobre la seguridad cibernética, controles de acceso físico, controles de acceso electrónico y planificación de respuesta a incidentes para todos los activos de bajo impacto.
