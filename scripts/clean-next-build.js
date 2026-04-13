const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const candidates = [
  path.join(root, ".next"),
  path.join(root, "tsconfig.tsbuildinfo"),
];

for (const target of candidates) {
  try {
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true, force: true });
    }
  } catch (error) {
    console.warn(`Could not clean ${target}:`, error instanceof Error ? error.message : error);
  }
}
