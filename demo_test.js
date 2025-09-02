import { Snowflake } from './UniqueIdGenerator.js';

// Create generator for datacenter 1, machine 3
const generator = new Snowflake({ datacenterId: 1n, machineId: 3n });

// ---------- Test 1: Generate multiple IDs ----------
console.log("Test 1: Generate 5 IDs");
const ids = [];
for (let i = 0; i < 5; i++) {
  const id = generator.generate();
  ids.push(id);
  console.log(`ID ${i + 1}:`, id.toString());
}

// Check uniqueness
console.log(
  "Test 1 - Uniqueness:",
  new Set(ids.map(i => i.toString())).size === ids.length ? "PASS" : "FAIL"
);

// ---------- Test 2: Decode ID ----------
console.log("\nTest 2: Decode an ID");
const decoded = generator.decode(ids[0]);
console.log(decoded);
console.log(
  "Test 2 - Datacenter & Machine Correct:",
  decoded.datacenterId === 1 && decoded.machineId === 3 ? "PASS" : "FAIL"
);

// ---------- Test 3: Sequence rollover ----------
console.log("\nTest 3: Sequence rollover");

// For testing rollover, temporarily reduce SEQUENCE_BITS to 2 (max sequence 3)
generator.SEQUENCE_BITS = 2n;
generator.MAX_SEQUENCE = (1n << generator.SEQUENCE_BITS) - 1n;

const rolloverIds = [];
for (let i = 0; i < 6; i++) {
  const id = generator.generate();
  rolloverIds.push(id);
  console.log(`ID ${i + 1}:`, id.toString(), "Sequence:", generator.decode(id).sequence);
}

// ---------- Test 4: Multiple milliseconds ----------
console.log("\nTest 4: Wait 1ms and generate ID");
setTimeout(() => {
  const newId = generator.generate();
  console.log("New ID after 1ms:", newId.toString());
  console.log("Decoded:", generator.decode(newId));
}, 2); // small delay to ensure next millisecond

// ---------- Test 5: BigInt precision check ----------
console.log("\nTest 5: BigInt precision check");
const bigId = generator.generate();
console.log("BigInt ID:", bigId);
console.log("Number conversion (may lose precision):", Number(bigId));
console.log(
  "Test 5 - BigInt keeps exact value:",
  bigId.toString().length >= 15 ? "PASS" : "FAIL"
);
