'use strict';

const mongoose = require('mongoose');

beforeEach((done) => {
    /*
    Define clearDB function that will loop through all
    the collections in our mongoose connection and drop them.
  */
    function clearDB() {
        for (const i in mongoose.connection.collections) {
            if ({}.hasOwnProperty.call(mongoose.connection.collections, i)) {
                mongoose.connection.collections[i].remove(() => {});
            }
        }
        return done();
    }

    /*
    If the mongoose connection is closed,
    start it up using the test url and database name
    provided by the node runtime ENV
  */
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(
            `mongodb://localhost:27017/test`,// ${process.env.TEST_SUITE}`, // <------- IMPORTANT
            (err) => {
                if (err) {
                    throw err;
                }
                return clearDB();
            }
        );
    } else {
        return clearDB();
    }
});

afterEach((done) => {
    mongoose.disconnect();
    return done();
});

afterAll((done) => {
    return done();
});
