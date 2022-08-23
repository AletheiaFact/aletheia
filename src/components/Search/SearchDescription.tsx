import React from "react";
import { useTranslation } from "next-i18next";
import reviewColors from "../../constants/reviewColors";
import { Typography } from "antd";
import LocalizedDate from "../LocalizedDate";

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
                    <span>{t("claimReview:claimReview")}</span>
                    <span
                        style={{
                            color: reviewColors[
                                sentence?.props?.classification
                            ],
                            fontWeight: "900",
                        }}
                    >
                        {sentence?.props?.classification}
                    </span>
                </>
            )}
        </Paragraph>
    );
};

export default SearchDescription;
