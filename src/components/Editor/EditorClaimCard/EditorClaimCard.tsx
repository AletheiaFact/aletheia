import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { uniqueId } from "remirror";

import claimApi from "../../../api/claim";
import personalityApi from "../../../api/personality";
import SpeechApi from "../../../api/speechApi";
import { debateAtom } from "../../../atoms/debate";
import colors from "../../../styles/colors";
import { ContentModelEnum } from "../../../types/enums";
import Button, { ButtonType } from "../../Button";
import ClaimCardHeader from "../../Claim/ClaimCardHeader";
import ClaimSpeechBody from "../../Claim/ClaimSpeechBody";
import ClaimSkeleton from "../../Skeleton/ClaimSkeleton";
import { useDispatch } from "react-redux";
import actions from "../../../store/actions";

const EditorClaimCardContent = ({ children }) => {
    return (
        <div
            style={{
                backgroundColor: colors.neutralTertiary,
                width: "100%",
                maxWidth: "400px",
                height: "auto",
                padding: "10px",
                margin: "10px",
            }}
        >
            {children}
        </div>
    );
};

export const EditorClaimCard = ({
    personalityId,
    speechId,
    forwardRef,
    node,
}) => {
    const dispatch = useDispatch();
    const [speech, setSpeech] = useState(undefined);
    const { t } = useTranslation();
    const [personality, setPersonality] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [claim] = useAtom(debateAtom);
    const { date, debateId, isLive } = claim;

    const fetchSpeech = async (speechId: string) => {
        SpeechApi.getById(speechId).then(setSpeech);
    };

    const createSpeechFromEditor = async (
        t,
        { personality, content }
    ): Promise<void> => {
        setIsLoading(true);
        claimApi
            .updateDebate(debateId, t, {
                content,
                personality: personality._id,
                isLive,
            })
            .then((newSpeech: any) => {
                fetchSpeech(newSpeech._id).then(() => {
                    setIsLoading(false);
                });
            });
    };

    /**
     * Initial component load.
     * * Lookup for personality and claim data
     */
    useEffect(() => {
        if (personalityId) {
            personalityApi
                .getPersonality(personalityId, { language: "pt" }, t)
                .then(setPersonality);
        }
        if (speechId) {
            fetchSpeech(speechId);
        }
    }, [personalityId, speechId, t]);

    const dispatchPersonality = () => {
        dispatch(actions.setSelectPersonality(personality));
    };

    /**
     * If speech changes from undefined/null to an existing object
     * we need to define the speechId in the node attribute
     */
    useEffect(() => {
        node.attrs.speechId = speech ? speech._id : speechId;
    }, [node.attrs, speech, speechId]);

    return personality ? (
        <div
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                padding: "10px 0px",
            }}
        >
            <div contentEditable={false}>
                <ClaimCardHeader
                    personality={personality}
                    date={date || new Date()}
                    claimType={ContentModelEnum.Debate}
                />
            </div>
            <div
                style={{
                    width: "100%",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {!speech ? (
                    <>
                        <EditorClaimCardContent>
                            <p ref={forwardRef} />
                        </EditorClaimCardContent>
                        <Button
                            loading={isLoading}
                            type={ButtonType.blue}
                            onClick={() =>
                                createSpeechFromEditor(t, {
                                    personality,
                                    content: node?.textContent,
                                })
                            }
                            disabled={isLoading}
                            data-cy={"testSaveButton"}
                        >
                            {t("debates:saveButtonLabel")}
                        </Button>
                    </>
                ) : (
                    <div
                        style={{
                            width: "100%",
                            justifyContent: "center",
                            display: "flex",
                        }}
                        contentEditable={false}
                    >
                        <EditorClaimCardContent>
                            <ClaimSpeechBody
                                paragraphs={
                                    Array.isArray(speech.content)
                                        ? speech.content
                                        : [speech.content]
                                }
                                showHighlights={true}
                                handleSentenceClick={dispatchPersonality}
                            />
                        </EditorClaimCardContent>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
                padding: "10px 0px",
            }}
        >
            <p style={{ display: "none" }} ref={forwardRef} />
            <ClaimSkeleton />
        </div>
    );
};

interface IClaimCardContentHtml {
    personalityId: string;
    speechId?: string;
}

export const getEditorClaimCardContentHtml = ({
    personalityId,
    speechId,
}: IClaimCardContentHtml) => `
    <div
        card-id="${uniqueId()}"
        data-personality-id="${personalityId}"
        ${() => speechId && `data-speech-id="${speechId}"`}
    >
        <p></p>
    </div>`;
