import React, { useCallback } from "react";
import {
    EditorComponent,
    Remirror,
    useCommands,
    useHelpers,
    useRemirror,
} from "@remirror/react";
import EditorClaimCardExtension from "./EditorClaimCard/EditorClaimCardExtension";
import { getEditorClaimCardContentHtml } from "./EditorClaimCard/EditorClaimCard";

const extensions = () => [
    new EditorClaimCardExtension({ disableExtraAttributes: true }),
];

const Editor: React.FC = () => {
    const { manager, state } = useRemirror({
        extensions,
        stringHandler: "html",
    });

    function SaveButton() {
        const { getJSON } = useHelpers();
        const handleClick = useCallback(
            () => alert(JSON.stringify(getJSON())),
            [getJSON]
        );

        return (
            <button
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleClick}
            >
                Save
            </button>
        );
    }

    function LoadButton() {
        const commands = useCommands();
        const handleClick = useCallback(() => {
            commands.focus();
            commands.insertHtml(
                getEditorClaimCardContentHtml({
                    personalityId: "634deecb367075aca9692b69",
                    claimId: "634df050afc18abbd5eff438",
                }),
                { selection: "end" }
            );
        }, [commands]);

        return (
            <button
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleClick}
            >
                Load
            </button>
        );
    }

    return (
        <div style={{ padding: 16 }}>
            <Remirror manager={manager} initialContent={state} autoFocus={true}>
                <EditorComponent />
                <SaveButton />
                <LoadButton />
            </Remirror>
        </div>
    );
};

export default Editor;
