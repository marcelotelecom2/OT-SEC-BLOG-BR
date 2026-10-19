## Resumen
Los sistemas de control industrial (ICS) son cada vez más objetivo de ciberamenazas. Los IDS tradicionales, basados en firmas, tienen dificultades para detectar exploits de día cero en entornos SCADA.

## Metodología
Utilizando un Isolation Forest combinado con un autoencoder LSTM ligero, analizamos capturas PCAP sin procesar de redes Modbus TCP y DNP3...

### Hallazgos clave
1. La precisión de la detección de anomalías alcanzó el 98,4% en la manipulación de registros del PLC.
2. El impacto de la latencia fue inferior a 1,2 ms por inspección de paquete.
3. La tasa de falsos positivos se mantuvo por debajo del 0,05% durante las pruebas de estrés de 72 horas.
