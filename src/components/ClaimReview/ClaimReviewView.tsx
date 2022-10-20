import { useSelector } from "@xstate/react";
import React, { useContext } from "react";

import { Roles } from "../../machine/enums";
import { publishedSelector, reviewDataSelector } from "../../machine/selectors";
import { useAppSelector } from "../../store/store";
import SentenceReportView from "../SentenceReport/SentenceReportView";
import ClaimReviewForm from "./ClaimReviewForm";
import ClaimReviewHeader from "./ClaimReviewHeader";
import { GlobalStateMachineContext } from "../../Context/GlobalStateMachineProvider";
import SocialMediaShare from "../SocialMediaShare";

export interface ClaimReviewViewProps {
    claimReview?: any;
    personality: any;
    claim: any;
    sentence: { data_hash: string; content: string; topics: string[] };
    sitekey: string;
    description: string;
    userId?: string;
}

const ClaimReviewView = (props: ClaimReviewViewProps) => {
    const { claimReview, description } = props;
    const { machineService } = useContext(GlobalStateMachineContext);

    const reviewData = useSelector(machineService, reviewDataSelector);
    const isPublished = useSelector(machineService, publishedSelector);

    const { role } = useAppSelector((state) => state);

    const userIsNotRegular = !(role === Roles.Regular || role === null);
    const userIsReviewer = reviewData.reviewerId === props.userId;
    const userIsAssignee = reviewData.usersId.includes(props.userId);

    /* {

    "sentence": {
        "topics": [],
        "type": "sentence",
        "_id": "62ed3639a91d3171f353cf3d",
        "data_hash": "e93c69179454cbb829be40e10ce34b47",
        "props": {
            "id": 8
        },
        "content": "Quisque dapibus justo odio, vitae pretium nibh tempor non.",
        "__v": 0
    },
    "sitekey": "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
    "description": "",
    "href": "http://localhost:3000/personality/ava-duvernay/claim/pellentesque-venenatis/sentence/e93c69179454cbb829be40e10ce34b47",
    "isLoggedIn": true,
    "userRole": "admin",
    "userId": "6331e4103d50c499135aa3be"
} */

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
                userIsReviewer={userIsReviewer}
                userIsAssignee={userIsAssignee}
                {...props}
            />
            <SentenceReportView
                context={claimReview?.report || reviewData}
                personality={props.personality}
                claim={props.claim}
                userIsNotRegular={userIsNotRegular}
                userIsReviewer={userIsReviewer}
                isHidden={claimReview?.isHidden}
            />
            <ClaimReviewForm
                claimId={props.claim._id}
                personalityId={props.personality._id}
                sentenceHash={props.sentence.data_hash}
                sitekey={props.sitekey}
                userIsReviewer={userIsReviewer}
                userId={props.userId}
            />
        </div>
    );
};

export default ClaimReviewView;
