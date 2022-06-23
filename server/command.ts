#!/usr/bin/env node

const ServiceRunner = require("service-runner");
const runner = new ServiceRunner()
runner.start().then(() => {
    runner.stop()
});

export {};
