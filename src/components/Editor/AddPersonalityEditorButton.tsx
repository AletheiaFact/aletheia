import { useCommands } from "@remirror/react";
import React, { useCallback } from "react";
import { getEditorClaimCardContentHtml } from "./EditorClaimCard/EditorClaimCard";
import AletheiaButton from "../Button";
import { useTranslation } from "next-i18next";

const AddPersonalityEditorButton = ({ personalityId, personalityName }) => {
    const commands = useCommands();
    const { t } = useTranslation();
    const handleClick = useCallback(() => {
        commands.focus("end");
        commands.insertHtml(
            getEditorClaimCardContentHtml({
                personalityId,
            }),
            {
                selection: "end",
            }
        );
    }, [commands, personalityId]);

    return (
        <AletheiaButton
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleClick}
        >
            {`${t("debates:addClaimEditorButton")} ${personalityName}`}
        </AletheiaButton>
    );
};

export default AddPersonalityEditorButton;
