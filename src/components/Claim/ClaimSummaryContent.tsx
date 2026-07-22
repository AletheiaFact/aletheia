import colors from "../../styles/colors";
import { Grid } from "@mui/material";
import React from "react";
import { ContentModelEnum } from "../../types/enums";
import ReviewContent from "../ClaimReview/ReviewContent";
import { useTranslations } from "next-intl";

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
    const tClaim = useTranslations("claim");
    const isImage = contentModel === ContentModelEnum.Image;
    const contentProps = {
        [ContentModelEnum.Speech]: {
            linkText: "cardLinkToFullText",
            title: claimContent,
            contentHeight: "6.4em",
        },
        [ContentModelEnum.Image]: {
            linkText: "cardLinkToImage",
            title: claimTitle,
            contentHeight: "1.6em",
        },
        [ContentModelEnum.Debate]: {
            linkText: "cardLinkToDebate",
            title: claimTitle,
            contentHeight: "5.3em",
        },
        [ContentModelEnum.Unattributed]: {
            linkText: "cardLinkToFullText",
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
        <Grid>
            <ReviewContent
                title={
                    isImage ? (
                        title
                    ) : (
                        <p
                            style={{
                                fontSize: 16,
                                color: colors.black,
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
                linkText={tClaim(linkText)}
                ellipsis={true}
            />
        </Grid>
    );
};

export default ClaimSummaryContent;
