import React, { useEffect, useState } from "react";
import personalityApi from "../../../api/personality";
import claimApi from "../../../api/claim";
import ClaimCardHeader from "../../Claim/ClaimCardHeader";
import { useTranslation } from "next-i18next";
import Button, { ButtonType } from "../../Button";
import ClaimSpeechBody from "../../Claim/ClaimSpeechBody";
import { uniqueId } from "remirror";

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

    const createClaimFromEditor = async (
        t,
        { personality, content },
        setClaim
    ): Promise<void> => {
        const date = new Date();
        setIsLoading(true);
        const res = await claimApi.save(t, {
            content,
            title: "Debate Test " + date.toString(), // TODO: define a global title for all claims
            personality: personality._id,
            contentModel: "Speech",
            date,
            sources: ["https://test.org"], // TODO: define a global source for the debate
            recaptcha: "lalala", // TODO: bypass recaptcha for this action
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
            console.log(claim?.claimId);
            node.attrs.claimId = claim?.claimId;
            claimApi.getById(claim?.claimId, t).then(setClaim);
        }
    }, [!claim]);

    return personality ? (
        <div>
            <div contentEditable={false}>
                <ClaimCardHeader
                    personality={personality}
                    date={claim?.date || new Date()}
                />
            </div>
            {!claim ? (
                <>
                    <p ref={forwardRef} />
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
                claim && (
                    <ClaimSpeechBody
                        paragraphs={
                            Array.isArray(claim.content)
                                ? claim.content
                                : [claim.content]
                        }
                        showHighlights={true}
                    />
                )
            )}
        </div>
    ) : (
        <></>
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
        <p>...</p>
    </div>`;
