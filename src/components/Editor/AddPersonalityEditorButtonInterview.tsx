import { useCommands } from "@remirror/react";
import React, { useCallback } from "react";
import { getEditorClaimCardContentHtml } from "./EditorClaimCard/EditorClaimCard";
import AletheiaButton from "../Button";
import { useTranslation } from "next-i18next";

const AddPersonalityEditorButtonInterview = ({
    personalityId,
    personalityName,
    disabled,
}) => {
    const commands = useCommands();
    const { t } = useTranslation();
    const handleClick = useCallback(() => {
        commands.focus();
        commands.insertHtml(
            getEditorClaimCardContentHtml({
                personalityId,
            }),
            {
                selection: 0,
            }
        );
    }, [commands, personalityId]);

    return (
        <AletheiaButton
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleClick}
            disabled={disabled}
        >
            {`${personalityName}`}
        </AletheiaButton>
    );
};

export default AddPersonalityEditorButtonInterview;
