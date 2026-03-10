import Grid from "@mui/material/Grid";
import { FullEventResponse } from "../../../types/event";
import EventBox from "./EventView.style";
import EventHeaderContent from "./EventHeaderContent";

type EventViewProps = {
    fullEvent: FullEventResponse;
};

const EventView = ({ fullEvent }: EventViewProps) => {
    const { badge, name, description } = fullEvent
    return (
        <EventBox>
            <Grid container className="eventMainContent">
                <EventHeaderContent
                    badge={badge}
                    title={name}
                    description={description}
                />
            </Grid>
        </EventBox>
    );
};

export default EventView;
