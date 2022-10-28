import { Col } from "antd";
import Text from "antd/lib/typography/Text";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../styles/colors";

const PartialReviewWarning = () => {
    const { t } = useTranslation();
    return (
        <Col offset={3} span={14}>
            <Text type="danger">* </Text>
            <span style={{ color: colors.grayPrimary }}>
                {t("claimReview:partialReviewWarning")}
            </span>
        </Col>
    );
};

export default PartialReviewWarning;
