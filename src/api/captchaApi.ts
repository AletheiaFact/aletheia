import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/validate-captcha`,
});

const validateCaptcha = (recaptcha: string) => {
    return request
        .post("/", { recaptcha })
        .then((response) => {
            console.log("response validate captcha", response.data);
            return response.data;
        })
        .catch((err) => {
            console.log("error", err);
            return;
        });
};

const CaptchaApi = { validateCaptcha };

export default CaptchaApi;
