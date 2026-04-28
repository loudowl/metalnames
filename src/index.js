const metalNames = require("./metal-names.json");

const secureRandom = (max) => {
  if (!Number.isInteger(max) || max <= 0) {
    throw new RangeError("max must be a positive integer");
  }

  // Use cryptographically stronger randomness when available.
  if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === "function") {
    const buffer = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buffer);
    return buffer[0] % max;
  }

  return Math.floor(Math.random() * max);
};

const pickRandom = (list) => {
  if (!Array.isArray(list) || list.length === 0) {
    throw new RangeError("list must be a non-empty array");
  }

  return list[secureRandom(list.length)];
};

const pickDistinct = (list, used) => {
  let value = pickRandom(list);
  let attempts = 0;

  while (used.has(value) && attempts < 10) {
    value = pickRandom(list);
    attempts += 1;
  }

  used.add(value);
  return value;
};

const splitPools = (names) => {
  const prefixes = [];
  const suffixes = [];

  names.forEach((entry) => {
    const trimmed = String(entry).trim();
    if (!trimmed) {
      return;
    }

    const isMultiWord = /\s/.test(trimmed);
    const looksLikePrefix =
      isMultiWord ||
      /('s)$/.test(trimmed) ||
      /(of the|against the|by|for the|to the|from the)$/i.test(trimmed) ||
      /^[0-9]+$/.test(trimmed);

    if (looksLikePrefix) {
      prefixes.push(trimmed);
    } else {
      suffixes.push(trimmed);
    }
  });

  return { prefixes, suffixes };
};

const pools = splitPools(metalNames);

const joinParts = (parts) =>
  parts
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

const generateMetalName = (options = {}) => {
  const used = new Set();
  const templateRoll = secureRandom(100);

  if (templateRoll < 20) {
    return pickRandom(metalNames);
  }

  if (templateRoll < 70) {
    return joinParts([pickDistinct(pools.prefixes, used), pickDistinct(pools.suffixes, used)]);
  }

  if (templateRoll < 90) {
    return joinParts([pickDistinct(pools.suffixes, used), pickDistinct(pools.suffixes, used)]);
  }

  return joinParts([
    pickDistinct(pools.prefixes, used),
    pickDistinct(pools.suffixes, used),
    options.includeThirdWord === false ? "" : pickDistinct(pools.suffixes, used)
  ]);
};

const generateMany = (count = 1, options = {}) => {
  const total = Math.max(1, Number(count) || 1);
  return Array.from({ length: total }, () => generateMetalName(options));
};

module.exports = {
  all: metalNames,
  random: () => pickRandom(metalNames),
  generate: generateMetalName,
  generateMany
};
