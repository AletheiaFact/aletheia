import React, { useEffect } from "react";
import { Remirror, ThemeProvider, useRemirror } from "@remirror/react";
import { AllStyledComponent } from "@remirror/styles/emotion";
import { Affix, Row } from "antd";
import { useAtom } from "jotai";

import { debateAtom } from "../../atoms/debate";
import colors from "../../styles/colors";
import AddPersonalityEditorButton from "./AddPersonalityEditorButton";
import { EditorAutoSaveTimerProvider } from "./EditorAutoSaveTimerProvider";
import EditorClaimCardExtension from "./EditorClaimCard/EditorClaimCardExtension";
import { EditorContent } from "./EditorContent";

const extensions = () => [
    new EditorClaimCardExtension({ disableExtraAttributes: true }),
];

export interface IEditorProps {
    claim: any;
}

const Editor = ({ claim }: IEditorProps) => {
    const personalities = claim.personalities;
    const { manager, state } = useRemirror({
        extensions,
        content: claim?.editor?.editorContentObject,
        stringHandler: "html",
    });
    const [, setDebate] = useAtom(debateAtom);
    useEffect(() => {
        setDebate({
            sources: claim?.sources,
            title: claim?.title,
            date: claim?.date,
            debateId: claim?.contentId,
        });
    }, [claim, setDebate]);

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
                            reference={claim.editor.reference}
                        >
                            <Affix>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-evenly",
                                        backgroundColor: colors.grayPrimary,
                                        padding: "10px",
                                    }}
                                >
                                    {personalities.map((personality) => {
                                        return (
                                            <AddPersonalityEditorButton
                                                key={personality._id}
                                                personalityId={personality._id}
                                                personalityName={
                                                    personality.name
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            </Affix>
                            <EditorContent reference={claim._id} />
                        </EditorAutoSaveTimerProvider>
                    </Remirror>
                </ThemeProvider>
            </AllStyledComponent>
        </Row>
    );
};

export default Editor;
