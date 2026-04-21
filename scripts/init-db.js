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
  
// Use current process.env to ensure Railway variables like ADMIN_EMAIL are passed through
const ensureAdminScript = path.join(process.cwd(), "scripts", "ensure-admin-user.js");
console.log(`Synchronizing admin user from environment variables...`);

try {
  const adminResult = spawnSync(command, [ensureAdminScript], {
    stdio: "inherit",
    env: { ...process.env }, // Ensure all env vars are passed
    shell: false,
  });

  if (adminResult.status !== 0) {
    console.error(`Admin user synchronization failed with exit code ${adminResult.status || 'unknown'}.`);
    // We don't exit(1) here to allow the main app to try starting even if admin sync was partial
  } else {
    console.log("Admin user synchronization successful.");
  }
} catch (error) {
  console.error("Failed to execute admin synchronization script:", error.message);
}

process.exit(0);
