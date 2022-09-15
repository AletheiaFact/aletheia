import { useSelector } from "@xstate/react";
import React, { useContext } from "react";

import { Roles } from "../../machine/enums";
import { publishedSelector, reviewDataSelector } from "../../machine/selectors";
import { ClaimReviewPageProps } from "../../pages/claim-review";
import { useAppSelector } from "../../store/store";
import SentenceReportView from "../SentenceReport/SentenceReportView";
import ClaimReviewForm from "./ClaimReviewForm";
import ClaimReviewHeader from "./ClaimReviewHeader";
import { GlobalStateMachineContext } from "./Context/GlobalStateMachineProvider";

const ClaimReviewView = (props: ClaimReviewPageProps) => {
    const { claimReview, description } = props;
    const { machineService } = useContext(GlobalStateMachineContext);

    const reviewData = useSelector(machineService, reviewDataSelector);
    const isPublished = useSelector(machineService, publishedSelector);

    const { role } = useAppSelector((state) => state);

    const isHiddenAndUserDontHavePermission =
        claimReview?.isHidden && (role === Roles.Regular || role === null);

    return (
        <div>
            <ClaimReviewHeader
                classification={
                    claimReview?.report?.classification ||
                    reviewData?.classification
                }
                isHidden={claimReview?.isHidden}
                hideDescription={description}
                isPublished={isPublished}
                {...props}
            />
            {!isPublished || isHiddenAndUserDontHavePermission ? (
                <ClaimReviewForm {...props} />
            ) : (
                <SentenceReportView
                    context={claimReview?.report || reviewData}
                    personality={props.personality}
                    claim={props.claim}
                    href={props.href}
                />
            )}
        </div>
    );
};

export default ClaimReviewView;
