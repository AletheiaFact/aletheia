import axios from "axios";

const login = (params, t) => {
    return axios
        .post(
            `${process.env.API_URL}/user/signin`,
            { ...params },
            { withCredentials: true }
        )
        .then(response => {
            return { login: true, ...response };
        })
        .catch(e => {
            const response = e?.response?.data || {
                message: t("login:failedMessage")
            };
            return { login: false, ...response };
        });
};

const validateSession = (params, t) => {
    return axios
        .get(`${process.env.API_URL}/user/validate`, { withCredentials: true })
        .then(response => {
            return { login: true, ...response };
        })
        .catch(e => {
            const response = e?.response?.data || {
                message: t("login:failedMessage")
            };
            return { login: false, ...response };
        });
};

export default {
    login,
    validateSession
};
