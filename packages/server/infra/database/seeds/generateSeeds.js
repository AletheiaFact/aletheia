'use strict';

const seeder = require('mongoose-seed');
const Config = require('../../config/config');

const fs = require('fs');
const seeders = [
    {
        'model': 'Personality',
        'documents': JSON.parse(fs.readFileSync('./infra/database/seeds/personality.json', 'utf8'))
    }
];

// Connect to MongoDB via Mongoose
seeder.setLogOutput(false);
seeder.connect(Config.mongodb, () => {
    // Load Mongoose models
    seeder.loadModels([
        './app/model/personality'
    ]);
    // Clear specified collections
    seeder.clearModels(['Personality', 'Users', 'Groups'], () => {
    // Callback to populate DB once collections have been cleared
        seeder.populateModels(seeders, () => {
            seeder.disconnect();
        });
    });
});
