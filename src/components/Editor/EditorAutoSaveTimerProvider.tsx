import React, { useCallback } from "react";
import { useHelpers } from "@remirror/react";
import claimCollectionApi from "../../api/claimCollectionApi";
import { useTranslation } from "next-i18next";
import { CallbackTimerProvider } from "./CallbackTimerProvider";

export const EditorAutoSaveTimerProvider = ({
    claimCollectionId,
    children,
}) => {
    const { getJSON } = useHelpers();
    const { t } = useTranslation();
    const autoSaveCallback = useCallback(() => {
        return claimCollectionApi.update(claimCollectionId, t, {
            editorContentObject: getJSON(),
        });
    }, [getJSON]);

    return (
        <CallbackTimerProvider callback={autoSaveCallback}>
            {children}
        </CallbackTimerProvider>
    );
};
