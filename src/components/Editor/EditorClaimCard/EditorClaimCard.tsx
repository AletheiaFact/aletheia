import React, { useEffect, useRef, useState } from "react";
import personalityApi from "../../../api/personality";
import claimApi from "../../../api/claim";
import ClaimCard from "../../Claim/ClaimCard";
import ClaimCardHeader from "../../Claim/ClaimCardHeader";
import { useHelpers, useRemirror } from "@remirror/react";
import { useTranslation } from "next-i18next";
import Button, { ButtonType } from "../../Button";

const createClaimFromEditor = async (t, { personality, content }): any => {
    const date = new Date();
    const res = await claimApi.save(t, {
        content,
        title: "Debate Test " + date.toString(), // TODO: define a global title for all claims
        personality: personality._id,
        // TODO: add a new input when twitter is supported
        contentModel: "Speech",
        date,
        sources: ["https://test.org"], // TODO: define a global source for the debate
        recaptcha: "lalala",
    });
    console.log(res);
};

export const EditorClaimCard = ({
    personalityId,
    claimId,
    forwardRef,
    node,
}) => {
    const [claim, setClaim] = useState(null);
    const { t } = useTranslation();
    const [personality, setPersonality] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const localRef = useRef<any>();

    const { getJSON } = useHelpers();
    useEffect(() => {
        personalityApi
            .getPersonality(personalityId, { language: "pt" }, () => {})
            .then(setPersonality);
        claimApi.getById(claimId, () => {}).then(setClaim);
    }, [personalityApi, claimApi]);

    console.log(node?.textContent);

    return (
        claim &&
        personality && (
            <div>
                <div contentEditable={false}>
                    <ClaimCardHeader
                        personality={personality}
                        date={claim?.date}
                        claimType={claim?.type}
                    />
                </div>
                <p ref={forwardRef} />
                {/* TODO: Button to create a Claim*/}
                <Button
                    loading={isLoading}
                    type={ButtonType.blue}
                    onClick={() =>
                        createClaimFromEditor(t, {
                            personality,
                            content: node?.textContent,
                        })
                    }
                    disabled={isLoading}
                    data-cy={"testSaveButton"}
                >
                    {t("claimForm:saveButton")}
                </Button>
            </div>
        )
    );
};

export const getEditorClaimCardContentHtml = ({ personalityId, claimId }) => `
    <div
        data-personality-id="${personalityId}"
        data-claim-id="${claimId}"
    >
        <p>This is editable content...</p>
    </div>`;
