## Abstract
Industrial Control Systems (ICS) are increasingly target of cyber threats. Standard signature-based IDS struggle against zero-day exploits in SCADA environments.

## Methodology
Using an isolation forest combined with a lightweight LSTM autoencoder, we parsed raw pcap feeds from Modbus TCP and DNP3 networks...

### Key Findings
1. Anomaly detection accuracy reached 98.4% on PLC register manipulation.
2. Latency impact was under 1.2ms per packet inspection.
3. False positive rate remained under 0.05% during 72-hour stress testing.
