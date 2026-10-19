## Resumo
Os Sistemas de Controle Industrial (ICS) são cada vez mais alvo de ameaças cibernéticas. Sistemas IDS tradicionais, baseados em assinaturas, têm dificuldade para detectar exploits de dia zero em ambientes SCADA.

## Metodologia
Usando uma Isolation Forest combinada com um autoencoder LSTM leve, analisamos capturas PCAP brutas de redes Modbus TCP e DNP3...

### Principais conclusões
1. A precisão da detecção de anomalias atingiu 98,4% na manipulação dos registros do PLC.
2. O impacto da latência foi inferior a 1,2 ms por inspeção de pacote.
3. A taxa de falsos positivos permaneceu abaixo de 0,05% durante o teste de estresse de 72 horas.
