import { createMachine, assign } from "xstate";

export interface EditClaimContext {
    claimId: string;
    baseRevisionId: string;
    title: string;
    date: string;
    error?: string;
    conflictRevisionId?: string;
}

export type EditClaimEvent =
    | { type: "SET_TITLE"; value: string }
    | { type: "SET_DATE"; value: string }
    | { type: "COMMIT" }
    | { type: "COMMIT_OK" }
    | { type: "COMMIT_CONFLICT"; currentRevisionId: string }
    | { type: "COMMIT_FAIL"; error: string }
    | { type: "DISCARD" }
    | { type: "REFRESH" };

export const editClaimMachine = createMachine<EditClaimContext, EditClaimEvent>(
    {
        id: "editClaim",
        initial: "editing",
        states: {
            editing: {
                on: {
                    SET_TITLE: {
                        actions: assign({ title: (_, e) => e.value }),
                    },
                    SET_DATE: { actions: assign({ date: (_, e) => e.value }) },
                    COMMIT: "committing",
                    DISCARD: "abandoned",
                },
            },
            committing: {
                on: {
                    COMMIT_OK: "done",
                    COMMIT_CONFLICT: {
                        target: "conflict",
                        actions: assign({
                            conflictRevisionId: (_, e) => e.currentRevisionId,
                        }),
                    },
                    COMMIT_FAIL: {
                        target: "editing",
                        actions: assign({ error: (_, e) => e.error }),
                    },
                },
            },
            conflict: {
                on: {
                    REFRESH: "editing",
                    DISCARD: "abandoned",
                },
            },
            done: { type: "final" },
            abandoned: { type: "final" },
        },
    }
);
