*An approach based on IEC 62443, IEC 62351, NIST and NERC CIP to identify cyber assets, attack surfaces and physical dependencies in industrial systems.*

**Does equipment without Ethernet or an IP address need to be assessed from a cybersecurity perspective? Can a hardwired component be part of a cyberattack scenario?**

These questions frequently arise in Protection and Control (P&C) Engineering, particularly in projects involving substations, automation systems and FACTS equipment, such as SVC, STATCOM and FSC.

A recurring difficulty is deciding which components of an industrial solution should undergo cybersecurity assessments. In some cases, devices without network communications are excluded from the analysis. In others, every electronic component receives security requirements that do not match its characteristics or functions.

Both approaches can produce inadequate results.

The challenge is to establish a methodology that identifies relevant components, explains their interfaces and dependencies, and determines the depth of assessment needed.

## 1. The first decision is not about security controls

A cybersecurity assessment should not begin by checking whether a particular device supports authentication, encryption, logs or user management.

Before that, it is necessary to determine:

- What is the component's function within the solution?
- Is the component programmable?
- Which interfaces allow interaction, configuration or operation?
- Could its behavior be influenced without authorization?
- What would the consequences be for the system?
- Does the component perform a protective function or support a security countermeasure?

These questions help distinguish three activities that are frequently confused.

**Asset identification:** recognizing the components belonging to the solution and understanding their functions.

**Attack surface identification:** identifying interfaces, services, mechanisms and interaction points that may provide opportunities for compromise.

**Risk assessment:** analyzing how a threat could exploit these exposures, what consequences might result, and what protective measures would be necessary.

The existence of an attack surface does not necessarily mean that an exploitable vulnerability exists.

Likewise, a component can be part of a risk scenario without being a cyber asset in its own right.

## 2. How do the main standards address the problem?

### IEC 62443-3-2 — Assessment starts with the system

IEC 62443-3-2:2020, which addresses security risk assessment for the design of industrial automation and control systems, provides a key foundation for structuring this activity.

The standard establishes requirements for defining the *System Under Consideration* (SUC), organizing the system into zones and conduits, assessing risks and documenting security requirements.

Its main contribution to our problem is the need to understand the system before determining its security requirements.

A device should not be analyzed in isolation based only on its technological characteristics. Its function, location, interfaces and dependencies also matter.

This is particularly relevant in power systems, where an operational function may involve digital controllers, sensors, hardwired circuits, relays and electromechanical devices.

### IEC 62443-4-2 — Requirements applicable to components

IEC 62443-4-2:2019 establishes technical security requirements for four types of IACS components:

1. Software Applications.
2. Embedded Devices.
3. Host Devices — devices that host operating systems and applications.
4. Network Devices.

This classification helps identify the requirements relevant to a component's characteristics.

An industrial controller, for example, may be treated as an embedded device, while a Windows workstation may be classified as a host device.

However, the standard should not be used as a generic list of requirements applied indiscriminately to every electrical component.

The applicability of each requirement depends on the component type, the capabilities required and the security requirements established for the system.

### IEC 62351-1 — Security is not limited to the network

In section 5.3.5, *Security Categories*, IEC 62351-1 presents four complementary perspectives:

- Human-machine interface.
- Software applications.
- Communication protocols.
- Communication media.

The standard emphasizes the importance of integrated security measures to achieve end-to-end protection.

The example of a VPN illustrates this need: protecting the communication channel does not guarantee that the user is legitimate or that the connected application is free from compromise.

These four categories provide a useful reference for examining different exposure points in power system components and systems.

However, they do not, by themselves, constitute a normative procedure for classifying cyber assets.

### NIST SP 800-82 — The relationship between digital systems and physical processes

NIST SP 800-82 Rev. 3, *Guide to Operational Technology (OT) Security*, considers the particular characteristics of OT systems, including availability, reliability, performance and operational safety.

Its approach covers programmable systems that monitor or control physical processes, directly or through other devices.

This perspective is particularly important when assessing components that, although not programmable, may receive commands from or supply signals to digital systems.

Security analysis needs to understand the interaction between the cyber environment and the physical process.

### NERC CIP — The distinction between Cyber Asset and BES Cyber Asset

NERC uses specific definitions for asset classification in the context of the Bulk Electric System (BES).

Under the terminology in effect in October 2026, a *Cyber Asset* is a programmable electronic device, including its hardware, software and data.

A programmable device therefore does not need an IP address to be considered a Cyber Asset.

However, classification as a *BES Cyber Asset* requires additional criteria concerning the impact on reliable BES operation, including NERC's defined 15-minute criterion.

The distinction is fundamental: not every Cyber Asset is a BES Cyber Asset, and not every component that is physically important to an electrical installation is necessarily a Cyber Asset.

These definitions have a specific regulatory application and should not automatically be generalized to every industrial installation.

## 3. A proposed methodology for selecting devices

Drawing on the references above, we can structure a screening process to determine which components need cybersecurity assessment.

**Step 1 — Identify the component's function**

Record its operational function, its location in the architecture and the systems with which it interacts.

**Step 2 — Identify technological characteristics**

Determine whether it has firmware, software, programmable logic, digital interfaces, update mechanisms or configuration functions.

**Step 3 — Identify interfaces and exposure points**

Consider Ethernet, USB, serial communications, proprietary communications, local engineering interfaces and other interaction mechanisms.

For OT systems, interfaces with the physical process, such as digital or analog inputs and outputs, must also be considered.

**Step 4 — Assess dependencies and consequences**

Determine whether compromising a cyber component could influence the device under analysis, alter signals or cause operational consequences.

