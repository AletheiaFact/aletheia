const fs = require("fs");
const yaml = require("js-yaml");

function _replaceEnvVars(config) {
    const envRegex = /{\s*env\(([^,\s)]+),?\s*([^)]+)?\)\s*}/g;
    if (Buffer.isBuffer(config)) {
        config = config.toString();
    }
    return config.replace(envRegex, (match, envName, defValue) => {
        if (process.env[envName] !== undefined) {
            return process.env[envName];
        }
        if (defValue !== undefined) {
            return defValue;
        }
        return "";
    });
}
function loadConfig(defaultConfigFilePath) {
    const configFileIndex = process.argv.findIndex((arg) => arg === "-c");
    const configFilePath =
        configFileIndex !== -1 ? process.argv[configFileIndex + 1] : null;

    let configContent = fs.readFileSync(
        configFilePath || defaultConfigFilePath,
        "utf8"
    );
    configContent = _replaceEnvVars(configContent);

    const doc = yaml.load(configContent);
    const { conf: options } = doc.services[0];

    return options;
}

export default loadConfig;
