import React, { useCallback } from "react";
import { EditorComponent, useHelpers } from "@remirror/react";
import claimCollectionApi from "../../api/claimCollectionApi";
import { useTranslation } from "next-i18next";
import AletheiaButton from "../Button";
import { callbackTimerAtom } from "../../machines/callbackTimer/provider";
import { useAtom } from "jotai";

export const EditorContent = ({ claimCollectionId }) => {
    const { t } = useTranslation();
    // this needs to be called inside the scope of the provider
    // to start the machine with the correct context
    useAtom(callbackTimerAtom);
    function SaveButton() {
        const { getJSON } = useHelpers();
        const handleClick = useCallback(() => {
            claimCollectionApi.update(claimCollectionId, t, {
                editorContentObject: getJSON(),
            });
        }, [getJSON]);

        return (
            <AletheiaButton
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleClick}
            >
                {t("debates:saveButtonLabel")}
            </AletheiaButton>
        );
    }

    return (
        <>
            <EditorComponent />
            <SaveButton />
        </>
    );
};
