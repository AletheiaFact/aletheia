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
import claimCollectionApi from "../../api/claimCollection";
import { useTranslation } from "next-i18next";
import { EditorAutoSaveTimer } from "./EditorAutoSaveTimer";

const extensions = () => [
    new EditorClaimCardExtension({ disableExtraAttributes: true }),
];

export interface IEditorProps {
    claimCollection: any;
}

const Editor: React.FC = ({ claimCollection }: IEditorProps) => {
    const { personalities } = claimCollection;
    const { t } = useTranslation();
    const { manager, state } = useRemirror({
        extensions,
        content: claimCollection?.editorContentObject || {},
        stringHandler: "html",
    });

    function SaveButton() {
        const { getJSON } = useHelpers();
        const handleClick = useCallback(() => {
            claimCollectionApi.update(claimCollection._id, t, {
                editorContentObject: getJSON(),
            });
        }, [getJSON]);

        return (
            <button
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleClick}
            >
                Save
            </button>
        );
    }

    const LoadButton = ({ personalityId }) => {
        const commands = useCommands();
        const handleClick = useCallback(() => {
            commands.focus();
            commands.insertHtml(
                getEditorClaimCardContentHtml({
                    personalityId,
                }),
                { selection: "end" }
            );
        }, [commands, personalityId]);

        return (
            <button
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleClick}
            >
                Load
            </button>
        );
    };

    return (
        <div style={{ padding: 16 }}>
            <Remirror manager={manager} initialContent={state} autoFocus={true}>
                {Array.isArray(personalities) &&
                    personalities.map((personality) => {
                        return (
                            <LoadButton
                                key={personality._id}
                                personalityId={personality._id}
                            />
                        );
                    })}
                <EditorComponent />
                <SaveButton />
                <EditorAutoSaveTimer claimCollectionId={claimCollection._id} />
            </Remirror>
        </div>
    );
};

export default Editor;
