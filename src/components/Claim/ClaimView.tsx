import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { ContentModelEnum, Roles, TargetModel } from "../../types/enums";
import MetricsOverview from "../Metrics/MetricsOverview";
import PersonalityCard from "../Personality/PersonalityCard";
import ClaimSourceList from "../Source/ClaimSourceList";
import ToggleSection from "../ToggleSection";
import actions from "../../store/actions";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import ClaimInfo from "./ClaimInfo";
import ClaimContentDisplay from "./ClaimContentDisplay";
import SocialMediaShare from "../SocialMediaShare";
import AdminToolBar from "../Toolbar/AdminToolBar";
import claimApi from "../../api/claim";
import { currentUserRole } from "../../atoms/currentUser";
import { useAtom } from "jotai";
import AffixButtonV2 from "../Collaborative/Components/AffixButtonV2";

const ClaimView = ({ personality, claim, href, hideDescriptions }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [role] = useAtom(currentUserRole);
    const { title, stats, content: claimContent } = claim;

    const isImage = claim?.contentModel === ContentModelEnum.Image;
    const sources = claim?.sources?.map((source) => source.href);

    const dispatchPersonalityAndClaim = () => {
        dispatch(actions.setSelectTarget(claim));
        dispatch(actions.setSelectPersonality(personality));
    };

    const [showHighlights, setShowHighlights] = useState(true);

    useEffect(() => {
        dispatch(actions.setSelectTarget(claim));
        dispatch(actions.setSelectPersonality(personality));
        if (isImage) {
            dispatch(actions.setSelectContent(claimContent));
        }
    }, [claim, claimContent, dispatch, isImage, personality, t]);

    return (
        <>
            {(role === Roles.Admin || role === Roles.SuperAdmin) && (
                <AdminToolBar
                    content={claim}
                    deleteApiFunction={claimApi.deleteClaim}
                    changeHideStatusFunction={claimApi.updateClaimHiddenStatus}
                    target={TargetModel.Claim}
                    hideDescriptions={hideDescriptions}
                />
            )}

            <Grid container justifyContent="center">
                <Grid item xs={11} sm={11} md={9}>
                    <article>
                        {personality && (
                            <PersonalityCard
                                personality={personality}
                                header={true}
                                mobile={true}
                                titleLevel="h2"
                            />
                        )}
                        <section>
                            <ClaimInfo isImage={isImage} date={claim?.date} />
                            <Grid
                                container
                                style={{ paddingBottom: "15px" }}
                                justifyContent="center"
                            >
                                <Grid item xs={12} md={11} lg={10}>
                                    <Typography
                                        variant="h1"
                                        style={{
                                            fontFamily: "initial",
                                            fontWeight: 700,
                                            margin: "20px 0",
                                            fontSize: 20,
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {title}
                                    </Typography>
                                    <ClaimContentDisplay
                                        isImage={isImage}
                                        title={title}
                                        claimContent={claimContent}
                                        showHighlights={showHighlights}
                                        dispatchPersonalityAndClaim={
                                            dispatchPersonalityAndClaim
                                        }
                                    />
                                </Grid>
                                {!isImage && (
                                    <AffixButtonV2
                                        Children={
                                            <ToggleSection
                                                defaultValue={showHighlights}
                                                onChange={(e) => {
                                                    setShowHighlights(
                                                        e.target.value
                                                    );
                                                }}
                                                labelTrue={t(
                                                    "claim:showHighlightsButton"
                                                )}
                                                labelFalse={t(
                                                    "claim:hideHighlightsButton"
                                                )}
                                            />
                                        }
                                    />
                                )}
                            </Grid>
                            {sources.length > 0 && (
                                <>
                                    <Typography
                                        variant="h4"
                                        style={{
                                            fontSize: 24,
                                            fontFamily: "initial",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {t("claim:sourceSectionTitle")}
                                    </Typography>
                                    <ClaimSourceList
                                        sources={sources}
                                        seeMoreHref={`${href}/sources`}
                                    />
                                </>
                            )}
                        </section>
                        {stats.total !== 0 && <MetricsOverview stats={stats} />}
                    </article>
                </Grid>
            </Grid>
            <SocialMediaShare
                quote={personality?.name}
                href={href}
                claim={claim?.title}
            />
        </>
    );
};

export default ClaimView;
