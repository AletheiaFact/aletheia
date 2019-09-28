'use strict';

const seeder = require('mongoose-seed');
const Config = require('../config');

const fs = require('fs');
const seeders = [
    {
        'model': 'Personality',
        'documents': JSON.parse(fs.readFileSync('./infra/database/seeds/personality.json', 'utf8'))
    },
    {
        'model': 'Claim',
        'documents': JSON.parse(fs.readFileSync('./infra/database/seeds/claim.json', 'utf8'))
    },
    {
        'model': 'ClaimReview',
        'documents': JSON.parse(fs.readFileSync('./infra/database/seeds/claimReview.json', 'utf8'))
    }
];

// Connect to MongoDB via Mongoose
seeder.setLogOutput(false);
seeder.connect(Config.mongodb, () => {
    // Load Mongoose models
    seeder.loadModels([
        './api/model/personalityModel',
        './api/model/claimModel',
        './api/model/claimReviewModel',
    ]);
    // Clear specified collections
    seeder.clearModels(['Personality', 'Claim', 'ClaimReview'], () => {
    // Callback to populate DB once collections have been cleared
        seeder.populateModels(seeders, () => {
            seeder.disconnect();
        });
    });
});
