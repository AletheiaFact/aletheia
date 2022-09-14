import { useSelector } from "@xstate/react";
import React, { useContext } from "react";

import { ReviewTaskStates, Roles } from "../../machine/enums";
import { ClaimReviewPageProps } from "../../pages/claim-review";
import { useAppSelector } from "../../store/store";
import SentenceReportView from "../SentenceReport/SentenceReportView";
import ClaimReviewForm from "./ClaimReviewForm";
import { GlobalStateMachineContext } from "./Context/GlobalStateMachineProvider";

const isPublishedSelector = (state) => {
    return state.matches(ReviewTaskStates.published);
};

const ClaimReviewView = (props: ClaimReviewPageProps) => {
    const { claimReview, description } = props;
    const globalServices = useContext(GlobalStateMachineContext);
    const isPublished = useSelector(
        globalServices.machineService,
        isPublishedSelector
    );

    const { role } = useAppSelector((state) => state);

    const isHiddenAndUserDontHavePermission =
        claimReview?.isHidden && (role === Roles.Regular || role === null);

    return (
        <div>
            {!isPublished || isHiddenAndUserDontHavePermission ? (
                <ClaimReviewForm {...props} />
            ) : (
                <SentenceReportView
                    isHidden={claimReview?.isHidden}
                    context={claimReview.report}
                    hideDescription={description}
                    {...props}
                />
            )}
        </div>
    );
};

export default ClaimReviewView;
