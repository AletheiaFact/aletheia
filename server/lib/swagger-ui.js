const util = require("util");
const fs = require("fs");
const readFileAsync = util.promisify(fs.readFile);
const path = require("path");
const HTTPError = require("./util").HTTPError;

// Swagger-ui-dist helpfully exporting the absolute path of its dist directory
const docRoot = `${require("swagger-ui-dist").getAbsoluteFSPath()}/`;
const DOC_CSP =
    "default-src 'none'; " +
    "script-src 'self' 'unsafe-inline'; connect-src *; " +
    "style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';";

function processRequest(app, req, res) {
    const reqPath = req.query.path || "/index.html";
    const filePath = path.join(docRoot, reqPath);

    // Disallow relative paths.
    // Test relies on docRoot ending on a slash.
    if (filePath.substring(0, docRoot.length) !== docRoot) {
        throw new HTTPError({
            status: 404,
            type: "not_found",
            title: "File not found",
            detail: `${reqPath} could not be found.`
        });
    }

    return readFileAsync(filePath)
        .then(body => {
            if (reqPath === "/index.html") {
                const css = `
                /* Removes Swagger's image from the header bar */
                .topbar-wrapper .link img {
                    display: none;
                }
                /* Adds the application's name in the header bar */
                .topbar-wrapper .link::after {
                    content: "${app.info.name}";
                }
                /* Removes input field and explore button from header bar */
                .swagger-ui .topbar .download-url-wrapper {
                    display: none;
                }
                /* Modifies the font in the information area */
                .swagger-ui .info li, .swagger-ui .info p, .swagger-ui .info table, .swagger-ui .info a {
                    font-size: 16px;
                    line-height: 1.4em;
                }
                /* Removes authorize button and section */
                .scheme-container {
                    display: none
                }
            `;
                body = body
                    .toString()
                    .replace(/((?:src|href)=['"])/g, "$1?doc&path=")
                    // Some self-promotion
                    .replace(/<\/style>/, `${css}\n  </style>`)
                    .replace(
                        /<title>[^<]*<\/title>/,
                        `<title>${app.info.name}</title>`
                    )
                    // Replace the default url with ours, switch off validation &
                    // limit the size of documents to apply syntax highlighting to
                    .replace(
                        /dom_id: '#swagger-ui'/,
                        'dom_id: "#swagger-ui", ' +
                            'docExpansion: "none", defaultModelsExpandDepth: -1, validatorUrl: null, displayRequestDuration: true'
                    )
                    .replace(
                        /"https:\/\/petstore.swagger.io\/v2\/swagger.json"/,
                        '"/?spec"'
                    );
            }

            let contentType = "text/html";
            if (/\.js$/.test(reqPath)) {
                contentType = "text/javascript";
                body = body
                    .toString()
                    .replace(
                        /underscore-min\.map/,
                        "?doc&path=lib/underscore-min.map"
                    )
                    .replace(
                        /sourceMappingURL=/,
                        "sourceMappingURL=/?doc&path="
                    );
            } else if (/\.png$/.test(reqPath)) {
                contentType = "image/png";
            } else if (/\.map$/.test(reqPath)) {
                contentType = "application/json";
            } else if (/\.ttf$/.test(reqPath)) {
                contentType = "application/x-font-ttf";
            } else if (/\.css$/.test(reqPath)) {
                contentType = "text/css";
                body = body
                    .toString()
                    .replace(/\.\.\/(images|fonts)\//g, "?doc&path=$1/")
                    .replace(
                        /sourceMappingURL=/,
                        "sourceMappingURL=/?doc&path="
                    );
            }

            res.header("content-type", contentType);
            res.header("content-security-policy", DOC_CSP);
            res.header("x-content-security-policy", DOC_CSP);
            res.header("x-webkit-csp", DOC_CSP);
            res.send(body.toString());
        })
        .catch({ code: "ENOENT" }, () => {
            res.status(404)
                .type("not_found")
                .send("not found");
        });
}

module.exports = {
    processRequest
};
