import colors from "../../styles/colors";
import { Col } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import { ContentModelEnum } from "../../types/enums";
import ReviewContent from "../ClaimReview/ReviewContent";

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
        [ContentModelEnum.Unattributed]: {
            linkText: "claim:cardLinkToFullText",
            title: claimContent,
            contentHeight: "6.4em",
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
            <ReviewContent
                title={
                    isImage ? (
                        title
                    ) : (
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
                    )
                }
                content={claimContent.content}
                isImage={isImage}
                contentPath={href}
                linkText={t(linkText)}
                ellipsis={true}
            />
        </Col>
    );
};

export default ClaimSummaryContent;
