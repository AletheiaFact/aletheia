import { useTranslation } from "next-i18next";
import React from "react";
import claimApi from "../../api/claim";
import BaseList from "../List/BaseList";
import ClaimReviewCard from "./ClaimReviewCard";

const ClaimReviewList = ({ claimId, sentenceHash }) => {
    const { t, i18n } = useTranslation()
    return (
        <BaseList
            style={{
                width: "100%"
            }}
            apiCall={claimApi.getClaimSentenceReviews}
            filter={{
                claimId,
                sentenceHash,
                i18n
            }}
            title={t("claimReview:listTitle")}
            renderItem={claimReview => {
                return claimReview && (
                    <ClaimReviewCard
                        key={claimReview._id}
                        userName={claimReview?.user?.name}
                        classification={claimReview.classification}
                        sources={claimReview.sources}
                        report={claimReview.report}
                    />
                )
            }}
        />
    );
}
export default ClaimReviewList;
