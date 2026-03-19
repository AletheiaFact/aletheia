import { Grid, Chip, Typography, Box, IconButton } from "@mui/material";
import { EventPayload, EventsActions, EventsState } from "../../../types/event";
import { useAtom } from "jotai";
import { currentUserRole } from "../../../atoms/currentUser";
import { isStaff } from "../../../utils/GetUserPermission";
import EditIcon from "@mui/icons-material/Edit";
import EventDrawer from "../EventForm/EventDrawer";
import { isEditDrawerOpen } from "../../../atoms/editDrawer";

type EventHeaderContentProps = {
    currentEvent: EventPayload,
    state: EventsState;
    actions: EventsActions;
};

const EventHeaderContent = ({
    currentEvent,
    state,
    actions
}: EventHeaderContentProps) => {
    const { badge, name, description, startDate, location, slug } = currentEvent
    const [role] = useAtom(currentUserRole);
    const [open, setOpen] = useAtom(isEditDrawerOpen);

    const handleSave = (updatedEvent) => {
        const slugChanged = slug !== updatedEvent.slug;

        if (slugChanged) {
            const newRoute = `/event/${updatedEvent.data_hash}/${updatedEvent.slug}`;

            actions.router.replace(newRoute);
        } else {
           actions.router.reload()
        }
    };

    //this could be a util
    const date = new Date(startDate);
    const month = date.toLocaleString("pt-BR", { month: "long" });
    const year = date.getFullYear();
    const formattedDate = `${month[0].toUpperCase()}${month.slice(1)} de ${year}`;

    return (
        <Grid container className="eventContainerBase mainContent">
            <Grid item xs={11} md={8} className="eventSection eventSectionInfo">
                <Grid item className="eventTopBar">
                    <Box className="eventSectionHeader">
                        <Chip
                            className="eventChipText eventChip"
                            size="small"
                            label={badge}
                            data-cy="testEventBadgeChip"
                        />
                        <Typography
                            className="eventChipText eventLocationText"
                            variant="body1"
                            data-cy="testEventLocationText"
                        >
                            {`${location} • ${formattedDate}`}
                        </Typography>
                    </Box>
                    {isStaff(role) && (
                        <IconButton size="small">
                            <EditIcon
                                data-cy="testEventEditButton"
                                className="edit-icon"
                                color="primary"
                                onClick={() => setOpen(true)} />
                        </IconButton>
                    )}
                    {open && (
                        <EventDrawer
                            open={open}
                            onClose={() => setOpen(false)}
                            currentEvent={currentEvent}
                            onSave={handleSave}
                            state={state}
                            actions={actions}
                        />
                    )}
                </Grid>
                <Typography variant="h1" className="title" data-cy="testEventTitle">
                    {name}
                </Typography>
                <Typography className="description" variant="body1" data-cy="testEventDescription">
                    {description}
                </Typography>
            </Grid>
            <Grid className="bottomGradient" />
        </Grid >
    );
};

export default EventHeaderContent;
