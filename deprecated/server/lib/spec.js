const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

function mergeChunkedProperties(spec, chunk) {
    // Merge chunked properties into spec
    Object.keys(chunk).forEach((prop) => {
        // Check 2nd level of the object components
        if (prop === "components") {
            spec.components = spec.components || {};
            mergeChunkedProperties(spec.components, chunk.components);
        } else {
            if (chunk[prop].constructor === Object) {
                spec[prop] = Object.assign(spec[prop] || {}, chunk[prop]);
            } else {
                spec[prop] = chunk[prop];
            }
        }
    });
}

/**
 * Load swagger spec from directory with multiple files, parse objects and create one single
 * object to be served as the spec
 * @param  {!String} dir  directory to load files
 * @param  {!Object} spec spec object for recursion loading through several depth of directories
 * @return {!Object}      the spec object fully loaded
 */
function load(dir, spec) {
    spec = spec || {};
    fs.readdirSync(dir).forEach((filename) => {
        const resolvedPath = path.resolve(dir, filename);
        const isDirectory = fs.statSync(resolvedPath).isDirectory();
        let chunk;

        if (isDirectory) {
            // get new chunk from recursion through the directory file
            chunk = load(resolvedPath, {});
        } else {
            chunk = yaml.safeLoad(fs.readFileSync(`${dir}/${filename}`));
        }
        mergeChunkedProperties(spec, chunk);
    });

    return spec;
}

module.exports = {
    load,
};
