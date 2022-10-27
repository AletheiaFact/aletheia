import React, { useContext, useEffect, useState } from "react";
import personalityApi from "../../../api/personality";
import claimApi from "../../../api/claim";
import ClaimCardHeader from "../../Claim/ClaimCardHeader";
import { useTranslation } from "next-i18next";
import Button, { ButtonType } from "../../Button";
import ClaimSpeechBody from "../../Claim/ClaimSpeechBody";
import { uniqueId } from "remirror";
import colors from "../../../styles/colors";
import ClaimSkeleton from "../../Skeleton/ClaimSkeleton";
import { ClaimCollectionContext } from "../Editor";

const EditorClaimCardContent = ({ children }) => {
    return (
        <div
            style={{
                backgroundColor: colors.grayTertiary,
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
    claimId,
    forwardRef,
    node,
}) => {
    const [claim, setClaim] = useState(undefined);
    const { t } = useTranslation();
    const [personality, setPersonality] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const { sources, title } = useContext<any>(ClaimCollectionContext);
    const createClaimFromEditor = async (
        t,
        { personality, content },
        setClaim
    ): Promise<void> => {
        const date = new Date();
        setIsLoading(true);
        const res = await claimApi.save(t, {
            content,
            title: `${title} ${date.toISOString().slice(11, 19)}`,
            personality: personality._id,
            contentModel: "Speech",
            date,
            sources,
            recaptcha: "dummy", // the server will get the referer and bypass recaptcha
        });
        setIsLoading(false);
        setClaim(res);
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
        if (claimId) {
            claimApi.getById(claimId, t).then(setClaim);
        }
    }, [personalityApi, claimApi]);

    /**
     * If claim changes from undefined/null to an existing object
     * we need to retrieve the full claim content from the API
     * and define the claimId in the node attribute
     */
    useEffect(() => {
        if (claim?.claimId) {
            node.attrs.claimId = claim?.claimId;
            claimApi.getById(claim?.claimId, t).then(setClaim);
        }
    }, [!claim]);

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
                    date={claim?.date || new Date()}
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
                {!claim ? (
                    <>
                        <EditorClaimCardContent>
                            <p ref={forwardRef} />
                        </EditorClaimCardContent>
                        <Button
                            loading={isLoading}
                            type={ButtonType.blue}
                            onClick={() =>
                                createClaimFromEditor(
                                    t,
                                    {
                                        personality,
                                        content: node?.textContent,
                                    },
                                    setClaim
                                )
                            }
                            disabled={isLoading}
                            data-cy={"testSaveButton"}
                        >
                            {t("claimForm:saveButton")}
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
                            {claim && (
                                <ClaimSpeechBody
                                    paragraphs={
                                        Array.isArray(claim.content)
                                            ? claim.content
                                            : [claim.content]
                                    }
                                    showHighlights={true}
                                />
                            )}
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
    claimId?: string;
}

export const getEditorClaimCardContentHtml = ({
    personalityId,
    claimId,
}: IClaimCardContentHtml) => `
    <div
        card-id="${uniqueId()}"
        data-personality-id="${personalityId}"
        ${() => claimId && `data-claim-id="${claimId}"`}
    >
        <p></p>
    </div>`;
