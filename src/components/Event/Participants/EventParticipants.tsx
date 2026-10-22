import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { EventParticipant } from "../../../types/event";
import { sanitizeUrl } from "../../../utils/ValidateUrl";
import { visibleParticipants } from "./participantDrafts";

const MAX_VISIBLE = 12;

interface EventParticipantsProps {
    participants?: EventParticipant[];
}

/** Logo row of participating organizations, inside the event header card. */
const EventParticipants = ({ participants = [] }: EventParticipantsProps) => {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    if (!participants.length) {
        return null;
    }

    const { visible, hiddenCount } = visibleParticipants(
        participants,
        MAX_VISIBLE,
        expanded
    );
    const canCollapse = participants.length > MAX_VISIBLE;

    return (
        <section
            className="eventParticipants"
            aria-labelledby="event-participants-title"
            data-cy="testEventParticipants"
        >
            <div className="eventParticipantsHeader">
                <h2
                    id="event-participants-title"
                    className="eventParticipantsTitle"
                >
                    {t("events:participantsTitle")}
                </h2>
                <span className="eventParticipantsCount">
                    {t("events:participantsCount", {
                        count: participants.length,
                    })}
                </span>
            </div>

            <ul className="eventParticipantsList">
                {visible.map(({ organization }) => {
                    const website = sanitizeUrl(organization.website);
                    const logo = (
                        <img
                            src={sanitizeUrl(organization.logo?.content)}
                            alt={organization.name}
                        />
                    );

                    return (
                        <li key={organization._id}>
                            {website ? (
                                <a
                                    className="eventParticipantTile"
                                    href={website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={organization.name}
                                    data-cy="testEventParticipant"
                                >
                                    {logo}
                                </a>
                            ) : (
                                <span
                                    className="eventParticipantTile"
                                    title={organization.name}
                                    data-cy="testEventParticipant"
                                >
                                    {logo}
                                </span>
                            )}
                        </li>
                    );
                })}
                {canCollapse && (
                    <li>
                        <button
                            type="button"
                            className="eventParticipantTile eventParticipantsToggle"
                            aria-expanded={expanded}
                            onClick={() => setExpanded(!expanded)}
                            data-cy="testEventParticipantsToggle"
                        >
                            {expanded
                                ? t("events:participantsSeeLess")
                                : t("events:participantsSeeAll", {
                                      count: hiddenCount,
                                  })}
                        </button>
                    </li>
                )}
            </ul>
        </section>
    );
};

export default EventParticipants;
