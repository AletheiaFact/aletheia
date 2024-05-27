import { Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";
import { ContentModelEnum } from "../../types/enums";
import LocalizedDate from "../LocalizedDate";

const { Paragraph } = Typography;

const ClaimCardHeader = ({
    personality,
    date,
    claimType = ContentModelEnum.Speech,
}) => {
    const { t } = useTranslation();
    const isImage = claimType === ContentModelEnum.Image;
    const speechTypeMapping = {
        [ContentModelEnum.Speech]: t("claim:typeSpeech"),
        [ContentModelEnum.Image]: t("claim:typeImage"),
        [ContentModelEnum.Debate]: t("claim:typeDebate"),
        [ContentModelEnum.Unattributed]: t("claim:typeUnattributed"),
    };

    const speechTypeTranslation = speechTypeMapping[claimType];
    return (
        <Col
            span={24}
            style={{
                color: colors.blackSecondary,
                width: "100%",
            }}
        >
            {personality && (
                <>
                    <Paragraph
                        style={{
                            fontSize: "14px",
                            lineHeight: "20px",
                            fontWeight: 600,
                            marginBottom: 0,
                            color: colors.blackPrimary,
                        }}
                    >
                        {personality.name}
                    </Paragraph>

                    <Row>
                        <Paragraph
                            style={{
                                fontSize: 10,
                                fontWeight: 400,
                                lineHeight: "18px",
                                marginBottom: 0,
                            }}
                        >
                            {personality.description}
                        </Paragraph>
                    </Row>
                </>
            )}
            <Row>
                {!isImage ? (
                    <Paragraph
                        style={{
                            fontSize: 10,
                            fontWeight: 400,
                            lineHeight: "15px",
                            marginBottom: 0,
                            color: colors.blackSecondary,
                        }}
                    >
                        {t("claim:cardHeader1")}&nbsp;
                        <LocalizedDate date={date || new Date()} />
                        &nbsp;
                        {t("claim:cardHeader2")}&nbsp;
                        <span style={{ fontWeight: 700 }}>
                            {speechTypeTranslation}
                        </span>
                    </Paragraph>
                ) : (
                    <Paragraph
                        style={{
                            fontSize: 10,
                            fontWeight: 400,
                            lineHeight: "15px",
                            marginBottom: 0,
                            color: colors.blackSecondary,
                        }}
                    >
                        {t("claim:cardHeader3")}
                        &nbsp;
                        <LocalizedDate date={date || new Date()} />
                    </Paragraph>
                )}
            </Row>
        </Col>
    );
};

export default ClaimCardHeader;
