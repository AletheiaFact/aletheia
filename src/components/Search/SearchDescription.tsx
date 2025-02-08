import React from "react";
import { useTranslation } from "next-i18next";
import { Typography } from "@mui/material";
import LocalizedDate from "../LocalizedDate";
import ReviewClassification from "../ClaimReview/ReviewClassification";

const SearchDescription = ({ personalityName, claimDate, sentence = null }) => {
    const { t } = useTranslation();

    return (
        <Typography variant="body1">
            <span>{personalityName}</span>
            &nbsp;
            <span style={{ textTransform: "lowercase" }}>
                {t("claim:cardHeader1")}
            </span>
            &nbsp;
            <LocalizedDate date={claimDate} />
            {sentence?.props?.classification && (
                <>
                    {", "}
                    <ReviewClassification
                        label={t("claimReview:titleClaimReview")}
                        classification={sentence?.props?.classification}
                    />
                </>
            )}
        </Typography>
    );
};

export default SearchDescription;
