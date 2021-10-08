import React from "react";
import claimApi from "../../api/claim";
import BaseList from "../List/BaseList";
import ClaimReviewCard from "./ClaimReviewCard";

const ClaimReviewList = ({ claimId, sentenceHash }) => {
    return (
        <BaseList
            style={{
                width: "100%"
            }}
            apiCall={claimApi.getClaimSentenceReviews}
            query={{
                claimId,
                sentenceHash
            }}
            renderItem={claimReview =>
                claimReview && (
                    <ClaimReviewCard
                        key={claimReview._id}
                        userId={claimReview.user}
                        classification={claimReview.classification}
                    />
                )
            }
        />
    );
}
export default ClaimReviewList;
