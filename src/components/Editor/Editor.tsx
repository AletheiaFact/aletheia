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
import { CallbackTimerProvider } from "./CallbackTimerProvider";
import { ThemeProvider } from "@remirror/react";
import { AllStyledComponent } from "@remirror/styles/emotion";
import { Row } from "antd";

const extensions = () => [
    new EditorClaimCardExtension({ disableExtraAttributes: true }),
];

const EditorAutoSaveTimerProvider = ({ claimCollectionId, children }) => {
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

export interface IEditorProps {
    claimCollection: any;
}

const Editor = ({ claimCollection }: IEditorProps) => {
    const { personalities } = claimCollection;
    const { t } = useTranslation();
    const { manager, state } = useRemirror({
        extensions,
        content: claimCollection?.editorContentObject,
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
                {
                    selection: 0,
                }
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
        <Row
            style={{
                width: "100%",
                paddingTop: "32px",
                justifyContent: "center",
            }}
        >
            <AllStyledComponent
                style={{
                    padding: "10px",
                    width: "90%",
                }}
            >
                <ThemeProvider>
                    <Remirror
                        manager={manager}
                        initialContent={state}
                        autoFocus={true}
                    >
                        <EditorAutoSaveTimerProvider
                            claimCollectionId={claimCollection._id}
                        >
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
                        </EditorAutoSaveTimerProvider>
                    </Remirror>
                </ThemeProvider>
            </AllStyledComponent>
        </Row>
    );
};

export default Editor;
