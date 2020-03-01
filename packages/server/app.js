const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

function loadModels(dir) {
    fs.readdirSync(dir).map(fname => {
        const resolvedPath = path.resolve(dir, fname);
        const isDirectory = fs.statSync(resolvedPath).isDirectory();
        if (isDirectory) {
            loadModels(resolvedPath);
        } else if (/\.js$/.test(fname)) {
            return require(`${dir}/${fname}`);
        }
        return false;
    });
}

function loadDB(app) {
    return new Promise((resolve, reject) => {
        loadModels("./api/model");
        // mongoose instance connection url connection
        mongoose.Promise = global.Promise;
        mongoose
            .connect(
                (app.config.db && app.config.db.path) ||
                    "mongodb://localhost/Aletheia",
                (app.config.db && app.config.db.callback) || {}
            )
            .then(() => resolve(app));
    });
}

function loadRoutes(app, dir) {
    return new Promise((resolve, reject) => {
        fs.readdirSync(dir).map(fname => {
            const resolvedPath = path.resolve(dir, fname);
            const isDirectory = fs.statSync(resolvedPath).isDirectory();
            if (isDirectory) {
                loadRoutes(app, resolvedPath);
            } else if (/\.js$/.test(fname)) {
                const routeModule = require(`${dir}/${fname}`);
                const route = routeModule(app);
                if (route !== undefined) {
                    app.use(route.path, route.router);
                }
                return route;
            }
            return false;
        });

        resolve(app);
    });
}

function createServer(app) {
    if (app.env && app.env === "test") {
        return app;
    }
    return new Promise((resolve, reject) => {
        app.listen(app.config.port);
        app.logger.log(
            `${app.serviceName} with PID ${process.pid} listening on ${app
                .config.interface || "*"}:${app.config.port}`
        );
        resolve(app);
    });
}

function initApp(options) {
    const app = express();

    app.serviceName = options.name; // this app's config options
    app.config = options.config; // this app's config options
    app.logger = options.logger; // the logging device
    app.metrics = options.metrics; // the metrics

    if (!app.config && !app.config.port) {
        app.config.port = 8888;
    }

    // CORS
    app.all("*", (req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        );
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    return Promise.resolve(app);
}

module.exports = options => {
    // TODO: Promisify it all
    return initApp(options)
        .then(loadDB)
        .then(app => loadRoutes(app, "./routes"))
        .then(createServer);
};
