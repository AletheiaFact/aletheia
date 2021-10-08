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
            filter={{
                claimId,
                sentenceHash
            }}
            renderItem={claimReview => {
                return claimReview && (
                    <ClaimReviewCard
                        key={claimReview._id}
                        userName={claimReview?.user?.name}
                        classification={claimReview.classification}
                    />
                )
            }}
        />
    );
}
export default ClaimReviewList;
