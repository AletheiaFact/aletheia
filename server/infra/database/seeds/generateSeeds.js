const seeder = require("mongoose-seed");
const Config = require("../config");

const fs = require("fs");
const seeders = [
    {
        model: "Personality",
        documents: JSON.parse(
            fs.readFileSync(
                "./server/infra/database/seeds/personality.json",
                "utf8"
            )
        )
    }
];

// Connect to MongoDB via Mongoose
seeder.setLogOutput(false);
seeder.connect(Config.mongodb, () => {
    // Load Mongoose models
    seeder.loadModels(["./server/api/model/personalityModel.ts"]);
    // Clear specified collections
    seeder.clearModels(["Personality"], () => {
        // Callback to populate DB once collections have been cleared
        seeder.populateModels(seeders, () => {
            seeder.disconnect();
        });
    });
});
