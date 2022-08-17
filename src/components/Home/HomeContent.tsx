import React from "react";
import CTARegistration from "./CTARegistration";
import { Row, Col } from "antd";
import SocialMediaShare from "../SocialMediaShare";
import { useTranslation } from "next-i18next";
import SectionTitle from "../SectionTitle";
import PersonalitiesGrid from "../Personality/PersonalitiesGrid";
import HomeContentStyle from "./HomeContent.style";
import { useAppSelector } from "../../store/store";
const HomeContent = ({ personalities, href, title }) => {
    const { t } = useTranslation();
    const { isLoggedIn } = useAppSelector((state) => ({
        isLoggedIn: state.login,
    }));

    return (
        <HomeContentStyle style={{ width: "100%" }}>
            <Row className="main-content" style={{ paddingTop: "32px" }}>
                <PersonalitiesGrid
                    personalities={personalities}
                    title={title}
                />

                <Col
                    span={isLoggedIn ? 24 : 6}
                    className={`${
                        isLoggedIn
                            ? "join-container-logged-in"
                            : "join-container-logged-out"
                    }`}
                >
                    {!isLoggedIn && (
                        <>
                            <Row className="section-title-container">
                                <SectionTitle>
                                    {t("home:sectionTitle2")}
                                </SectionTitle>
                            </Row>

                            <Row
                                id="create_account"
                                className="CTA-registration-container"
                            >
                                <CTARegistration />
                            </Row>
                        </>
                    )}
                    <SocialMediaShare href={href} />
                </Col>
            </Row>
        </HomeContentStyle>
    );
};

export default HomeContent;
