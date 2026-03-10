import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";

type EventHeaderContentProps = {
    title: string;
    description: string;
};

const EventHeaderContent = ({ title, description }: EventHeaderContentProps) => {
    return (
        <Grid
            item
            xl={8}
            md={10}
            xs={12}
            className="eventHeaderContent"
        >
            <Typography
                variant="h1"
                className="title"
            >
                {title}
            </Typography>
            <Typography
                className="description"
                variant="body1"
            >
                {description}
            </Typography>
        </Grid>
    );
};

export default EventHeaderContent;
