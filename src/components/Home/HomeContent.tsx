import React from "react";
import CTARegistration from "./CTARegistration";
import { Row, Col } from "antd";
import SocialMediaShare from "../SocialMediaShare";
import { isUserLoggedIn } from "../../atoms/currentUser";
import SectionTitle from "../SectionTitle";
import { useAtom } from "jotai";
import PersonalitiesGrid from "../Personality/PersonalitiesGrid";
import { useAppSelector } from "../../store/store";
import ReviewsCarousel from "../ClaimReview/ReviewsCarousel";
import { useTranslation } from "next-i18next";
import DebateGrid from "../Debate/DebateGrid";
const HomeContent = ({ personalities, href, title, debateClaims }) => {
    const { vw } = useAppSelector((state) => ({
        vw: state.vw,
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
                {Array.isArray(debateClaims) && debateClaims.length > 0 && (
                    <Col
                        xs={{ span: 20, order: 1 }}
                        sm={{ span: 20, order: 1 }}
                        md={{ span: 18, order: 1 }}
                    >
                        <DebateGrid debates={debateClaims} />
                    </Col>
                )}
                <Col
                    xs={{ span: 22, order: 2 }}
                    sm={{ span: 22, order: 2 }}
                    md={{ span: 12, order: 1 }}
                >
                    <PersonalitiesGrid
                        personalities={personalities}
                        title={title}
                    />
                </Col>
                <Col
                    xs={{ span: 20, order: 1 }}
                    sm={{ span: 20, order: 1 }}
                    md={{ span: 6, order: 2 }}
                    style={{ paddingLeft: vw?.sm ? 0 : 50 }}
                >
                    <SectionTitle>{t("home:latestReviewsTitle")}</SectionTitle>
                    <ReviewsCarousel />
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
