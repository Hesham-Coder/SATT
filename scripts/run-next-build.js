const { spawnSync } = require("node:child_process");
const path = require("node:path");

const command = process.execPath;
const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const env = { ...process.env, NODE_ENV: "production" };

const result = spawnSync(command, [nextBin, "build"], {
  stdio: "inherit",
  env,
  shell: false,
});

if (typeof result.status === "number") {
  process.exit(result.status);
}

process.exit(1);
