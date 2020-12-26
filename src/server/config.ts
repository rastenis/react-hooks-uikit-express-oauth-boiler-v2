export let config;
try {
  config = require("../../config/config.json");
} catch {
  console.error("config/config.json not found! Have you run 'yarn setup'?");
  process.exit(1);
}
