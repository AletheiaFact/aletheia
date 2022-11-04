/* eslint-disable @next/next/no-img-element */
import colors from "../../styles/colors";
import { Col, Typography } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
const { Paragraph } = Typography;

interface ClaimSummaryContentProps {
    claimContent: any;
    claimTitle: string;
    href: string;
    isImage?: boolean;
}

const ClaimSummaryContent = ({
    href,
    claimContent,
    claimTitle,
    isImage = false,
}: ClaimSummaryContentProps) => {
    const { t } = useTranslation();
    const title = isImage ? claimTitle : claimContent;
    const linkText = isImage
        ? "claim:cardLinkToImage"
        : "claim:cardLinkToFullText";

    const elipsizedTitleProps: React.CSSProperties = isImage
        ? {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
          }
        : {};

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
                            height: isImage ? "1.6em" : "6.4em",
                            ...elipsizedTitleProps,
                        }}
                    >
                        {title}
                    </p>
                    {isImage && (
                        <img
                            src={claimContent}
                            alt={`${title} claim`}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "5.5em",
                            }}
                        />
                    )}
                </cite>
            </Paragraph>
            <a
                href={href}
                style={{
                    fontSize: 14,
                    color: colors.bluePrimary,
                    fontWeight: "bold",
                    textDecoration: "underline",
                }}
                data-cy={"testSeeFullSpeech"}
            >
                {t(linkText)}
            </a>
        </Col>
    );
};

export default ClaimSummaryContent;
