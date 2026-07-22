import React from "react";
import PersonalityMinimalCard from "../Personality/PersonalityMinimalCard";
import CardBase from "../CardBase";
import { Divider, Grid } from "@mui/material";
import reviewColors from "../../constants/reviewColors";
import TagsList from "../topics/TagsList";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import { ContentModelEnum } from "../../types/enums";
import { generateSentenceContentPath } from "../../utils/GetSentenceContentHref";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import ReviewCardStyled from "./ReviewCard.style";
import ClaimInfo from "../Claim/ClaimInfo";
import ReviewClassification from "./ReviewClassification";
import ReviewContent from "./ReviewContent";
import { useAppSelector } from "../../store/store";
import { useTranslations } from "next-intl";

const ReviewCard = ({ review, summarized = false }) => {
    const { personality, claim, content, reviewHref } = review;
    const tClaim = useTranslations("claim");
    const tClaimReview = useTranslations("claimReview");
    const tHome = useTranslations("home");
    const [nameSpace] = useAtom(currentNameSpace);
    const { vw } = useAppSelector((state) => state);
    const claimItem =
        Array.isArray(claim) && claim.length > 0 ? claim[0] : claim;
    const personalityItem =
        Array.isArray(personality) && personality.length > 0
            ? personality[0]
            : personality;
    const isImage = claimItem?.contentModel === ContentModelEnum.Image;
    const contentPath = generateSentenceContentPath(
        nameSpace,
        personalityItem,
        claimItem,
        claimItem.contentModel
    );

    const contentProps = {
        [ContentModelEnum.Speech]: {
            linkText: "cardLinkToFullText",
            title: `"(...) ${content.content}"`,
        },
        [ContentModelEnum.Image]: {
            linkText: "cardLinkToImage",
            title: claimItem?.title,
        },
        [ContentModelEnum.Debate]: {
            linkText: "cardLinkToDebate",
            title: `"(...) ${content.content}"`,
        },
        [ContentModelEnum.Unattributed]: {
            linkText: "cardLinkToFullText",
            title: `"(...) ${content.content}"`,
        },
    };

    const { linkText, title } = contentProps[claimItem.contentModel];
    const href = reviewHref
        ? reviewHref
        : generateSentenceContentPath(
            nameSpace,
            personalityItem,
            claimItem,
            claimItem?.contentModel,
            content?.data_hash
        );

    return (
        <CardBase style={{ height: "100%" }}>
            <ReviewCardStyled data-cy="testReviewCardContainer">
                {!summarized && personalityItem && (
                    <Grid className="personality-card">
                        <PersonalityMinimalCard
                            personality={personalityItem}
                            avatarSize={vw?.xs ? 64 : 48}
                            isInline={true}
                        />
                    </Grid>
                )}
                <Grid className="review-content">
                    <Grid className="review-info">
                        <ClaimInfo
                            isImage={isImage}
                            date={claimItem.date}
                            speechTypeTranslation={tClaim(
                                `type${claimItem.contentModel}`
                            )}
                            style={{
                                fontSize: vw?.xs ? 10 : 12,
                                lineHeight: "16px",
                                margin: 0,
                            }}
                        />
                        {content?.props?.classification && (
                            <ReviewClassification
                                label={tClaimReview("titleClaimReview")}
                                classification={content.props.classification}
                                classificationTextStyle={{
                                    fontSize: 12,
                                    padding: "4px 14px",
                                    border: `1px solid ${reviewColors[content.props.classification]}`,
                                    borderRadius: 12,
                                }}
                            />
                        )}
                    </Grid>
                    <Grid className="sentence-content">
                        {content?.props?.classification && (
                            <div
                                style={{
                                    borderRadius: 50,
                                    background:
                                        reviewColors[
                                        content.props.classification
                                        ],
                                    width: 10,
                                }}
                            />
                        )}
                        <ReviewContent
                            title={isImage ? claimItem?.title : title}
                            content={content?.content}
                            contentPath={contentPath}
                            isImage={isImage}
                            linkText={tClaim(linkText)}
                            style={{ fontSize: vw?.xs ? 16 : 18 }}
                        />
                    </Grid>

                    <Grid className="review-actions">
                        <Divider sx={{ width: "100%" }} />
                        <Grid className="review-actions-content">
                            <TagsList key={0} tags={content.topics || []} />
                            <AletheiaButton
                                type={ButtonType.primary}
                                href={href}
                                target="_blank"
                                style={{ width: "fit-content" }}
                            >
                                {tHome("reviewsCarouselOpen")}
                            </AletheiaButton>
                        </Grid>
                    </Grid>
                </Grid>
            </ReviewCardStyled>
        </CardBase>
    );
};

export default ReviewCard;
