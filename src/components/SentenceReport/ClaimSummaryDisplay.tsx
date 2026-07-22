import React from "react";
import { ContentModelEnum } from "../../types/enums";
import SentenceReportSummary from "./SentenceReportSummary";
import { generateSentenceContentPath } from "../../utils/GetSentenceContentHref";
import ClaimInfo from "../Claim/ClaimInfo";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import ReviewContent from "../ClaimReview/ReviewContent";
import { useTranslations } from "next-intl";

const ClaimSummaryDisplay = ({
    claim,
    personality,
    content,
}: {
    personality?: any;
    claim: any;
    content: any;
}) => {
    const tClaim = useTranslations("claim");
    const isImage = claim?.contentModel === ContentModelEnum.Image;
    const [nameSpace] = useAtom(currentNameSpace);

    const contentProps = {
        [ContentModelEnum.Speech]: {
            linkText: "cardLinkToFullText",
            contentPath: generateSentenceContentPath(
                nameSpace,
                personality,
                claim,
                claim?.contentModel
            ),
            title: `"(...) ${content}"`,
            speechTypeTranslation: "typeSpeech",
        },
        [ContentModelEnum.Image]: {
            linkText: "cardLinkToImage",
            contentPath: generateSentenceContentPath(
                nameSpace,
                personality,
                claim,
                claim?.contentModel
            ),
            title: claim?.title,
            speechTypeTranslation: "",
        },
        [ContentModelEnum.Debate]: {
            linkText: "cardLinkToDebate",
            contentPath: generateSentenceContentPath(
                nameSpace,
                personality,
                claim,
                claim?.contentModel
            ),
            title: `"(...) ${content}"`,
            speechTypeTranslation: "typeDebate",
        },
        [ContentModelEnum.Unattributed]: {
            linkText: "cardLinkToFullText",
            contentPath: generateSentenceContentPath(
                nameSpace,
                personality,
                claim,
                claim?.contentModel
            ),
            title: `"(...) ${content}"`,
            speechTypeTranslation: "typeSpeech",
        },
    };

    const { linkText, contentPath, title, speechTypeTranslation } =
        contentProps[claim?.contentModel];

    return (
        <>
            <SentenceReportSummary
                container
                className={personality ? "after" : ""}
            >
                <ReviewContent
                    title={isImage ? claim?.title : title}
                    content={content}
                    contentPath={contentPath}
                    isImage={isImage}
                    linkText={tClaim(linkText)}
                />
            </SentenceReportSummary>
            <ClaimInfo
                date={claim.date}
                isImage={isImage}
                speechTypeTranslation={speechTypeTranslation}
            />
        </>
    );
};

export default ClaimSummaryDisplay;
