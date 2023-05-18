/* eslint-disable @next/next/no-img-element */
import "moment/locale/pt";

import { Affix, Col, Row, Typography } from "antd";
import moment from "moment";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import actions from "../../store/actions";
import colors from "../../styles/colors";
import { ContentModelEnum } from "../../types/enums";
import Loading from "../Loading";
import LocalizedDate from "../LocalizedDate";
import MetricsOverview from "../Metrics/MetricsOverview";
import PersonalityCard from "../Personality/PersonalityCard";
import SocialMediaShare from "../SocialMediaShare";
import SourcesList from "../SourcesList";
import ToggleSection from "../ToggleSection";
import ClaimSpeechBody from "./ClaimSpeechBody";
import ReviewedImage from "../ReviewedImage";
import { useAppSelector } from "../../store/store";
import ImageApi from "../../api/image";

const { Title, Paragraph } = Typography;

const ClaimView = ({ personality, claim, href }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    moment.locale(i18n.language);
    const { title, stats, content: claimContent } = claim;
    const isImage = claim?.contentModel === ContentModelEnum.Image;
    let date = moment(new Date(claim.date));
    const sources = claim?.sources?.map((source) => source.link);
    const { selectedContent } = useAppSelector((state) => state);

    const imageUrl = claimContent.content;
    const paragraphs = Array.isArray(claimContent)
        ? claimContent
        : [claimContent];

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
    }, [isImage, t]);

    const handleClickOnImage = () => {
        ImageApi.getImageTopicsByDatahash(selectedContent?.data_hash)
            .then((image) => {
                dispatch(actions.setSelectContent(image));
            })
            .catch((e) => e);
        dispatch(actions.openReviewDrawer());
    };

    if (claimContent) {
        return (
            <>
                <Row justify="center">
                    <Col xs={20} sm={18} md={16}>
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
                                {date && (
                                    <Row style={{ marginTop: "20px" }}>
                                        <Col>
                                            {!isImage ? (
                                                <Paragraph
                                                    style={{
                                                        fontSize: 10,
                                                        fontWeight: 400,
                                                        lineHeight: "15px",
                                                        marginBottom: 0,
                                                        color: colors.blackSecondary,
                                                    }}
                                                >
                                                    {t("claim:cardHeader1")}
                                                    &nbsp;
                                                    <LocalizedDate
                                                        date={
                                                            claim.date ||
                                                            new Date()
                                                        }
                                                    />
                                                    &nbsp;
                                                    {t("claim:cardHeader2")}
                                                    &nbsp;
                                                    <span
                                                        style={{
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {t("claim:typeSpeech")}
                                                    </span>
                                                </Paragraph>
                                            ) : (
                                                <Paragraph
                                                    style={{
                                                        fontSize: 10,
                                                        fontWeight: 400,
                                                        lineHeight: "15px",
                                                        marginBottom: 0,
                                                        color: colors.blackSecondary,
                                                    }}
                                                >
                                                    {t("claim:cardHeader3")}
                                                    &nbsp;
                                                    <LocalizedDate
                                                        date={
                                                            claim.date ||
                                                            new Date()
                                                        }
                                                    />
                                                </Paragraph>
                                            )}
                                        </Col>
                                    </Row>
                                )}
                                <Row
                                    style={{
                                        paddingBottom: "15px",
                                    }}
                                    justify="center"
                                >
                                    <Col
                                        style={{
                                            margin: "20px 0",
                                            width: "100%",
                                        }}
                                        xs={20}
                                        sm={18}
                                        md={16}
                                    >
                                        <Title
                                            level={1}
                                            style={{
                                                fontSize: 20,
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {title}
                                        </Title>
                                    </Col>
                                    <Col
                                        xs={20}
                                        sm={18}
                                        md={16}
                                        style={{ paddingBottom: "20px" }}
                                    >
                                        {isImage ? (
                                            <div
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                                onClick={handleClickOnImage}
                                            >
                                                <ReviewedImage
                                                    imageUrl={imageUrl}
                                                    title={title}
                                                    classification={
                                                        claimContent?.props
                                                            ?.classification
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <cite
                                                style={{
                                                    fontStyle: "normal",
                                                }}
                                            >
                                                <ClaimSpeechBody
                                                    handleSentenceClick={
                                                        dispatchPersonalityAndClaim
                                                    }
                                                    paragraphs={paragraphs}
                                                    showHighlights={
                                                        showHighlights
                                                    }
                                                />
                                            </cite>
                                        )}
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
                                    </Affix>
                                </Row>
                                {sources.length > 0 && (
                                    <SourcesList
                                        sources={sources}
                                        seeMoreHref={`${href}/sources`}
                                    />
                                )}
                            </section>
                            {stats.total !== 0 && (
                                <MetricsOverview stats={stats} />
                            )}
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
    } else {
        return <Loading />;
    }
};

export default ClaimView;
