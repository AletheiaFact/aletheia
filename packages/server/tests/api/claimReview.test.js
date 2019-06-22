const request = require('supertest');
const mongoose = require('mongoose');
const initApp = require('../../app')

// const setup = require('../setup');

let app;

clearDB = done => {
    for (var i in mongoose.connection.collections) {
        if (mongoose.connection.collections[i]) {
            mongoose.connection.collections[i].drop()
            // Catch err when try to drop unexistent collection
            .catch(err => {});
        }
    }
    return done();
}

beforeAll(done => {
    // Init app before passing it to request
    return app = initApp({
        conf:{
            db: {
                path: 'mongodb://localhost/test',
                callback: err => {
                    if (err) { throw err }
                    return clearDB(done);
                }
            }
        },
        env: 'test'
    })
});

describe('Test claimReview CRUD', () => {

    test('list all should return empty', async done => {
        const response = await request(await app).get("/claimreview");
        // console.log(Object.keys(response.res))
        expect(response.res.statusCode).toBe(200);
        expect(JSON.parse(response.res.text)).toEqual([]);
        done();
    });

    test('post invalid claim review', async done => {
        const response = await request(await app)
        .post("/claimreview")
        .send({ classification: 'banana' });
        // console.log(Object.keys(response.res))
        expect(response.res.statusCode).toBe(400)
        done();
    });

    // Cache posted claim review to retrieve it later
    let claimReview;

    test('post valid claim review and retrieve it', async done => {
        let body = {
            classification: 'true',
            claim: "5d0c2a9d72c2686adf8bb9d1",
            sentence_hash: "76f3fad0dc83796c73d97837ab78098d",
            sentence_content: " Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus.",
        }
        let response = await request(await app)
        .post("/claimreview")
        .send(body);

        expect(response.res.statusCode).toBe(200)
        claimReview = JSON.parse(response.res.text)

        done();
    });

    test('get valid posted review', async done => {
        // expect(resObj).toEqual(body)
        response = await request(await app)
        .get(`/claimreview/${claimReview._id}`);
        expect(response.res.statusCode).toBe(200)
        expect(JSON.parse(response.res.text)).toEqual(claimReview)

        done();
    })

    afterAll(done => {
        request.end();
        mongoose.connection.disconnect();
        clearDB(done)
        return done();
    });
});