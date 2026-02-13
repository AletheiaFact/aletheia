import axios from "axios";
import { HEX24 } from "../types/History";
import { MessageManager } from "../components/Messages";
import { TFunction } from "i18next";

const request = axios.create({
  withCredentials: true,
  baseURL: `/api/tracking`,
});

const getTrackingById = (verificationRequestId: string, t: TFunction) => {
  if (!HEX24.test(verificationRequestId)) {
    MessageManager.showMessage("error", t("tracking:errorInvalidId"));
    return Promise.reject(new Error("Invalid ID"));
  }

  return request
    .get(`/${verificationRequestId}`)
    .then((response) => response.data)
    .catch((err) => {
      MessageManager.showMessage("error", t("tracking:errorFetchData"));
      throw err;
    });
};

const TrackingApi = {
  getTrackingById,
};

export default TrackingApi;
