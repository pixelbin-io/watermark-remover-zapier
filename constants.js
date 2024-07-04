const packageInfo = require("./package.json");
const integrationVersion = packageInfo.version;
const zapierCoreVersion = packageInfo.dependencies["zapier-platform-core"];

const INTEGRATION_PLATFORM = `WatermarkremoverIntegration/${integrationVersion} (Zapier/${zapierCoreVersion})`;

module.exports = INTEGRATION_PLATFORM;
