const Config = require("../../config");
const User = require("../../../../api/model/userModel");
const mongoose = require("mongoose");
const { sendEmail, getEmailBody, getEmailSubject } = require("./sendEmail");
const { randomBytes } = require("crypto");

const SEED_TEST_ENVIRONMENT = process.env.SEED_TEST_ENVIRONMENT || null;

let usersData;

/**
 * Separate test users JSON from prod ones
 * for security and privacy reasons because prodUsers.json is git ignored
 */
if (!SEED_TEST_ENVIRONMENT) {
    usersData = require("../../../../../prodUsers.json");
} else {
    usersData = require("./users.json");
}

if (!Array.isArray(usersData) && usersData.length === 0) {
    throw Error("Users array is invalid");
}

const generatePassword = () => {
    const buf = randomBytes(8);

    if (SEED_TEST_ENVIRONMENT) {
        return process.env.DEVELOPMENT_PASSWORD;
    }

    return buf.toString("hex");
};

const seedSingleUser = (userData, password) => {
    return User.register(new User(userData), password)
        .then(async (user) => {
            console.log(`${userData.email} seeded`);
            if (userData.sendAuthDetails && !SEED_TEST_ENVIRONMENT) {
                const emailResponse = await sendEmail(
                    userData.email,
                    getEmailSubject(),
                    getEmailBody(userData.email, password)
                );
                console.log(emailResponse);
                console.log(`E-mail enviado para ${userData.email}`);
            }
            return user;
        })
        .catch((e) => {
            console.error(e);
            console.log(`${userData.email} not seeded`);
            return null;
        });
};

(async () => {
    await mongoose.connect(Config.mongodb, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    });
    return Promise.all(
        usersData.map((userData) => {
            const password = generatePassword();
            return seedSingleUser(userData, password);
        })
    );
})().then((result) => {
    console.log(result);
    mongoose.disconnect();
    console.log("Seed script finished.");
});
