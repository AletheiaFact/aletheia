import colors from "../../styles/colors";
import { Col, Typography } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
const { Paragraph } = Typography;

const ClaimSummaryContent = ({
    personality,
    claimContent,
    claimTitle,
    claimSlug,
}) => {
    const { t } = useTranslation();
    return (
        <Col>
            <Paragraph
                style={{ marginBottom: 0 }}
                ellipsis={{
                    rows: 4,
                    expandable: false,
                }}
            >
                <cite style={{ fontStyle: "normal" }}>
                    <p
                        style={{
                            fontSize: 16,
                            color: colors.blackPrimary,
                            fontWeight: 400,
                            margin: 0,
                            lineHeight: 1.6,
                            height: "6.4em",
                        }}
                    >
                        {claimContent || claimTitle}
                    </p>
                </cite>
            </Paragraph>
            <a
                href={`/personality/${personality.slug}/claim/${claimSlug}`}
                style={{
                    fontSize: 14,
                    color: colors.bluePrimary,
                    fontWeight: "bold",
                    textDecoration: "underline",
                }}
                data-cy={"testSeeFullSpeech"}
            >
                {t("claim:cardLinkToFullText")}
            </a>
        </Col>
    );
};

export default ClaimSummaryContent;
