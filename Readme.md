# Unique ID Generator For Distributed Systems

A beginner-friendly **distributed unique ID generator** in JavaScript, inspired by **Twitter Snowflake**.  
Generates **64-bit unique IDs** combining timestamp, datacenter ID, machine ID, and sequence number.  

---

## Features

- Distributed-friendly: supports multiple **datacenters** and **machines**.  
- Generates **up to 4096 IDs per millisecond per machine**.  
- Uses **BigInt** to safely handle 64-bit IDs.  
- Can **decode IDs** to retrieve timestamp, datacenter, machine, and sequence.  
- Custom **epoch** support for flexible timestamping.  
- Beginner-friendly, readable, and easy to understand.

---


