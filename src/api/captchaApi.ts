import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/validate-captcha`,
});

const validateCaptcha = (recaptcha: string) => {
    return request
        .post("/", { recaptcha })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log("error", err);
        });
};

const CaptchaApi = { validateCaptcha };

export default CaptchaApi;
