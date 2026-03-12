import { EventPayload } from "../../../types/event";
import EventBox from "./EventView.style";
import EventHeaderContent from "./EventHeaderContent";
import EventReviews from "./EventReviewList";
import { NameSpaceEnum } from "../../../types/Namespace";

type EventViewProps = {
    event: EventPayload;
    nameSpace: NameSpaceEnum;
};

const EventView = ({ event, nameSpace }: EventViewProps) => {
    const { badge, name, description, mainTopic, filterTopics } = event
    return (
        <EventBox>
                <EventHeaderContent
                    badge={badge}
                    title={name}
                    description={description}
            />

                <EventReviews
                    mainTopic={mainTopic}
                    filterTopics={filterTopics}
                    nameSpace={nameSpace}
            />
        </EventBox>
    );
};

export default EventView;
