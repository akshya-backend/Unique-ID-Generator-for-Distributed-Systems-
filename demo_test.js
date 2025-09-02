import { IDGenerator } from "./UniqueIdGenerator.js";

// ---------- Setup ----------
const generator = new IDGenerator({ datacenterId: 1n, machineId: 3n });

console.log("========== Test 1: Generate 5 IDs ==========");
const ids = [];
for (let i = 0; i < 5; i++) {
  const id = generator.generate();
  ids.push(id);
  console.log(`ID ${i + 1}:`, id.toString());
}

console.log(
  "Uniqueness Check:",
  new Set(ids.map((i) => i.toString())).size === ids.length ? "PASS ✅" : "FAIL ❌"
);

// ---------- Test 2: Decode ID ----------
console.log("\n========== Test 2: Decode an ID ==========");
const decoded = generator.decode(ids[0]);
console.log("Decoded ID:", decoded);
console.log(
  "Datacenter & Machine Correct:",
  decoded.datacenterId === 1n && decoded.machineId === 3n ? "PASS ✅" : "FAIL ❌"
);

// ---------- Test 3: Sequence Rollover ----------
console.log("\n========== Test 3: Sequence Rollover ==========");
// Temporarily reduce SEQUENCE_BITS for testing
generator.SEQUENCE_BITS = 2n;
generator.MAX_SEQUENCE = (1n << generator.SEQUENCE_BITS) - 1n;

const rolloverIds = [];
for (let i = 0; i < 6; i++) {
  const id = generator.generate();
  rolloverIds.push(id);
  const seq = generator.decode(id).sequence;
  console.log(`ID ${i + 1}: ${id.toString()} | Sequence: ${seq}`);
}

// ---------- Test 4: Multiple Milliseconds ----------
console.log("\n========== Test 4: Wait 1ms and Generate ID ==========");
setTimeout(() => {
  const newId = generator.generate();
  const decodedNew = generator.decode(newId);
  console.log("New ID after 1ms:", newId.toString());
  console.log("Decoded:", decodedNew);
}, 2);

// ---------- Test 5: BigInt Precision Check ----------
console.log("\n========== Test 5: BigInt Precision Check ==========");
const bigId = generator.generate();
console.log("BigInt ID:", bigId);
console.log("Number conversion (may lose precision):", Number(bigId));
console.log(
  "BigInt keeps exact value:",
  bigId.toString().length >= 15 ? "PASS ✅" : "FAIL ❌"
);
