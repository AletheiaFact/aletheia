import { Grid } from "@mui/material";
import { TrackingCardProps } from "../../types/Tracking";
import TrackingCard from "./TrackingCard";
import CTAFolder from "../Home/CTAFolder";

const TrackingView = ({ verificationRequestId }: TrackingCardProps) => {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={11} lg={8}>
        <TrackingCard
          verificationRequestId={verificationRequestId}
        />
      </Grid>
      <Grid item xs={12} sm={11} lg={8}>
        <CTAFolder />
      </Grid>
    </Grid>
  );
};

export default TrackingView;
