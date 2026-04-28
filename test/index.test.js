const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const metalnames = require("../src");
const cliPath = path.resolve(__dirname, "../bin/metalnames");

test("exports the full source list", () => {
  assert.ok(Array.isArray(metalnames.all));
  assert.ok(metalnames.all.length >= 300);
});

test("random returns a known list entry", () => {
  const value = metalnames.random();
  assert.equal(typeof value, "string");
  assert.ok(value.length > 0);
  assert.ok(metalnames.all.includes(value));
});

test("generate returns a non-empty string", () => {
  const value = metalnames.generate();
  assert.equal(typeof value, "string");
  assert.ok(value.trim().length > 0);
});

test("generateMany returns requested amount", () => {
  const count = 25;
  const names = metalnames.generateMany(count);
  assert.equal(names.length, count);
  names.forEach((name) => {
    assert.equal(typeof name, "string");
    assert.ok(name.trim().length > 0);
  });
});

test("generateMany defaults to at least one result for invalid counts", () => {
  assert.equal(metalnames.generateMany(0).length, 1);
  assert.equal(metalnames.generateMany(-4).length, 1);
  assert.equal(metalnames.generateMany("abc").length, 1);
});

test("generate can omit third word when requested", () => {
  const names = metalnames.generateMany(200, { includeThirdWord: false });
  assert.ok(
    names.some((name) => name.split(/\s+/).length <= 2),
    "Expected at least one shorter generated name with includeThirdWord false"
  );
});

test("cli prints help", () => {
  const result = spawnSync(process.execPath, [cliPath, "--help"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage:/);
});

test("cli generates the requested count", () => {
  const result = spawnSync(process.execPath, [cliPath, "--count", "3"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  const lines = result.stdout
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  assert.equal(lines.length, 3);
});

test("cli outputs JSON when requested", () => {
  const result = spawnSync(process.execPath, [cliPath, "--count", "2", "--json"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  const payload = JSON.parse(result.stdout);
  assert.ok(Array.isArray(payload));
  assert.equal(payload.length, 2);
});
