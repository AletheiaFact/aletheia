import React from "react";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";

interface EventCardActionProps {
    label: string;
    href: string;
}

const EventCardAction = ({ label, href }: EventCardActionProps) => {
    return (
        <AletheiaButton
            data-cy={"testOpenEventButton"}
            type={ButtonType.primary}
            href={href}
            target="_blank"
        >
            {label}
        </AletheiaButton>
    );
};

export default EventCardAction;
