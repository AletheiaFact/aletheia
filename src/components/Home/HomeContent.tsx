import React from "react";
import CTARegistration from "./CTARegistration";
import { Row, Col } from "antd";
import SocialMediaShare from "../SocialMediaShare";
import { isUserLoggedIn } from "../../atoms/currentUser";
import { useAtom } from "jotai";
import PersonalitiesGrid from "../Personality/PersonalitiesGrid";
import { useAppSelector } from "../../store/store";
import { useTranslation } from "next-i18next";
import DebateGrid from "../Debate/DebateGrid";
import HomeFeed from "./HomeFeed";
import ReviewsGrid from "../ClaimReview/ReviewsGrid";

const HomeContent = ({ personalities, href, title, debateClaims, reviews }) => {
    const { results } = useAppSelector((state) => ({
        results: [
            state?.search?.searchResults?.personalities || [],
            state?.search?.searchResults?.claims || [],
            state?.search?.searchResults?.sentences || [],
        ],
    }));

    const [isLoggedIn] = useAtom(isUserLoggedIn);

    const { t } = useTranslation();

    return (
        <>
            <Row
                style={{
                    width: "100%",
                    paddingTop: "32px",
                    justifyContent: "center",
                }}
            >
                <Col xs={22} sm={22} md={18}>
                    <HomeFeed searchResults={results} />
                </Col>
                <Col xs={22} sm={22} md={18} style={{ marginBottom: 32 }}>
                    <ReviewsGrid
                        reviews={reviews}
                        title={t("home:latestReviewsTitle")}
                    />
                </Col>
                {Array.isArray(debateClaims) && debateClaims.length > 0 && (
                    <Col
                        xs={{ span: 20, order: 1 }}
                        sm={{ span: 20, order: 1 }}
                        md={{ span: 18, order: 1 }}
                        style={{
                            width: "100%",
                            paddingBottom: "32px",
                            justifyContent: "center",
                        }}
                    >
                        <DebateGrid debates={debateClaims} />
                    </Col>
                )}
                <Col xs={22} sm={22} md={18}>
                    <PersonalitiesGrid
                        personalities={personalities}
                        title={title}
                    />
                </Col>

                {!isLoggedIn && (
                    <Col xs={24} lg={18} order={3}>
                        <CTARegistration />
                    </Col>
                )}
                <Col span={24} order={4}>
                    <SocialMediaShare href={href} />
                </Col>
            </Row>
        </>
    );
};

export default HomeContent;
