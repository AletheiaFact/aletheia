import React from "react";
import PersonalityMinimalCard from "../Personality/PersonalityMinimalCard";
import CardBase from "../CardBase";
import { Col } from "antd";
import { useTranslation } from "next-i18next";
import reviewColors from "../../constants/reviewColors";
import TagsList from "../topics/TagsList";
import AletheiaButton, { ButtonType } from "../Button";
import { ContentModelEnum } from "../../types/enums";
import { generateSentenceContentPath } from "../../utils/GetSentenceContentHref";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import ReviewCardStyled from "./ReviewCard.style";
import ClaimInfo from "../Claim/ClaimInfo";
import ReviewClassification from "./ReviewClassification";
import ReviewContent from "./ReviewContent";

const ReviewCard = ({ review, summarized = false }) => {
    const { personality, claim, content, reviewHref } = review;
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

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
            linkText: "claim:cardLinkToFullText",
            title: `"(...) ${content.content}"`,
        },
        [ContentModelEnum.Image]: {
            linkText: "claim:cardLinkToImage",
            title: claimItem?.title,
        },
        [ContentModelEnum.Debate]: {
            linkText: "claim:cardLinkToDebate",
            title: `"(...) ${content.content}"`,
        },
        [ContentModelEnum.Unattributed]: {
            linkText: "claim:cardLinkToFullText",
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
        <CardBase>
            <ReviewCardStyled>
                {!summarized && personalityItem && (
                    <Col className="personality-card">
                        <PersonalityMinimalCard
                            personality={personalityItem}
                            avatarSize={88}
                        />
                    </Col>
                )}
                <Col className="review-content">
                    <Col className="review-info">
                        <ClaimInfo
                            isImage={isImage}
                            date={claimItem.date}
                            speechTypeTranslation={t(
                                `claim:type${claimItem.contentModel}`
                            )}
                            style={{
                                fontSize: 12,
                                lineHeight: "16px",
                                margin: 0,
                            }}
                        />
                        {content?.props?.classification && (
                            <ReviewClassification
                                label={t("claimReview:titleClaimReview")}
                                classification={content.props.classification}
                                classificationTextStyle={{ fontSize: 16 }}
                            />
                        )}
                    </Col>
                    <Col className="sentence-content">
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
                            linkText={t(linkText)}
                            style={{ fontSize: 18 }}
                        />
                    </Col>

                    <Col className="review-actions">
                        <TagsList key={0} tags={content.topics || []} />
                        <AletheiaButton
                            buttonType={ButtonType.blue}
                            href={href}
                            target="_blank"
                            style={{ width: "fit-content" }}
                        >
                            {t("home:reviewsCarouselOpen")}
                        </AletheiaButton>
                    </Col>
                </Col>
            </ReviewCardStyled>
        </CardBase>
    );
};

export default ReviewCard;
