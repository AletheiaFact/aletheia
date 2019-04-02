'use strict';

const yaml = require('js-yaml');
const fs = require('fs');

class ServiceRunner {
    start() {
        const conf = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));
        conf.services.forEach((service) => {
            const app = require(`../${service.module}`);
            app(service);
        });
    }
}

module.exports = ServiceRunner;
