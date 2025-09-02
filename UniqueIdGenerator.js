// simpleSnowflake.js
export class Snowflake {
  constructor({ epoch = 1609459200000n, datacenterId = 0n, machineId = 0n } = {}) {
    // --- Bit sizes ---
    this.TIMESTAMP_BITS = 41n;
    this.DATACENTER_BITS = 5n;
    this.MACHINE_BITS = 5n;
    this.SEQUENCE_BITS = 12n;

    // --- Max values ---
    this.MAX_DATACENTER = (1n << this.DATACENTER_BITS) - 1n; // 31
    this.MAX_MACHINE = (1n << this.MACHINE_BITS) - 1n;       // 31
    this.MAX_SEQUENCE = (1n << this.SEQUENCE_BITS) - 1n;     // 4095

    // --- Validate inputs ---
    if (datacenterId < 0 || datacenterId > this.MAX_DATACENTER)
      throw new Error(`Datacenter ID must be 0-${this.MAX_DATACENTER}`);
    if (machineId < 0 || machineId > this.MAX_MACHINE)
      throw new Error(`Machine ID must be 0-${this.MAX_MACHINE}`);

    // --- Store config ---
    this.epoch = BigInt(epoch);
    this.datacenterId = BigInt(datacenterId);
    this.machineId = BigInt(machineId);

    // --- Internal state ---
    this.lastTimestamp = -1n;
    this.sequence = 0n;
  }

  // current timestamp in ms
  _now() {
    return BigInt(Date.now());
  }

  // wait next ms if sequence overflows
  _waitNextMillis(lastTs) {
    let ts = this._now();
    while (ts <= lastTs) ts = this._now();
    return ts;
  }

  // Generate unique ID
  generate() {
    let timestamp = this._now();

    if (timestamp < this.lastTimestamp) {
      throw new Error("Clock moved backwards. Cannot generate ID.");
    }

    if (timestamp === this.lastTimestamp) {
      // same ms → increment sequence
      this.sequence = (this.sequence + 1n) & this.MAX_SEQUENCE;

      if (this.sequence === 0n) {
        // overflow → wait next ms
        timestamp = this._waitNextMillis(this.lastTimestamp);
      }
    } else {
      // new ms → reset sequence
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;

    // timestamp difference since custom epoch
    const tsDiff = timestamp - this.epoch;

    // combine all fields into 64-bit ID
    const id =
      (tsDiff << (this.DATACENTER_BITS + this.MACHINE_BITS + this.SEQUENCE_BITS)) |
      (this.datacenterId << (this.MACHINE_BITS + this.SEQUENCE_BITS)) |
      (this.machineId << this.SEQUENCE_BITS) |
      this.sequence;

    return id;
  }

  // Decode ID back into fields
  decode(id) {
    const bigId = BigInt(id);

    const sequence = bigId & this.MAX_SEQUENCE;
    const machineId = (bigId >> this.SEQUENCE_BITS) & this.MAX_MACHINE;
    const datacenterId =
      (bigId >> (this.MACHINE_BITS + this.SEQUENCE_BITS)) & this.MAX_DATACENTER;
    const timestamp =
      (bigId >> (this.DATACENTER_BITS + this.MACHINE_BITS + this.SEQUENCE_BITS)) +
      this.epoch;

    return {
      id: bigId.toString(),
      timestamp: new Date(Number(timestamp)),
      datacenterId: Number(datacenterId),
      machineId: Number(machineId),
      sequence: Number(sequence),
    };
  }
}
