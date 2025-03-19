import { MessageManager } from "../components/Messages";
import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/daily-report`,
});

const sendDailyReportEmail = (topic, nameSpace, t) => {
    return request
        .post(`/topic/${topic}/send/${nameSpace}`)
        .then((response) => {
            MessageManager.showMessage("success", t("notification:sendDailyReportSuccess"));
            return response.data;
        })
        .catch((err) => {
            MessageManager.showMessage("error",t("notification:sendDailyReportError"));
            throw err;
        });
};

const DailyReportApi = {
    sendDailyReportEmail,
};

export default DailyReportApi;
