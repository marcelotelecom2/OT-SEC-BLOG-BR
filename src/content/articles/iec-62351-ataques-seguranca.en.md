In section **5.3.4 — Security attacks**, **IEC 62351-1** reinforces an important idea for those working with cybersecurity in electrical and OT systems:

> **a threat can be implemented by different types of attacks.**

In other words, there is no simple and direct relationship between security requirements, threats and attacks.

## The same attack can appear in different threats

The standard explains that security attacks form a kind of network.

The same type of attack can be associated with different threats, and the same threat can be carried out through different paths.

This means that, in practice, protecting a security requirement does not depend on a single measure.

Each type of attack capable of realizing a threat needs to be considered when defining countermeasures.

## There is no 1:1 relationship

This is probably the main point of section 5.3.4.

There is no **1 to 1** relationship between:

- security requirement;
- threat;
- attack.

For example, an integrity threat can arise through different techniques. Likewise, the same attack can affect more than one security requirement, depending on how it is executed.

Therefore, the standard shows that protection should not be thought of in an isolated or simplified way.

![IEC 62351-1 — Relationship between security requirements, threats and attack examples.](/images/articles/iec-62351-ataques-esquema.webp)

## The idea of “chain of attacks”

Another important concept presented here is that of **chain of attacks**.

IEC 62351 recognizes that a threat may not be realized by a single action, but by a **sequence of attacks**.

This sequence can:

- involve different assets;
- happen in stages;
- occur over time.

This is especially relevant in OT, where an incident can start in a less critical asset and, from there, evolve to affect more important functions of the operation.

## What does this mean in practice?

The key message from section 5.3.4 is that risk analysis should not just look at isolated attacks.

It needs to consider:

- different attack paths;
- different vectors;
- the possibility of chaining between events;
- the need for multiple countermeasures.

In other words, **it is not enough to protect against a specific attack**. It is necessary to understand how different attacks can contribute to the realization of the same threat.