**Step 5 — Determine the necessary treatment**

Based on the results, the component may be referred for direct cyber assessment, interface and dependency assessment, or analysis by electrical engineering, protection, control or safety disciplines.

The decision must be documented, including when no detailed cyber assessment is needed.

This methodology is a proposal for practical application grounded in the principles of the standards, rather than a procedure literally established by them.

## 4. A practical classification for P&C Engineering

To facilitate screening, components can be divided into four treatment groups.

| Group | Characteristic | Treatment |
|---|---|---|
| A — Programmable asset | Firmware, software or programmable logic | Direct cyber assessment |
| B — Interface or dependency | Component or circuit that can transmit the effects of compromise | Assessment of interfaces and risk scenarios |
| C — Physical or functional component | Predominantly electrical, mechanical or functional risks | Assessment by the applicable discipline |
| D — No identified cybersecurity relevance | No relevant exposure or dependency after screening | Justified exclusion from detailed assessment |

These groups do not replace the formal definitions of Cyber Asset, BES Cyber Asset or the component types in IEC 62443-4-2.

Their purpose is to organize the decision about the treatment needed.

## 5. What about hardwired devices?

A hardwired connection is a direct physical interconnection, normally used to transmit commands, indications or electrical signals between components.

Examples include dry contacts, digital inputs, digital outputs, analog signals, trip circuits, blocking circuits and permissives.

The fact that a connection is hardwired does not automatically determine its security classification.

Consider a programmable controller connected to a command circuit through a digital output.

A malicious actor who compromises the controller may, depending on the architecture and existing controls, change the state of the output.

The change may be transmitted to the hardwired circuit and influence an operational function.

In this scenario, the physical circuit does not need to be considered a Cyber Asset. However, it is part of the path through which the consequences of cyber compromise can reach the process.

It is important to distinguish this scenario from purely physical manipulation of a circuit by an actor with direct access to conductors or terminals.

The two cases may produce similar consequences, but they have different origins, exposure surfaces and countermeasures.

**Hardwired does not automatically mean secure against all threats, just as it does not automatically mean cyber.**

## 6. Non-cyber components that still need assessment

Classifying a component as non-cyber does not necessarily conclude its analysis.

Consider an electromechanical interlock responsible for preventing an operation under unsuitable conditions.

Although this mechanism may have neither software nor digital connectivity, its action may be essential to limit the consequences of improper commands originating from a compromised controller.

In this case, the solution's cybersecurity assessment needs to understand whether the interlock is truly independent of the potentially compromised logic and which conditions are necessary for it to operate.

Similar situations may involve:

- Electromechanical protection relays.
- Hardwired trip and blocking circuits.
- Non-programmable analog sensors.
- Physical interlocks.
- Independent electrical protection devices.
- Passive elements that support critical communications.

The objective is not to apply password policies, encryption or hardening to these components.

The objective is to verify whether they perform relevant functions in preventing, propagating or limiting the consequences of a cyber incident.

This analysis may require collaboration between specialists in cybersecurity, P&C Engineering, electrical protection, reliability and safety.

## 7. The decision must be grounded in function and risk

An effective methodology should not indiscriminately expand the scope of cybersecurity.

Doing so can generate unnecessary requirements, raise costs and increase the solution's complexity without providing corresponding benefits.

At the same time, an assessment based exclusively on IP interfaces may fail to identify isolated programmable devices, local maintenance interfaces and relevant dependencies on the physical process.

Screening should therefore consider two complementary dimensions:

**The component's technological nature:** what it is, how it works and which interfaces it presents.

**Its role in the system:** which functions it performs, what it depends on, and what consequences may result from its manipulation or failure.

Combining these perspectives makes it possible to establish a technically defensible scope.

## Conclusion

Determining which devices need assessment is one of the first decisions in an OT cybersecurity analysis.

IEC 62443-3-2 contributes system-oriented risk assessment; IEC 62443-4-2 establishes requirements for specific component types; IEC 62351-1 presents complementary security categories for power systems; NIST SP 800-82 considers the interaction between digital systems and physical processes; and NERC CIP offers specific definitions for cyber assets in the BES context.

These references support the development of a methodology that does not depend exclusively on the existence of Ethernet, TCP/IP or remote connections.

**Not every component of an industrial solution is a cyber asset. However, a non-cyber component can still be relevant to the solution's cybersecurity risk analysis.**

The appropriate decision is not to classify all equipment as cyber, but to identify which components have digital exposure, which participate in paths of influence over the process, and which should be assessed by other engineering disciplines.

In substation and FACTS projects, this distinction contributes to more consistent assessments, proportionate requirements and better integration between cybersecurity and Protection and Control Engineering.

---

## References

1. IEC 62443-3-2:2020 — *Security for industrial automation and control systems — Security risk assessment for system design*. https://webstore.iec.ch/en/publication/30727
2. IEC 62443-4-2:2019 — *Technical security requirements for IACS components*.
3. IEC 62351-1 — *Power systems management and associated information exchange — Data and communications security*, section 5.3.5.
4. NIST SP 800-82 Rev. 3 — *Guide to Operational Technology (OT) Security*. https://csrc.nist.gov/pubs/sp/800/82/r3/final
5. NERC — *Glossary of Terms Used in NERC Reliability Standards*. https://www.nerc.com/glossary-of-terms

*Technical note: the screening methodology presented is an applied interpretation of normative principles, not a classification method officially prescribed by the organizations cited.*

**OT-SEC Digital Research Lab — Research and technical analysis in cybersecurity for industrial systems and critical electrical energy infrastructure.**
