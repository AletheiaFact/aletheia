import axios from "axios";

const request = axios.create({
  withCredentials: true,
  baseURL: `/api/tracking`,
});

const getTrackingById = (verificationRequestId: string) => {
  return request
  .get(`/${verificationRequestId}`)
  .then(response => response.data)
  .catch((err)=>{
    console.error(err)
    return []; 
  });
};

const TrackingApi = {
  getTrackingById,
};

export default TrackingApi;
