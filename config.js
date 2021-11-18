const YAML = require("yaml");
const { readFileSync } = require("fs");
const _ = require("lodash");
const ConfigStore = require("configstore");
let config = new ConfigStore("sso").get("config");

const YAML_CONFIG_FILE_PATH =
  process.env.YAML_CONFIG_FILE_PATH || "./config.yml";

try {
  let configFilePath = YAML_CONFIG_FILE_PATH;
  const yamlFile = readFileSync(configFilePath, "utf8");
  config = YAML.parse(yamlFile).config;
} catch (e) {
  console.log("[CONFIG] unable to read config file", e);
  process.exit(1);
}

if (!config) {
  console.log("[CONFIG] configuration file is required");
  process.exit(1);
}

try {
  _.map(process.env, (value, key) => {
    if (key && key.startsWith("CONFIG__")) {
      const configKeys = key.split("__");
      switch (configKeys.length) {
        case 2:
          config[key[1]] = value;
          break;
        case 3:
          config[configKeys[1]][configKeys[2]] = value;
          break;
        case 4:
          config[configKeys[1]][configKeys[2]][configKeys[3]] = value;
          break;
        case 5:
          config[configKeys[1]][configKeys[2]][configKeys[3]][configKeys[4]] =
            value;
          break;
      }
    }
  });
} catch (e) {
  console.log(
    "[CONFIG] Failed to read config variables from environment: ",
    e.message
  );
}

module.exports = config;
