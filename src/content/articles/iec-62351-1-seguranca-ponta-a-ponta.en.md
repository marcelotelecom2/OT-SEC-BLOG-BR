Section **5.3.5 — Security Categories** of IEC 62351-1 presents an important principle for the cybersecurity of electric power systems: **protecting a single layer is not sufficient to ensure the security of the entire infrastructure.**

The standard organizes cybersecurity into four complementary categories:

1. **Human-Machine Interface (HMI):** protection against unauthorized access, identity impersonation and misuse of privileges through user authentication and authorization.
2. **Software applications:** protection against malicious code, vulnerabilities and faults through access controls, testing and patch management.
3. **Communication protocols:** protection against interception, Man-in-the-Middle attacks, message replay and identity impersonation through encryption, authentication and digital signatures.
4. **Communication media:** protection against unavailability, interference and failures in transmission channels through access control, redundancy and other protective mechanisms.

![IEC 62351-1 — Figure 2: cybersecurity categories, typical security attacks and countermeasures. Figure supplied for this publication, with labels in English.](/images/articles/iec-62351-1-categorias-seguranca-figura-2.png)

## Why is protecting communication alone not enough?

The standard uses the example of a **VPN** to illustrate this limitation.

Although a VPN can protect communication between devices, it does not necessarily prevent one user from impersonating another, or a malicious application installed on a compromised computer from using the protected tunnel to access field equipment.

Therefore, **a secure communication channel does not, by itself, mean that the connected users, applications and devices are trustworthy.**

## Summary

IEC 62351-1 emphasizes that *end-to-end* security depends on the coordinated application of protective measures across all four categories.

In addition to implementing individual controls, their integration must be ensured, so that the security mechanisms themselves do not introduce operational problems.

In OT environments, especially critical electric power infrastructure, this principle highlights the importance of an integrated approach that considers both cyber protection and the operational requirements of the systems.

## References

1. IEC 62351-1 — Section 5.3.5, *Security Categories*, Figure 2. [Official IEC catalogue](https://webstore.iec.ch/en/publication/6903).

*Editorial summary based on the standard. This content is not a verbatim transcription of the normative document.*
