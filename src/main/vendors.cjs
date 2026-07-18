const fs = require("node:fs/promises");
const path = require("node:path");

const fallbackPath = path.join(__dirname, "../data/vendors.json");

async function getVendors() {
  const raw = await fs.readFile(fallbackPath, "utf8");
  return JSON.parse(raw);
}

module.exports = {
  getVendors
};
