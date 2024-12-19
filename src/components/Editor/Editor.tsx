import React, { useEffect } from "react";
import { Remirror, ThemeProvider, useRemirror } from "@remirror/react";
import { AllStyledComponent } from "@remirror/styles/emotion";
import { useAtom } from "jotai";
import { Grid, Box } from "@mui/material";
import { debateAtom } from "../../atoms/debate";
import colors from "../../styles/colors";
import AddPersonalityEditorButton from "./AddPersonalityEditorButton";
import { EditorAutoSaveTimerProvider } from "./EditorAutoSaveTimerProvider";
import EditorClaimCardExtension from "./EditorClaimCard/EditorClaimCardExtension";
import { EditorContent } from "./EditorContent";
import Button, { ButtonType } from "../Button";
import { useTranslation } from "next-i18next";
import claimApi from "../../api/claim";
import { useDispatch } from "react-redux";
import { ActionTypes } from "../../store/types";

const extensions = () => [
    new EditorClaimCardExtension({ disableExtraAttributes: true }),
];

export interface IEditorProps {
    claim: any;
    sitekey: string;
}

const Editor = ({ claim, sitekey }: IEditorProps) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const personalities = claim.personalities;
    const { manager, state } = useRemirror({
        extensions,
        content: claim?.editor?.editorContentObject,
        stringHandler: "html",
    });

    dispatch({
        type: ActionTypes.SET_SELECTED_TARGET,
        selectedTarget: claim,
    });
    dispatch({
        type: ActionTypes.SET_SITEKEY,
        sitekey,
    });

    const [debate, setDebate] = useAtom(debateAtom);
    const isLive = debate.isLive;

    useEffect(() => {
        setDebate({
            sources: claim?.sources,
            title: claim?.title,
            date: claim?.date,
            debateId: claim?.contentId,
            isLive: claim?.content.isLive,
        });
    }, [claim, setDebate]);

    const handleClickUpdateStatus = () => {
        claimApi
            .updateDebate(debate.debateId, t, {
                content: "",
                personality: "",
                isLive: !isLive,
            })
            .then((res) => {
                setDebate({
                    ...debate,
                    isLive: res.isLive,
                });
            });
    };

    return (
        <Grid
            container
            style={{
                width: "100%",
                paddingTop: "32px",
                justifyContent: "center",
            }}
        >
            <Grid item sm={11} style={{ display: "flex", justifyContent: "end" }}>
                <Button
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={handleClickUpdateStatus}
                    buttonType={ButtonType.whiteBlack}
                >
                    {t(
                        `debates:${
                            isLive
                                ? "finishDebateButtonLabel"
                                : "reopenDebateButtonLabel"
                        }`
                    )}
                </Button>
            </Grid>
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
                            <Box
                                sx={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 10,
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    backgroundColor: colors.neutral,
                                    padding: "10px",
                                }}
                            >
                                {personalities.map((personality) => (
                                    <AddPersonalityEditorButton
                                        key={personality._id}
                                        personalityId={personality._id}
                                        personalityName={personality.name}
                                        disabled={!isLive}
                                    />
                                ))}
                            </Box>
                            <EditorContent
                                reference={claim.editor.reference}
                                isLive={isLive}
                            />
                        </EditorAutoSaveTimerProvider>
                    </Remirror>
                </ThemeProvider>
            </AllStyledComponent>
        </Grid>
    );
};

export default Editor;
