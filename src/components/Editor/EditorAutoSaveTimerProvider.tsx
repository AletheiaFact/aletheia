import React, { useCallback } from "react";
import { useHelpers } from "@remirror/react";
import claimCollectionApi from "../../api/claimCollectionApi";
import { useTranslation } from "next-i18next";
import { Provider as CallbackTimerProvider } from "jotai";
import { callbackTimerInitialConfig } from "../../machines/callbackTimer/provider";
import { initialContext } from "../../machines/callbackTimer/context";

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

    const timerConfig = {
        ...initialContext,
        callbackFunction: autoSaveCallback,
    };

    return (
        <CallbackTimerProvider
            //@ts-ignore
            initialValues={[[callbackTimerInitialConfig, timerConfig]]}
        >
            {children}
        </CallbackTimerProvider>
    );
};
