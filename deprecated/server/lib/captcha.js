const axios = require("axios");
const qs = require("querystring");

const RECAPTCHA_API_URL = "https://www.google.com/recaptcha/api";

const checkResponse = async function (secret, response) {
    const res = await axios.post(
        `${RECAPTCHA_API_URL}/siteverify`,
        qs.stringify({
            secret,
            response,
        })
    );
    return res && res.data;
};

module.exports = {
    checkResponse,
};
