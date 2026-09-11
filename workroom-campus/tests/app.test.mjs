import test from "node:test";
import assert from "node:assert/strict";

// Importing this module must not require a browser. The scoring logic is the
// stable, testable core behind the simulation's evidence-led feedback.
const { calculateScore } = await import("../app.js");

test("rewards a safe, evidence-led incident response", () => {
  const score = calculateScore({
    evidence: "a",
    hypothesis: "a",
    update: "Students are impacted. We are rolling back now and will provide an update in 10 minutes."
  });
  assert.equal(score, 96);
});

test("does not grant a high score for unsupported action", () => {
  const score = calculateScore({
    evidence: "b",
    hypothesis: "c",
    update: "Sorry"
  });
  assert.ok(score < 55);
});

test("score stays within an interpretable 0–100 range", () => {
  const score = calculateScore({ evidence: "a", hypothesis: "a", update: "student impact rollback update investigate minute" });
  assert.equal(score, 100);
});
