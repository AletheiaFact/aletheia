import colors from "../../styles/colors";
import { Col, Typography } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import ImageClaim from "../ImageClaim";
import { ContentModelEnum } from "../../types/enums";
const { Paragraph } = Typography;

interface ClaimSummaryContentProps {
    claimContent: any;
    claimTitle: string;
    href: string;
    isImage?: boolean;
    isDebate?: boolean;
    contentModel: ContentModelEnum;
}

const ClaimSummaryContent = ({
    href,
    claimContent,
    claimTitle,
    contentModel,
}: ClaimSummaryContentProps) => {
    const { t } = useTranslation();
    const isImage = contentModel === ContentModelEnum.Image;
    const contentProps = {
        [ContentModelEnum.Speech]: {
            linkText: "claim:cardLinkToFullText",
            title: claimContent,
            contentHeight: "6.4em",
        },
        [ContentModelEnum.Image]: {
            linkText: "claim:cardLinkToImage",
            title: claimTitle,
            contentHeight: "1.6em",
        },
        [ContentModelEnum.Debate]: {
            linkText: "claim:cardLinkToDebate",
            title: claimTitle,
            contentHeight: "5.3em",
        },
    };

    const { linkText, title, contentHeight } = contentProps[contentModel];

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
                            height: contentHeight,
                            ...elipsizedTitleProps,
                        }}
                    >
                        {title}
                    </p>
                    {isImage && (
                        <ImageClaim src={claimContent.content} title={title} />
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
