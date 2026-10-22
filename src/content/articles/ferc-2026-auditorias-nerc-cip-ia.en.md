**Section:** OT Radar | Regulation & Compliance

**Source:** Federal Energy Regulatory Commission (FERC)

**Published by FERC:** October 13, 2026

**References:** NERC CIP-002, CIP-004, CIP-005, CIP-007, CIP-011 and CIP-013

---

## Introduction

The cybersecurity of critical electric power infrastructure depends not only on implementing technical controls, but also on correctly identifying the systems that need protection.

On October 13, 2026, the Federal Energy Regulatory Commission (FERC) published the staff report *2026 Lessons Learned from Commission-Led CIP Reliability Audits*, bringing together findings and recommendations from audits of compliance with NERC CIP requirements.

The document presents three relevant issues:

- Delays in identifying and categorizing BES Cyber Systems associated with new generation resources.
- Inadequate categorization of systems used by affiliates and service providers performing aggregated monitoring and control functions.
- Risks related to artificial intelligence tools accessing critical systems and protected information.

Although the report focuses on entities subject to NERC CIP requirements in the United States, its findings offer important considerations for cybersecurity engineering in OT/ICS environments.

## 1. System categorization must reflect actual functions

One of the main findings concerns NERC CIP-002-5.1a, which sets criteria for identifying and categorizing BES Cyber Systems.

FERC staff identified situations in which generation resources were already in commercial operation, but their cyber systems had not yet been properly assessed or categorized.

Some of these delays were associated with misinterpretation of the *Commercial Operation Date* (COD), especially in generation projects implemented in phases.

The issue is significant because impact categorization determines which security requirements must be applied.

Incorrect categorization can result in missing mandatory controls or insufficient protection.

**Categorizing a system should not be treated merely as a documentation exercise. It is a decision that directly influences security architecture and governance.**

## 2. Outsourcing operations does not transfer responsibility

Another important finding involves control centers used to supervise multiple generation facilities.

FERC staff identified two situations: one involving affiliated companies controlled by a parent organization, and another involving providers responsible for monitoring and controlling facilities belonging to different operators.

Individually, the operators categorized certain systems as Low Impact.

However, when their aggregated control capabilities were considered, the centralized systems met the criteria for Medium Impact.

This means that the controls applied could be insufficient given the potential impact on the Bulk Electric System (BES).

The report reinforces an important principle: delegating operational activities does not remove the regulatory responsibilities of registered entities.

For OT architecture, the main consideration is that security assessments need to account for both local assets and remotely performed functions, together with their operational dependencies.

## 3. Artificial intelligence enters the discussion of access to NERC CIP environments

One of the report's most relevant aspects is its attention to the use of artificial intelligence tools in environments connected to systems subject to CIP requirements.

FERC staff use the term *Super Intelligence (SI)* to include tools such as chatbots, digital assistants and automated analytical systems.

These technologies can provide operational benefits, particularly for analysis and automation.

However, they also introduce important questions:

- Which systems can an AI tool access?
- Which permissions are granted to users and applications?
- How are the credentials and accounts being used identified?
- Which information may be processed or shared externally?
- How can legitimate automated activity be distinguished from malicious behavior?

FERC staff highlight the need to consider these risks within existing access management processes.

NERC CIP-004-7, particularly requirements R4, R5 and R6, provides a central reference for authorizing, verifying and revoking access.

The report also presents complementary recommendations concerning perimeter security (CIP-005), service accounts (CIP-007), information protection (CIP-011) and supply chain risk (CIP-013).

**Important:** the report does not establish a new prohibition or a specific regulation on using AI. It recommends assessing these technologies through existing security requirements and processes.

## 4. Implications for substations, transmission and FACTS

Although the categorization examples presented by FERC staff concern generation systems, some lessons can inform the engineering of substations, transmission systems and FACTS solutions, such as SVC and STATCOM.

In modern OT architectures, different components may participate in a single operational function: industrial controllers, engineering workstations, SCADA systems, network devices and remote access platforms.

This integration requires understanding communication flows and the permissions that exist between systems.

From a technical perspective, four aspects deserve attention:

**Architecture and segmentation:** identify connections and dependencies between industrial networks, centralized systems and external platforms.

**Identity and access management:** establish appropriate authentication, authorization and privilege control mechanisms.

**Hardening and traceability:** identify service accounts, protect credentials and maintain records of relevant activities.

**Supply chain security:** assess AI capabilities built into vendors' products and services, especially when they involve external communication or access to sensitive information.

These points do not mean that FACTS installations should automatically receive a particular NERC CIP categorization.

Regulatory applicability and categorization must be evaluated according to the functions performed, the characteristics of the installation and the relevant standards criteria.

## 5. Final considerations

The FERC staff report conveys an important message for the cybersecurity of electric power infrastructure: protective controls need to keep pace with evolving architectures and operational capabilities.

Centralized control, third-party involvement and the introduction of AI can change trust relationships and the risks associated with systems.

For OT engineering, the lesson goes beyond documentary compliance.

It is necessary to understand the functions each component performs, who can access it and the consequences a compromise could produce.

The publication does not introduce new mandatory NERC CIP requirements. It reinforces the importance of correctly applying existing requirements to evolving technologies and operational models.

**The cybersecurity of critical electric power systems begins with understanding the functions that must be protected — and the access that can influence them.**

---

### Original source

Federal Energy Regulatory Commission (FERC). *2026 Lessons Learned from Commission-Led CIP Reliability Audits*. Office of Electric Reliability, Division of Cyber Security. October 13, 2026.

[Read the official FERC staff report (PDF)](https://www.ferc.gov/sites/default/files/2026-10/26_Lessons%20Learned_1013.pdf)

*Editorial note: this article provides a technical synthesis and commentary on the official document. The implications for substations, transmission and FACTS are engineering interpretations and do not represent specific FERC regulatory determinations for these technologies. The source is a non-binding staff report whose contents do not necessarily represent the views of the Commission, its Chairman or individual Commissioners.*
