import { Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import ReviewColors from "../../constants/reviewColors";
import CardBase from "../CardBase";
import ClaimSummary from "./ClaimSummary";
import Button, { ButtonType } from "../Button";
import ClaimCardHeader from "./ClaimCardHeader";
import colors from "../../styles/colors";
import ClaimSummaryContent from "./ClaimSummaryContent";
import ClaimSpeechBody from "./ClaimSpeechBody";
import actions from "../../store/actions";
import { useDispatch } from "react-redux";
import { ContentModelEnum } from "../../types/enums";
import { useAppSelector } from "../../store/store";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";

const ClaimCard = ({
    personality,
    claim,
    collapsed = true,
    content = null,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { selectedTarget } = useAppSelector((state) => state);
    const review = claim?.stats?.reviews[0];
    const paragraphs = content || claim.content;
    const [claimContent, setClaimContent] = useState("");
    const [nameSpace] = useAtom(currentNameSpace);
    const isSpeech = claim?.contentModel === ContentModelEnum.Speech;
    const isDebate = claim?.contentModel === ContentModelEnum.Debate;
    const isUnattributed =
        claim?.contentModel === ContentModelEnum.Unattributed;
    const isInsideDebate =
        selectedTarget?.contentModel === ContentModelEnum.Debate;
    const shouldCreateFirstParagraph = isSpeech || isUnattributed;

    const dispatchPersonalityAndClaim = () => {
        if (!isInsideDebate) {
            // when selecting a claim from the debate page to review or to read,
            // we don't want to change the selected claim
            // se we can keep reference to the debate
            dispatch(actions.setSelectTarget(claim));
        }
        dispatch(actions.setSelectPersonality(personality));
    };

    useEffect(() => {
        const CreateFirstParagraph = () => {
            let textContent = "";
            paragraphs.forEach((paragraph) => {
                paragraph.content.forEach((sentence) => {
                    textContent += `${sentence.content} `;
                });
            });
            setClaimContent(textContent.trim());
        };
        if (shouldCreateFirstParagraph) {
            CreateFirstParagraph();
        } else {
            setClaimContent(claim.content);
        }
    }, [claim.content, isSpeech, paragraphs]);

    let href = `/${nameSpace !== NameSpaceEnum.Main ? `${nameSpace}/` : ""}`;

    if (isDebate) {
        href += `claim/${claim.claimId}/debate`;
    } else if (personality && personality.slug) {
        href += `personality/${personality.slug}/claim/${claim.slug}`;
    } else {
        href += `claim/${claim.slug}`;
    }

    return (
        <CardBase style={{ padding: "16px 12px" }}>
            <Grid container style={{ width: "100%" }}>
                <ClaimCardHeader
                    personality={personality}
                    date={claim?.date}
                    claimType={claim?.contentModel}
                />
                <ClaimSummary
                    style={{
                        padding: "12px 16px",
                        width: "100%",
                    }}
                >
                    {collapsed ? (
                        <ClaimSummaryContent
                            claimTitle={claim?.title}
                            claimContent={claimContent}
                            contentModel={claim?.contentModel}
                            href={href}
                        />
                    ) : (
                        <ClaimSpeechBody
                            handleSentenceClick={
                                dispatchPersonalityAndClaim
                            }
                            paragraphs={paragraphs}
                            showHighlights={true}
                        />
                    )}
                </ClaimSummary>
            </Grid>
            <Grid container
                style={{
                    justifyContent:"space-between",
                    padding: "4px 15px 0 0",
                    width: "100%",
                }}
            >
                <Grid item
                    xs={8}
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                    }}
                >
                    {claim?.stats && (
                        <p
                            style={{
                                width: "100%",
                                fontSize: "14px",
                                lineHeight: "18px",
                                color: colors.blackSecondary,
                                margin: 0,
                            }}
                        >
                            {t("claim:metricsHeaderInfo", {
                                totalReviews: claim?.stats?.total,
                            })}
                        </p>
                    )}{" "}
                    <Typography
                        variant="body1"
                        style={{
                            fontSize: "10px",
                            lineHeight: "18px",
                            marginTop: 5,
                            marginBottom: 0,
                            display: "flex",
                        }}
                    >
                        {review && (
                            <span style={{ margin: 0 }}>
                                {t("claim:cardOverallReviewPrefix")}
                                <span
                                    style={{
                                        color:
                                            ReviewColors[review?._id] || colors.black,
                                        fontWeight: 900,
                                        textTransform: "uppercase",
                                        margin: "0px 3px",
                                    }}
                                >
                                    {t(`claimReviewForm:${review?._id}`)}
                                </span>
                                ({review?.count})
                            </span>
                        )}
                    </Typography>
                </Grid>
                <Grid item>
                    {!isInsideDebate && (
                        <Button
                            type={ButtonType.blue}
                            href={href}
                            data-cy={personality?.name}
                        >
                            <span
                                style={{
                                    color: colors.white,
                                    fontSize: 16,
                                    fontWeight: 400,
                                    margin: 0,
                                    padding: 0,
                                    lineHeight: "24px",
                                }}
                            >
                                {t("claim:cardReviewButton")}
                            </span>
                        </Button>
                    )}
                </Grid>
            </Grid>
        </CardBase>
    );
};

export default ClaimCard;
