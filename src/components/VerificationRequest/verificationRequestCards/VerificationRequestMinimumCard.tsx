import React from "react";
import { Grid } from "@mui/material";
import { VerificationRequest } from "../../../types/VerificationRequest";

import CardBase from "../../CardBase";
import VerificationCardStyled from "./VerificationRequestMinimumCard.style";
import ReviewContent from "../../ClaimReview/ReviewContent";
import VerificationRequestMinimumCardHeader from "./VerificationRequestMinimumCardHeader";
import VerificationRequestMinimumCardActions from "./VerificationRequestMinimumCardActions";
import { usePersonalities } from "../../../hooks/usePersonalities";
import { useLocale, useTranslations } from "next-intl";

interface VerificationRequestMinimumCardProps {
    verificationRequest: VerificationRequest;
}

const VerificationRequestMinimumCard = ({
    verificationRequest,
}: VerificationRequestMinimumCardProps) => {
    const locale = useLocale();
    const tVerificationRequest = useTranslations("verificationRequest")
    const { _id, topics, identifiedData, sourceChannel, date, status, content, data_hash } = verificationRequest

    const { personalities } = usePersonalities({
        requestId: _id,
        isOpen: true,
        hasIdentifiedData:
            identifiedData &&
            identifiedData.length > 0,
        language: locale,
    });

    return (
        <CardBase>
            <VerificationCardStyled data-cy="testVerificationRequestCardContainer">
                <VerificationRequestMinimumCardHeader
                    sourceChannel={sourceChannel}
                    createdAt={date}
                    currentstatus={status}
                />

                <Grid item className="sentence-content">
                    <ReviewContent
                        title={content}
                        content={null}
                        contentPath={`/verification-request/${data_hash}`}
                        isImage={false}
                        ellipsis={true}
                        linkText={tVerificationRequest("cardLinkToFullRequest")}
                    />
                </Grid>

                <VerificationRequestMinimumCardActions
                    verificationRequestId={_id}
                    dataHash={data_hash}
                    topics={topics}
                    personalities={personalities}
                    t={tVerificationRequest}
                />
            </VerificationCardStyled>
        </CardBase>
    );
};

export default VerificationRequestMinimumCard;
