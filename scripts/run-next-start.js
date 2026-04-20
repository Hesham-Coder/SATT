const { spawnSync } = require("node:child_process");
const path = require("node:path");

const command = process.execPath;
const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const env = { ...process.env, NODE_ENV: "production" };

const initDbScript = path.join(process.cwd(), "scripts", "init-db.js");

console.log("Initializing database...");
const initResult = spawnSync(command, [initDbScript], {
  stdio: "inherit",
  env,
  shell: false,
});

if (initResult.status !== 0) {
  process.exit(initResult.status || 1);
}

console.log("Starting Next.js...");
const result = spawnSync(command, [nextBin, "start"], {
  stdio: "inherit",
  env,
  shell: false,
});

if (typeof result.status === "number") {
  process.exit(result.status);
}

process.exit(1);
