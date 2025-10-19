import { useEffect, useState } from "react";
import TrackingApi from "../../api/trackingApi";
import LocalizedDate from "../LocalizedDate";

interface TrackingViewProps {
  targetId: string;
}

interface TrackingItem {
  status: string;
  date: string;
}

const TrackingView = ({ targetId }: TrackingViewProps) => {
  const [trackingTimeline, setTrackingTimeline] = useState<TrackingItem[]>([]);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const trackingData = await TrackingApi.getTrackingByTarget(targetId);

        setTrackingTimeline(trackingData);
      } catch (error) {
        console.error(error);
      }
    };

    if (targetId) fetchTracking();
  }, [targetId]);

  return (
    <div style={{ fontSize: 14, display: "grid", justifyContent: "center" }}>
      <h1>Tracking Timeline</h1>
      <ul>
        {trackingTimeline.map((item, index) => (
          <li style={{ fontSize: 14 }}>
            <LocalizedDate date={new Date(item.date)} showTime />{` - `}
            <strong>Status:</strong> {item.status} <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackingView;
