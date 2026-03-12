import React from "react";
import EventCard from "./EventCard";
import GridList from "../../GridList";
import { EventPayload } from "../../../types/event";
import { TFunction } from "react-i18next";
import { currentNameSpace } from "../../../atoms/namespace";
import { useAtom } from "jotai";
import { NameSpaceEnum } from "../../../types/Namespace";

type EventsGridProps = {
  events: EventPayload[];
  t: TFunction;
  hasDivider?: boolean;
  disableSeeMoreButton?: boolean;
  title?: React.ReactNode;
};

const EventsGrid = ({
  events,
  t,
  hasDivider,
  disableSeeMoreButton,
  title,
}: EventsGridProps) => {
  const [nameSpace] = useAtom(currentNameSpace);

  const href =
    nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}/event` : "/event";

  return (
    <GridList
      title={title}
      dataSource={events}
      loggedInMaxColumns={6}
      href={href}
      disableSeeMoreButton={disableSeeMoreButton}
      seeMoreButtonLabel={t("events:seeMoreEventsButton")}
      hasDivider={hasDivider}
      renderItem={(event) => (
        <EventCard event={event} openEventLabel={t("events:openEvent")} />
      )}
    />
  );
};

export default EventsGrid;
