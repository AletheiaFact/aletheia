import { Grid, Chip, Typography, Box, IconButton } from "@mui/material";
import { EventPayload, EventsActions, EventsState } from "../../../types/event";
import { useAtom } from "jotai";
import { currentUserRole } from "../../../atoms/currentUser";
import { isStaff } from "../../../utils/GetUserPermission";
import EditIcon from "@mui/icons-material/Edit";
import EventDrawer from "../EventForm/EventDrawer";
import { isEditDrawerOpen } from "../../../atoms/editDrawer";
import { formatMonthYear } from "../../../helpers/formatTimeAgo";
import EventParticipants from "../Participants/EventParticipants";

type EventHeaderContentProps = {
    currentEvent: EventPayload;
    state: EventsState;
    actions: EventsActions;
};

const EventHeaderContent = ({
    currentEvent,
    state,
    actions,
}: EventHeaderContentProps) => {
    const { badge, name, description, startDate, location, participants } =
        currentEvent;
    const [role] = useAtom(currentUserRole);
    const [open, setOpen] = useAtom(isEditDrawerOpen);

    // The slug (and so the URL) never changes on update: just refresh.
    const handleSave = () => actions.router.reload();

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
                            {`${location} • ${formatMonthYear(startDate)}`}
                        </Typography>
                    </Box>
                    {isStaff(role) && (
                        <IconButton size="small">
                            <EditIcon
                                data-cy="testEventEditButton"
                                className="edit-icon"
                                color="primary"
                                onClick={() => setOpen(true)}
                            />
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
                <Typography
                    variant="h1"
                    className="title"
                    data-cy="testEventTitle"
                >
                    {name}
                </Typography>
                <Typography
                    className="description"
                    variant="body1"
                    data-cy="testEventDescription"
                >
                    {description}
                </Typography>
                <EventParticipants participants={participants} />
            </Grid>
            <Grid className="bottomGradient" />
        </Grid>
    );
};

export default EventHeaderContent;
