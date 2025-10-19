import { useEffect, useState } from "react";
import TrackingApi from "../../api/trackingApi";
import LocalizedDate from "../LocalizedDate";
import { TrackingResponseDTO, TrackingViewProps } from "../../types/Tracking";

const initialTrackingState: TrackingResponseDTO = {
  currentStatus: "",
  historyEvents: [],
};

const TrackingView = ({ verificationRequestId }: TrackingViewProps) => {
  const [tracking, setTracking] = useState<TrackingResponseDTO>(initialTrackingState);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const trackingData = await TrackingApi.getTrackingById(verificationRequestId);

        setTracking(trackingData);
      } catch (error) {
        console.error(error);
      }
    };

    if (verificationRequestId) fetchTracking();
  }, [verificationRequestId]);

  return (
    <div style={{ fontSize: 14, display: "grid", justifyContent: "center" }}>
      <h1>Tracking Timeline</h1>
      <ul>
        {tracking.historyEvents.map((item) => (
          <li key={item.id} style={{ fontSize: 14 }}>
            <LocalizedDate date={new Date(item.date)} showTime />{` - `}
            <strong>Status:</strong> {item.status} <br />
          </li>
        ))}
        <li>
          Status atual: {tracking.currentStatus}
        </li>
      </ul>
    </div>
  );
};

export default TrackingView;
