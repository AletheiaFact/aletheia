import { Affix, Col, Row, Typography } from "antd";
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

const { Title } = Typography;

const ClaimView = ({ personality, claim, href, hideDescriptions }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [role] = useAtom(currentUserRole);
    const { title, stats, content: claimContent } = claim;

    const isImage = claim?.contentModel === ContentModelEnum.Image;
    const sources = claim?.sources?.map((source) => source.href);

    const dispatchPersonalityAndClaim = () => {
        dispatch(actions.setSelectClaim(claim));
        dispatch(actions.setSelectPersonality(personality));
    };

    const [showHighlights, setShowHighlights] = useState(true);

    useEffect(() => {
        dispatch(actions.setSelectClaim(claim));
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

            <Row justify="center">
                <Col xs={22} sm={22} md={18}>
                    <article>
                        {personality && (
                            <PersonalityCard
                                personality={personality}
                                header={true}
                                mobile={true}
                                titleLevel={2}
                            />
                        )}
                        <section>
                            <ClaimInfo isImage={isImage} date={claim?.date} />
                            <Row
                                style={{ paddingBottom: "15px" }}
                                justify="center"
                            >
                                <Col xs={24} md={22} lg={20}>
                                    <Title
                                        level={1}
                                        style={{
                                            margin: "20px 0",
                                            fontSize: 20,
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {title}
                                    </Title>
                                    <ClaimContentDisplay
                                        isImage={isImage}
                                        title={title}
                                        claimContent={claimContent}
                                        showHighlights={showHighlights}
                                        dispatchPersonalityAndClaim={
                                            dispatchPersonalityAndClaim
                                        }
                                    />
                                </Col>

                                <Affix
                                    offsetBottom={15}
                                    style={{
                                        textAlign: "center",
                                        width: "100%",
                                    }}
                                >
                                    <ToggleSection
                                        defaultValue={showHighlights}
                                        onChange={(e) => {
                                            setShowHighlights(e.target.value);
                                        }}
                                        labelTrue={t(
                                            "claim:showHighlightsButton"
                                        )}
                                        labelFalse={t(
                                            "claim:hideHighlightsButton"
                                        )}
                                    />
                                </Affix>
                            </Row>
                            {sources.length > 0 && (
                                <>
                                    <Typography.Title level={4}>
                                        {t("claim:sourceSectionTitle")}
                                    </Typography.Title>
                                    <ClaimSourceList
                                        sources={sources}
                                        seeMoreHref={`${href}/sources`}
                                    />
                                </>
                            )}
                        </section>
                        {stats.total !== 0 && <MetricsOverview stats={stats} />}
                    </article>
                </Col>
            </Row>
            <SocialMediaShare
                quote={personality?.name}
                href={href}
                claim={claim?.title}
            />
        </>
    );
};

export default ClaimView;
