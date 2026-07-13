import * as React from "react";
import { useEffect, useState } from "react";
import TrackingApi from "../../api/trackingApi";
import { TrackingResponseDTO, TrackingCardProps } from "../../types/Tracking";
import CardBase from "../CardBase";
import Loading from "../Loading";
import TrackingStep from "./TrackingStepper";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";

const initialTrackingState: TrackingResponseDTO = {
  currentStatus: null,
  historyEvents: [],
};

const TrackingCard = ({ verificationRequestId, isMinimal }: TrackingCardProps) => {
  const [trackingData, setTrackingData] = useState<TrackingResponseDTO>(initialTrackingState);
  const [isLoading, setIsLoading] = useState(true);
  const tTracking = useTranslations("tracking");
  const t = useTranslations() as any;

  const { currentStatus, historyEvents } = trackingData;

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const data = await TrackingApi.getTrackingById(verificationRequestId, t);
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
        height: isMinimal ? "100%" : "auto",
        margin: isMinimal ? 0 : "24px 0",
        gap: 4
      }}
    >
      <Typography
        style={{
          fontFamily: "initial",
          fontSize: 26,
          lineHeight: 1.35
        }}
        variant="h1"
      >
        {tTracking("verificationProgress")}
      </Typography>
      <TrackingStep
        currentStatus={currentStatus}
        historyEvents={historyEvents}
        isMinimal={isMinimal}
      />
    </CardBase>
  );
};

export default TrackingCard;
