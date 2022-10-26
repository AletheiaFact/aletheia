import React from "react";
import CTARegistration from "./CTARegistration";
import { Row, Col, List } from "antd";
import SocialMediaShare from "../SocialMediaShare";
import SectionTitle from "../SectionTitle";
import PersonalitiesGrid from "../Personality/PersonalitiesGrid";
import { useAppSelector } from "../../store/store";
import ReviewsCarousel from "../ClaimReview/ReviewsCarousel";
import { useTranslation } from "next-i18next";
import PersonalityCard from "../Personality/PersonalityCard";
import ClaimCollectionGrid from "../ClaimCollection/ClaimCollectionGrid";
const HomeContent = ({ personalities, href, title, claimCollections }) => {
    const { isLoggedIn, vw } = useAppSelector((state) => ({
        isLoggedIn: state.login,
        vw: state.vw,
    }));

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
                <Col
                    xs={{ span: 20, order: 1 }}
                    sm={{ span: 20, order: 1 }}
                    md={{ span: 18, order: 1 }}
                >
                    <ClaimCollectionGrid claimCollections={claimCollections} />
                </Col>
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
