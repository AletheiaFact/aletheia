import React from "react";

import { ReviewTaskStates, Roles } from "../../machine/enums";
import { ClaimReviewPageProps } from "../../pages/claim-review";
import { useAppSelector } from "../../store/store";
import SentenceReportView from "../SentenceReport/SentenceReportView";
import ClaimReviewForm from "./ClaimReviewForm";
import ClaimReviewHeader from "./ClaimReviewHeader";

const ClaimReviewView = (props: ClaimReviewPageProps) => {
    const { claimReview, description } = props;

    const isnotPublished =
        props.claimReviewTask?.machine.value !== ReviewTaskStates.published;

    const { role } = useAppSelector((state) => state);

    const isHiddenAndUserDontHavePermission =
        claimReview?.isHidden && (role === Roles.Regular || role === null);

    return (
        <div>
            <ClaimReviewHeader
                classification={claimReview?.report.classification || ""}
                isHidden={claimReview?.isHidden}
                hideDescription={description}
                {...props}
            />
            {isnotPublished || isHiddenAndUserDontHavePermission ? (
                <ClaimReviewForm {...props} />
            ) : (
                <SentenceReportView context={claimReview.report} {...props} />
            )}
        </div>
    );
};

export default ClaimReviewView;
