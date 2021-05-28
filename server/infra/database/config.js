const mongodb_host = process.env.MONGODB_HOST || "localhost";
const mongodb_name = process.env.MONGODB_NAME || "Aletheia";

module.exports = {
    mongodb: `mongodb://${mongodb_host}/${mongodb_name}`,
};
