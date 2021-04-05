const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const fs = require("fs");
const yaml = require("js-yaml");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const packageInfo = require("../../package.json");
const specLib = require("./lib/spec");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongodb_host = process.env.MONGODB_HOST || "localhost";
const mongodb_name = process.env.MONGODB_NAME || "Aletheia";

function loadModels(dir) {
    fs.readdirSync(dir).map(fname => {
        const resolvedPath = path.resolve(dir, fname);
        const isDirectory = fs.statSync(resolvedPath).isDirectory();
        if (isDirectory) {
            loadModels(resolvedPath);
        } else if (/\.(js|ts)$/.test(fname)) {
            return require(`${dir}/${fname}`);
        }
        return false;
    });
}

function loadDB(app) {
    return new Promise((resolve, reject) => {
        loadModels(`${__dirname}/api/model`);
        // mongoose instance connection url connection
        mongoose.Promise = global.Promise;
        mongoose
            .connect(app.config.db.path, app.config.db.callback)
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
            } else if (/\.(js|ts)$/.test(fname)) {
                const routeModule = require(`${dir}/${fname}`);
                const route = routeModule(app);
                if (route !== undefined) {
                    app.use(`/api${route.path}`, route.router);
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
            "info",
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
    app.info = packageInfo; // this app's package info

    // set up the spec
    if (!app.config.spec) {
        app.config.spec = specLib.load(`${__dirname}/spec`, {});
    }

    if (app.config.spec.constructor !== Object) {
        try {
            app.config.spec = yaml.safeLoad(fs.readFileSync(app.config.spec));
        } catch (e) {
            app.logger.log("warn/spec", `Could not load the spec: ${e}`);
            app.config.spec = {};
        }
    }
    if (!app.config.spec.openapi) {
        app.config.spec.openapi = "3.0.0";
    }
    if (!app.config.spec.info) {
        app.config.spec.info = {
            version: app.info.version,
            title: app.info.name,
            description: app.info.description
        };
    }
    app.config.spec.info.version = app.info.version;
    if (!app.config.spec.paths) {
        app.config.spec.paths = {};
    }

    if (!app.config && !app.config.port) {
        app.config.port = 8888;
    }
    if (!app.config.db) {
        app.config.db = {};
    }

    if (!app.config.db.path) {
        app.config.db.path = `mongodb://${mongodb_host}/${mongodb_name}`;
    }

    if (!app.config.db.callback) {
        app.config.db.callback = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        };
    }

    app.config.cors = app.config.cors === undefined ? "*" : app.config.cors;

    // CORS
    app.all("*", (req, res, next) => {
        if (app.config.cors !== false) {
            res.header("access-control-allow-origin", app.config.cors);
            res.header("access-control-allow-credentials", true);
            res.header(
                "access-control-allow-methods",
                "GET, PUT, POST, DELETE, HEAD, OPTIONS"
            );
            res.header(
                "access-control-allow-headers",
                "accept, x-requested-with, content-type"
            );
        }
        next();
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    return Promise.resolve(app);
}

function loadPassport(app) {
    const User = require("./api/model/userModel");
    passport.use(
        new LocalStrategy({ usernameField: "email" }, User.authenticate())
    );
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    app.use(cookieParser());
    app.use(
        session({
            secret: "replace_me",
            resave: false,
            saveUninitialized: false
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    return app;
}

function loadClient(app) {
    app.use(
        "/assets",
        express.static(path.join(__dirname, "../assets"), {
            index: false
        })
    );
    // Always set root endpoint to serve client html
    // Serving the html to every request and let react router deal with
    // the path in the browser
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../assets/index.html"));
    });
    return app;
}

module.exports = options => {
    // TODO: Promisify it all
    return initApp(options)
        .then(loadDB)
        .then(loadPassport)
        .then(app => loadRoutes(app, `${__dirname}/routes`))
        .then(loadClient)
        .then(createServer);
};
