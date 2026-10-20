## Standard summary

*Editorial summary of IEC 62351-1. Highlighted passages are not presented as verbatim quotations; the normative document remains the reference.*

After presenting the different types of threats, **IEC 62351-1** begins, in section **5.3**, to organize some fundamental cybersecurity concepts.

The idea is to relate **what we need to protect**, **what could compromise this protection** and **what weaknesses could allow this to happen**.

### 5.3.1 — Security requirements

The standard presents four basic security requirements:

- **Confidentiality**
- **Integrity**
- **Availability**
- **Non-repudiation / Accountability**

**confidentiality** seeks to prevent unauthorized access to information.

**integrity** seeks to prevent unauthorized modification or appropriation.

**availability** seeks to ensure that authorized users have access to information and avoid denial of service situations.

**Non-repudiation or accountability** is related to the ability to hold an entity responsible for a certain action, preventing an action carried out from being later denied or someone claiming to have carried out an action that did not occur.

The standard also establishes an important premise:

> **authorization depends on authentication.**

Before determining **what someone can do**, it is necessary to establish **who that user or application is**.

### 5.3.2 — Security threats

Next, IEC 62351 presents four threats directly related to the previous requirements:

**Unauthorized access to information**
→ threat to confidentiality.

**Unauthorized modification or theft of information**
→ threat to integrity.

**Denial of service**
→ threat to availability.

**Repudiation or lack of accountability**
→ threat to non-repudiation/accountability.

But the standard makes an important observation: a threat can be materialized by different vulnerabilities and different attack methods.

Therefore, protecting a security requirement does not simply mean applying a single control.

Countermeasures need to consider **how that threat could actually happen**.

### 5.3.3 — Security vulnerabilities

The definition of vulnerability presented by IEC 62351 also deserves attention.

A vulnerability is a **weakness or opening in the system capable of allowing unauthorized action to materialize a threat**.

And it doesn't necessarily have to be a CVE or a software flaw.

The standard cites the following as possible origins:

- bugs;
- design flaws;
- equipment failures;
- physical actions.

**Author’s application comment:** This is especially important in OT.

A vulnerability may be in the software, equipment, architecture or even the physical conditions surrounding that system.

Furthermore, it may only exist theoretically or already have a **known exploit**.

## Technical analysis

*The author’s technical reading of the summarized concepts; it does not establish additional normative requirements.*

Sections **5.3.1 to 5.3.3** begin to assemble a logical sequence:

**Security Requirement → Threat → Vulnerability**

First we understand **what we want to protect**.

Then we identify **what could compromise this objective**.

And then we assess **what weaknesses could allow this threat to materialize**.

For OT cybersecurity, there is still an important message:

> **vulnerability does not just mean software vulnerability.**

Flaws in design, equipment and physical aspects can also create risky conditions.

In the next part, IEC 62351 adds another element to this relationship:

**5.3.4 — Security attacks**, showing how different types of attacks can transform a threat into a real event.


## References

1. **Technical specification** — IEC. *IEC 62351-1 — Introduction to security issues*. [Official catalogue](https://webstore.iec.ch/en/publication/6903). The article does not state the edition consulted; the link identifies the official catalogue entry.
