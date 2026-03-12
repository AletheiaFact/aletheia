import Grid from "@mui/material/Grid";
import { Chip, Typography } from "@mui/material";

type EventHeaderContentProps = {
    badge: string;
    title: string;
    description: string;
};

const EventHeaderContent = ({
    badge,
    title,
    description,
}: EventHeaderContentProps) => {
    return (
      <Grid container className="eventContainerBase mainContent">
          <Grid item xl={8} md={10} xs={12} className="eventSection">
              <Chip className="eventChip" size="small" label={badge} />
              <Typography variant="h1" className="title">
                  {title}
              </Typography>
              <Typography className="description" variant="body1">
                  {description}
              </Typography>
          </Grid>
      </Grid>
  );
};

export default EventHeaderContent;
