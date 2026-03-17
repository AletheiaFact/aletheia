import React from "react";
import { Grid } from "@mui/material";
import { i18n, useTranslation } from "next-i18next";
import { VerificationRequest } from "../../../types/VerificationRequest";

import CardBase from "../../CardBase";
import VerificationCardStyled from "./VerificationRequestMinimumCard.style";
import ReviewContent from "../../ClaimReview/ReviewContent";
import VerificationRequestMinimumCardHeader from "./VerificationRequestMinimumCardHeader";
import VerificationRequestMinimumCardActions from "./VerificationRequestMinimumCardActions";
import { usePersonalities } from "../../../hooks/usePersonalities";

interface VerificationRequestMinimumCardProps {
    verificationRequest: VerificationRequest;
}

const VerificationRequestMinimumCard = ({
    verificationRequest,
}: VerificationRequestMinimumCardProps) => {
    const { t } = useTranslation();
    const { _id, topics, identifiedData, sourceChannel, date, status, content, data_hash } = verificationRequest

    const { personalities } = usePersonalities({
        requestId: _id,
        isOpen: true,
        hasIdentifiedData:
            identifiedData &&
            identifiedData.length > 0,
        language: i18n.language || "en",
    });

    return (
        <CardBase>
            <VerificationCardStyled>
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
                        linkText={t("verificationRequest:cardLinkToFullRequest")}
                    />
                </Grid>

                <VerificationRequestMinimumCardActions
                    verificationRequestId={_id}
                    dataHash={data_hash}
                    topics={topics}
                    personalities={personalities}
                    t={t}
                />
            </VerificationCardStyled>
        </CardBase>
    );
};

export default VerificationRequestMinimumCard;
