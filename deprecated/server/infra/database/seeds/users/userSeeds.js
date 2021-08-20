const users = require("./users.json");

const generatePassword = () => {
    return "dummypassword";
};

const generateSeeds = () => {
    users.map((user) => {
        return {
            ...user,
            password: generatePassword(),
        };
    });
    return users;
};

module.exports = {
    generateSeeds,
};
