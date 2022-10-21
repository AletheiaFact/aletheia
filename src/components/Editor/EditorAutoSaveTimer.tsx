import { assign, createMachine } from "xstate";
import { useHelpers } from "@remirror/react";
import { useTranslation } from "next-i18next";
import React, { useCallback } from "react";
import claimCollectionApi from "../../api/claimCollection";
import { useMachine } from "@xstate/react";

interface EditorAutoSaveTimerContext {
    elapsed: number;
    stopped: boolean;
    interval: number;
    autoSaveCallback: any;
}

type EditorAutoSaveTimerEvent = {
    type: "AUTO_SAVE";
};

export const EditorAutoSaveTimerMachine = {
    initial: "running",
    context: {
        elapsed: 0,
        stopped: false,
        interval: 30,
        autoSaveCallback: () => {
            console.log("AUTO_SAVE");
        },
    },
    states: {
        running: {
            invoke: {
                src: (context) => (cb) => {
                    const interval = setInterval(() => {
                        context.autoSaveCallback();
                        cb("AUTO_SAVE");
                    }, 1000 * context.interval);

                    return () => {
                        clearInterval(interval);
                    };
                },
            },
            on: {
                "": {
                    target: "paused",
                    cond: (context) => context.stopped,
                },
                AUTO_SAVE: {
                    actions: assign({
                        elapsed: (context) =>
                            +(context.elapsed + context.interval).toFixed(2),
                    }),
                },
            },
        },
        paused: {
            on: {
                "": {
                    target: "running",
                    cond: (context) => !context.stopped,
                },
            },
        },
    },
};

export const EditorAutoSaveTimer = ({ claimCollectionId }) => {
    const { getJSON } = useHelpers();
    const { t } = useTranslation();
    EditorAutoSaveTimerMachine.context.autoSaveCallback = useCallback(() => {
        claimCollectionApi.update(claimCollectionId, t, {
            editorContentObject: getJSON(),
        });
    }, [getJSON]);
    const [state, send] = useMachine(
        createMachine<EditorAutoSaveTimerContext, EditorAutoSaveTimerEvent>(
            EditorAutoSaveTimerMachine
        )
    );

    return <></>;
};
