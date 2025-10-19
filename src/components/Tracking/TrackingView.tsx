import { useEffect, useState } from "react";
import TrackingApi from "../../api/trackingApi";
import LocalizedDate from "../LocalizedDate";

interface TrackingViewProps {
  verificationRequestId: string;
}

interface TrackingItem {
  id: string;
  status: string;
  date: string;
}

const TrackingView = ({ verificationRequestId }: TrackingViewProps) => {
  const [trackingTimeline, setTrackingTimeline] = useState<TrackingItem[]>([]);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const trackingData = await TrackingApi.getTrackingById(verificationRequestId);

        setTrackingTimeline(trackingData);
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
        {trackingTimeline.map((item) => (
          <li key={item.id} style={{ fontSize: 14 }}>
            <LocalizedDate date={new Date(item.date)} showTime />{` - `}
            <strong>Status:</strong> {item.status} <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackingView;
