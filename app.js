'use strict';

const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

function loadModels(dir) {
    fs.readdirSync(dir).map((fname) => {
        const resolvedPath = path.resolve(dir, fname);
        const isDirectory = fs.statSync(resolvedPath).isDirectory();
        if (isDirectory) {
            loadModels(app, resolvedPath);
        } else if (/\.js$/.test(fname)) {
            return require(`${dir}/${fname}`);
        }
        return false;
    });
}

function loadRoutes(dir, app) {
    fs.readdirSync(dir).map((fname) => {
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
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
}

function createServer(app, options) {
    app.listen(options.conf.port);
    // eslint-disable-next-line no-console
    console.log(`${options.name} running at http://localhost:${options.conf.port}`);
}

function initApp(options) {
    loadModels('./api/model');
    // mongoose instance connection url connection
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/Aletheia');
}

module.exports = (options) => {
    // TODO: Promisify it all
    initApp(options);
    loadRoutes('./routes', app);
    createServer(app, options);

    return app;
};
