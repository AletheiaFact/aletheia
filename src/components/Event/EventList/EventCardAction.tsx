import React from "react";
import AletheiaButton, { ButtonType } from "../../Button";

interface EventCardActionProps {
    label: string;
    href: string;
}

const EventCardAction = ({ label, href }: EventCardActionProps) => {
    return (
        <AletheiaButton
            data-cy={"testOpenEventButton"}
            type={ButtonType.blue}
            href={href}
            target="_blank"
        >
            {label}
        </AletheiaButton>
    );
};

export default EventCardAction;
