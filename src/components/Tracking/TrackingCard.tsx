import * as React from "react";
import { useEffect, useState } from "react";
import TrackingApi from "../../api/trackingApi";
import { TrackingResponseDTO, TrackingCardProps } from "../../types/Tracking";
import CardBase from "../CardBase";
import Loading from "../Loading";
import TrackingStep from "./TrackingStepper";
import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";

const initialTrackingState: TrackingResponseDTO = {
  currentStatus: null,
  historyEvents: [],
};

const TrackingCard = ({ verificationRequestId }: TrackingCardProps) => {
  const [trackingData, setTrackingData] = useState<TrackingResponseDTO>(initialTrackingState);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const { currentStatus, historyEvents } = trackingData;

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const data = await TrackingApi.getTrackingById(verificationRequestId);
        setTrackingData(data);
      } catch (error) {
        console.error("Error when searching for tracking:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (verificationRequestId) {
      setIsLoading(true);
      fetchTracking();
    }
  }, [verificationRequestId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <CardBase
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
        padding: "24px",
        margin: "24px 0",
        gap: 12
      }}
    >
      <Typography variant="h5">
        {t("tracking:verificationProgress")}
      </Typography>
      <TrackingStep
        currentStatus={currentStatus}
        historyEvents={historyEvents}
      />
    </CardBase>
  );
};

export default TrackingCard;
