#!/usr/bin/env node
const { execSync } = require("child_process");

try {
  execSync("npm run lint");
  execSync("npm test");
} catch (err) {
  console.log(err.stdout.toString());
  process.exit(1);
}
