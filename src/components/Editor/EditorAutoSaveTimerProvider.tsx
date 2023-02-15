import React, { useCallback } from "react";
import { useHelpers } from "@remirror/react";
import { useTranslation } from "next-i18next";
import { Provider as CallbackTimerProvider } from "jotai";
import { callbackTimerInitialConfig } from "../../machines/callbackTimer/provider";
import { initialContext } from "../../machines/callbackTimer/context";
import EditorApi from "../../api/editor";

export const EditorAutoSaveTimerProvider = ({ reference, children }) => {
    const { getJSON } = useHelpers();
    const { t } = useTranslation();
    const autoSaveCallback = useCallback(() => {
        return EditorApi.update(reference, getJSON(), t);
    }, [getJSON]);

    const timerConfig = {
        ...initialContext,
        callbackFunction: autoSaveCallback,
        interval: 10000,
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
