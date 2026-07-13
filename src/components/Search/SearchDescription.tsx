import React from "react";
import { Typography } from "@mui/material";
import LocalizedDate from "../LocalizedDate";
import ReviewClassification from "../ClaimReview/ReviewClassification";
import { useTranslations } from "next-intl";

const SearchDescription = ({ personalityName, claimDate, sentence = null }) => {
    const tClaim = useTranslations("claim");
    const tClaimReview = useTranslations("claimReview");

    return (
        <Typography variant="body1">
            <span>{personalityName}</span>
            &nbsp;
            <span style={{ textTransform: "lowercase" }}>
                {tClaim("cardHeader1")}
            </span>
            &nbsp;
            <LocalizedDate date={claimDate} />
            {sentence?.props?.classification && (
                <>
                    {", "}
                    <ReviewClassification
                        label={tClaimReview("titleClaimReview")}
                        classification={sentence?.props?.classification}
                    />
                </>
            )}
        </Typography>
    );
};

export default SearchDescription;
