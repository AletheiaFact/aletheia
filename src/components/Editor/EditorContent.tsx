import React, { useCallback } from "react";
import { EditorComponent, useHelpers } from "@remirror/react";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";

import EditorApi from "../../api/editor";
import { callbackTimerAtom } from "../../machines/callbackTimer/provider";
import AletheiaButton from "../Button";

export const EditorContent = ({ reference }) => {
    const { t } = useTranslation();
    // this needs to be called inside the scope of the provider
    // to start the machine with the correct context
    useAtom(callbackTimerAtom);
    function SaveButton() {
        const { getJSON } = useHelpers();
        const handleClick = useCallback(() => {
            return EditorApi.update(reference, getJSON(), t);
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
