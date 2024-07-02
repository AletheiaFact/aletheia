import React from "react";
import { useTranslation } from "next-i18next";
import { Typography } from "antd";
import LocalizedDate from "../LocalizedDate";
import ReviewClassification from "../ClaimReview/ReviewClassification";

const { Paragraph } = Typography;

const SearchDescription = ({ personalityName, claimDate, sentence = null }) => {
    const { t } = useTranslation();

    return (
        <Paragraph>
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
        </Paragraph>
    );
};

export default SearchDescription;
