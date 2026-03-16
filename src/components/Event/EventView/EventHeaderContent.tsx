import { Grid, Chip, Typography } from "@mui/material";

type EventHeaderContentProps = {
    badge: string;
    location: string;
    startDate: Date;
    title: string;
    description: string;
};

const EventHeaderContent = ({
    badge,
    location,
    startDate,
    title,
    description,
}: EventHeaderContentProps) => {
    //this could be a util
    const date = new Date(startDate);
    const month = date.toLocaleString("pt-BR", { month: "long" });
    const year = date.getFullYear();
    const formattedDate = `${month[0].toUpperCase()}${month.slice(1)} de ${year}`;

    return (
        <Grid container className="eventContainerBase mainContent">
            <Grid item xs={11} sm={11} md={8} className="eventSection eventSectionInfo">
                <Grid item className="eventSectionHeader">
                    <Chip
                        className="eventChipText eventChip"
                        size="small"
                        label={badge}
                    />
                    <Typography
                        className="eventChipText eventLocationText"
                        variant="body1"
                    >
                        {`${location} • ${formattedDate}`}
                    </Typography>
                </Grid>
                <Typography variant="h1" className="title">
                    {title}
                </Typography>
                <Typography className="description" variant="body1">
                    {description}
                </Typography>
            </Grid>
            <Grid className="bottomGradient" />
        </Grid>
    );
};

export default EventHeaderContent;
