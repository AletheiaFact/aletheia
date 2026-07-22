import { useCommands } from "@remirror/react";
import React, { useCallback } from "react";
import { getEditorClaimCardContentHtml } from "./EditorClaimCard/EditorClaimCard";
import AletheiaButton from "../AletheiaButton";
import { useTranslations } from "next-intl";

const AddPersonalityEditorButton = ({
    personalityId,
    personalityName,
    disabled,
}) => {
    const commands = useCommands();
    const tDebates = useTranslations("debates");
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
            {`${tDebates("addClaimEditorButton")} ${personalityName}`}
        </AletheiaButton>
    );
};

export default AddPersonalityEditorButton;
