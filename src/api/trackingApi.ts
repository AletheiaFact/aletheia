import axios from "axios";

const request = axios.create({
  withCredentials: true,
  baseURL: `/api/tracking`,
});

const getTrackingByTarget = (targetId: string) => {
  return request
  .get(`/${targetId}`)
  .then(response => response.data)
  .catch((err)=>{
    console.error(err)
    return []; 
  });
};

const TrackingApi = {
  getTrackingByTarget,
};

export default TrackingApi;
