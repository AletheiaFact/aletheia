import React, { createContext, useEffect } from "react";
import { Remirror, useRemirror, ThemeProvider } from "@remirror/react";
import EditorClaimCardExtension from "./EditorClaimCard/EditorClaimCardExtension";
import { AllStyledComponent } from "@remirror/styles/emotion";
import { Affix, Row } from "antd";
import { EditorAutoSaveTimerProvider } from "./EditorAutoSaveTimerProvider";
import AddPersonalityEditorButton from "./AddPersonalityEditorButton";
import colors from "../../styles/colors";
import { EditorContent } from "./EditorContent";
import { useAtom } from "jotai";
import { claimCollectionAtom } from "../../atoms/claimCollection";

const extensions = () => [
    new EditorClaimCardExtension({ disableExtraAttributes: true }),
];

export interface IEditorProps {
    claim: any;
}

export const ClaimCollectionContext = createContext({});

const Editor = ({ claim }: IEditorProps) => {
    const personalities = claim.personalities;
    const { manager, state } = useRemirror({
        extensions,
        content: claim?.editor?.editorContentObject,
        stringHandler: "html",
    });
    const [, setClaimCollection] = useAtom(claimCollectionAtom);
    useEffect(() => {
        setClaimCollection({
            sources: claim?.sources,
            title: claim?.title,
        });
    }, [claim, setClaimCollection]);

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
                            <EditorContent claimCollectionId={claim._id} />
                        </EditorAutoSaveTimerProvider>
                    </Remirror>
                </ThemeProvider>
            </AllStyledComponent>
        </Row>
    );
};

export default Editor;
