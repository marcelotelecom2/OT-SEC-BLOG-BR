*Research published in October 2026 shows significant advances in the ability of artificial intelligence models to develop attack paths against industrial environments. However, the results require careful interpretation.*

## What was researched?

**Frenos** published the report *2026: The State of AI in OT Security*, investigating the extent to which artificial intelligence models can assist in planning attacks against Operational Technology (OT) systems.

The research evaluated **10 AI models** across different challenges involving industrial assets, network connections, vulnerabilities and access privileges.

The evaluation included:

- **16,980 tests**;
- More than **13,000 decision attempts**;
- Approximately **2,500 planning attempts**;
- More than **500 simulator observations**.

The objective was to determine whether the models could identify sequences of actions capable of achieving specific goals in simulated scenarios.

## The main result

Three of the most advanced models produced valid attack plans in approximately **90% of planning attempts**.

This result demonstrates that AI already has a significant ability to connect technical information and construct attack paths in structured scenarios.

However, the researchers also identified important limitations.

Some models skipped necessary steps, assumed privileges they did not have, or produced inconsistent plans.

**The research did not demonstrate that these models can autonomously discover, compromise and attack real OT infrastructure.**

This distinction is fundamental: developing a technically valid plan in a simulation is not equivalent to carrying out an attack against operating industrial systems.

## What does this mean for the electric power sector?

**Author's technical analysis:** In critical electric power infrastructure, the concern should extend beyond the exploitation of individual vulnerabilities to the combination of different security weaknesses.

Consider, for example, a substation environment with engineering workstations, SCADA systems, HMIs, and protection and control devices.

An attack path may depend on different conditions: initial access, available permissions, communication between networks and the absence of adequate controls.

AI can help analyze these relationships, reducing the effort required to identify possible compromise paths.

This reinforces the importance of assessing **the complete architecture of the OT environment**, rather than only the isolated security of each device.

## What should defenders prioritize?

The report highlights four directions:

1. **Defense in depth:** network segmentation, privilege restrictions, remote access control and recovery capabilities.
2. **Detection and response:** monitoring authentication events, remote sessions and unauthorized changes.
3. **Defensive use of AI:** correlating asset inventories, vulnerabilities, connectivity and security events, with human validation.
4. **Contextual exposure analysis:** evaluating attack paths in light of existing controls and actual access conditions.

These recommendations are particularly relevant to electric power systems, where any security measure must also respect availability and operational continuity requirements.

## Summary

The Frenos study points to an important development: **artificial intelligence can make attack planning against OT environments more accessible and efficient.**

However, the results still depend on the context supplied to the models, the simulation conditions and human interpretation.

For the electric power sector, the main question is not whether AI will replace a specialized attacker, but how its use may change the speed and complexity of threats.

**The response remains grounded in secure architecture, integrated controls, asset visibility and effective detection and response capabilities.**

## References

1. **Frenos (2026).** *2026: The State of AI in OT Security*. [Read the original research](https://frenos.io/2026-ai-ot-report).

*Independent technical commentary based on the results published by Frenos. The percentages presented refer to the researchers' tests and do not represent success rates for attacks against real electric power infrastructure.*
