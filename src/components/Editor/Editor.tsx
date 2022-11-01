import React, { createContext, useCallback } from "react";
import {
    EditorComponent,
    Remirror,
    useHelpers,
    useRemirror,
    ThemeProvider,
} from "@remirror/react";
import EditorClaimCardExtension from "./EditorClaimCard/EditorClaimCardExtension";
import claimCollectionApi from "../../api/claimCollectionApi";
import { useTranslation } from "next-i18next";
import { AllStyledComponent } from "@remirror/styles/emotion";
import { Affix, Row } from "antd";
import { EditorAutoSaveTimerProvider } from "./EditorAutoSaveTimerProvider";
import AddPersonalityEditorButton from "./AddPersonalityEditorButton";
import colors from "../../styles/colors";
import AletheiaButton from "../Button";

const extensions = () => [
    new EditorClaimCardExtension({ disableExtraAttributes: true }),
];

export interface IEditorProps {
    claimCollection: any;
}

export const ClaimCollectionContext = createContext({});

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
            <AletheiaButton
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleClick}
            >
                {t("debates:saveButtonLabel")}
            </AletheiaButton>
        );
    }

    return (
        <Row
            style={{
                width: "100%",
                paddingTop: "32px",
                justifyContent: "center",
            }}
        >
            <ClaimCollectionContext.Provider
                value={{
                    sources: claimCollection?.sources,
                    title: claimCollection?.title,
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
                                <Affix>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-evenly",
                                            backgroundColor: colors.grayPrimary,
                                            padding: "10px",
                                        }}
                                    >
                                        {Array.isArray(personalities) &&
                                            personalities.map((personality) => {
                                                return (
                                                    <AddPersonalityEditorButton
                                                        key={personality._id}
                                                        personalityId={
                                                            personality._id
                                                        }
                                                        personalityName={
                                                            personality.name
                                                        }
                                                    />
                                                );
                                            })}
                                    </div>
                                </Affix>
                                <EditorComponent />
                                <SaveButton />
                            </EditorAutoSaveTimerProvider>
                        </Remirror>
                    </ThemeProvider>
                </AllStyledComponent>
            </ClaimCollectionContext.Provider>
        </Row>
    );
};

export default Editor;
