const { spawnSync } = require("node:child_process");
const path = require("node:path");

const command = process.execPath;
const prismaBin = path.join(process.cwd(), "node_modules", "prisma", "build", "index.js");
const env = { ...process.env, NODE_ENV: "production" };

console.log("Synchronizing database schema...");
const result = spawnSync(command, [prismaBin, "db", "push", "--accept-data-loss"], {
  stdio: "inherit",
  env,
  shell: false,
});

if (result.status !== 0) {
  console.error("Database synchronization failed.");
  process.exit(result.status || 1);
}

console.log("Database synchronized successfully.");
