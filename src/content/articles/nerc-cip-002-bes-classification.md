## What does CIP-002 actually classify?

CIP-002 does not classify devices simply because they are PLCs, HMIs, servers, firewalls, or protection systems.

**The process starts by understanding the role of the asset.**

In the North American bulk electric power grid, reliability is governed by North American Electric Reliability Corporation (NERC) Critical Infrastructure Protection (CIP) standards. Standard CIP-002-5.1a (and subsequent revisions) establishes the fundamental methodology for identifying and categorizing assets.

### Core Classification Hierarchy

To properly scope security controls, engineers must step through five foundational concepts:

- **Responsible Entity**: The registered organization (Generator Owner, Transmission Operator, Balancing Authority) responsible for compliance.
- **BES (Bulk Electric System)**: All transmission elements operating at 100 kV or higher, and real-power generation facilities exceeding regional MVA thresholds.
- **BES Cyber Asset (BCA)**: A programmable electronic device that, if compromised or rendered unavailable, would affect the 15-minute real-time reliability operation of the BES.
- **BES Cyber System (BCS)**: One or more BES Cyber Assets logically or physically grouped together to perform one or more reliability functions.
- **Impact Rating**: The final tier (High, Medium, or Low) assigned to the system based on quantitative criteria defined in Attachment 1 of the standard.

> Equipment type alone does not determine the Impact Rating. The fundamental question is always: *what is the consequence to the Interconnection if this system fails or is subverted in real time?*

---

## Impact Categorization Matrix

Attachment 1 of CIP-002 provides explicit quantitative thresholds to prevent subjective determinations:

| Impact Level | Typical Facilities & Systems | Threshold Criteria |
| :--- | :--- | :--- |
| **High Impact** | Control Centers for large Balancing Authorities and Reliability Coordinators | Large Interconnection reliability impact (e.g. >3,000 MW generation dispatch control) |
| **Medium Impact** | Generation plants, large transmission substations | Generation >1,500 MW aggregate capacity, or transmission substations >=500 kV or >=3,000 MVA |
| **Low Impact** | Distribution substations, small solar/wind farms | All other BES Cyber Systems not categorized as High or Medium |

---

## Substation Architecture & Electronic Security Perimeter

A critical mistake in OT audit preparations is failing to distinguish between the **Physical Security Perimeter (PSP)** and the **Electronic Security Perimeter (ESP)**:

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

### Key Takeaways for Industrial Security Engineers

1. **The 15-Minute Rule**: If an asset can fail without affecting the reliability functions of the BES within a 15-minute window, it is generally not a BES Cyber Asset.
2. **Transient Cyber Assets (TCAs)**: Laptops, test sets, and USB maintenance drives are subject to CIP-010 controls whenever they cross the ESP barrier.
3. **Low-Impact Obligations**: Never assume Low Impact means "no security." CIP-003 Attachment 1 mandates cyber security awareness, physical access controls, electronic access controls, and incident response planning for all Low Impact assets.
