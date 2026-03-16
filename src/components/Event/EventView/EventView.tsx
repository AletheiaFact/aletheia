import { EventPayload } from "../../../types/event";
import EventBox from "./EventView.style";
import EventHeaderContent from "./EventHeaderContent";
import EventReviews from "./EventReviewList";
import { NameSpaceEnum } from "../../../types/Namespace";
import useEventsHook from "../hooks/useEventsHook";

type EventViewProps = {
    event: EventPayload;
    nameSpace: NameSpaceEnum;
};

const EventView = ({ event, nameSpace }: EventViewProps) => {
    const { state, actions } = useEventsHook()
    const { badge, location, name, startDate, description, mainTopic, filterTopics } = event

    return (
        <EventBox>
            <EventHeaderContent
                badge={badge}
                location={location}
                startDate={startDate}
                title={name}
                description={description}
            />


            {state.viewMode === "left" && (
                <EventReviews
                    mainTopic={mainTopic}
                    filterTopics={filterTopics}
                    nameSpace={nameSpace}
                    state={state}
                    actions={actions}
                />
            )}

            {state.viewMode === "right" && (
                "in-progress"
            )}
        </EventBox>
    );
};

export default EventView;
