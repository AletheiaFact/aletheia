import { EventPayload } from "../../../types/event";
import EventBox from "./EventView.style";
import EventHeaderContent from "./EventHeaderContent";
import EventReviewsList from "./EventReviewList";
import { NameSpaceEnum } from "../../../types/Namespace";
import useEventsHook from "../hooks/useEventsHook";
import EventVerificationRequestList from "./EventVerificationRequestList";

type EventViewProps = {
    event: EventPayload;
    nameSpace: NameSpaceEnum;
};

const EventView = ({ event, nameSpace }: EventViewProps) => {
    const { state, actions } = useEventsHook()
    const { mainTopic, filterTopics } = event

    return (
        <EventBox>
            <EventHeaderContent currentEvent={event} state={state} actions={actions} />

            {state.viewMode === "left" && (
                <EventReviewsList
                    mainTopic={mainTopic}
                    filterTopics={filterTopics}
                    nameSpace={nameSpace}
                    state={state}
                    actions={actions}
                />
            )}

            {state.viewMode === "right" && (
                <EventVerificationRequestList
                    mainTopic={mainTopic}
                    filterTopics={filterTopics}
                    nameSpace={nameSpace}
                    state={state}
                    actions={actions}
                />
            )}
        </EventBox>
    );
};

export default EventView;
