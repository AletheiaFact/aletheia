const mongodb_host = process.env.MONGODB_HOST || "localhost";

module.exports = {
    mongodb: `mongodb://${mongodb_host}/Aletheia`
};
