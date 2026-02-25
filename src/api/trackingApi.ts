import axios from "axios";
import { HEX24 } from "../types/History";

const request = axios.create({
  withCredentials: true,
  baseURL: `/api/tracking`,
});

const getTrackingById = (verificationRequestId: string) => {
  if (!HEX24.test(verificationRequestId)) {
    console.error("Invalid verificationRequestId format");
    return Promise.resolve([]);
  }

  return request
    .get(`/${verificationRequestId}`)
    .then((response) => response.data)
    .catch((err) => {
      console.error(err);
      return [];
    });
};

const TrackingApi = {
  getTrackingById,
};

export default TrackingApi;
