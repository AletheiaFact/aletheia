import React, { useEffect } from "react";
import { Remirror, ThemeProvider, useRemirror } from "@remirror/react";
import { AllStyledComponent } from "@remirror/styles/emotion";
import { Affix, Col, Row } from "antd";
import { useAtom } from "jotai";

import { interviewAtom } from "../../atoms/interview";
import colors from "../../styles/colors";
import AddPersonalityEditorButtonInterview from "./AddPersonalityEditorButtonInterview";
import { EditorAutoSaveTimerProvider } from "./EditorAutoSaveTimerProvider";
import EditorClaimCardExtension from "./EditorClaimCard-interview/EditorClaimCardExtension";
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

    const [interview, setInterview] = useAtom(interviewAtom);
    const isLive = interview.isLive;

    useEffect(() => {
        setInterview({
            sources: claim?.sources,
            title: claim?.title,
            date: claim?.date,
            interviewId: claim?.contentId,
            isLive: claim?.content.isLive,
        });
    }, [claim, setInterview]);

    const handleClickUpdateStatus = () => {
        claimApi
            .updateInterview(interview.interviewId, t, {
                content: "",
                personality: "",
                isLive: !isLive,
            })
            .then((res) => {
                setInterview({
                    ...interview,
                    isLive: res.isLive,
                });
            });
    };

    return (
        <Row
            style={{
                width: "100%",
                paddingTop: "32px",
                justifyContent: "center",
            }}
        >
            <Col span={21} style={{ display: "flex", justifyContent: "end" }}>
                <Button
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={handleClickUpdateStatus}
                    type={ButtonType.whiteBlack}
                >
                    {t(
                        `interviews:${isLive
                            ? "finishInterviewButtonLabel"
                            : "reopenInterviewButtonLabel"
                        }`
                    )}
                </Button>
            </Col>
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
                                            <AddPersonalityEditorButtonInterview
                                                key={personality._id}
                                                personalityId={personality._id}
                                                personalityName={
                                                    personality.name
                                                }
                                                disabled={!isLive}
                                            />
                                        );
                                    })}
                                </div>
                            </Affix>
                            <EditorContent
                                reference={claim.editor.reference}
                                isLive={isLive}
                            />
                        </EditorAutoSaveTimerProvider>
                    </Remirror>
                </ThemeProvider>
            </AllStyledComponent>
        </Row>
    );
};

export default Editor;
