import React from "react";
import CTARegistration from "./CTARegistration";
import { Row, Col } from "antd";
import SocialMediaShare from "../SocialMediaShare";
import { useTranslation } from 'next-i18next';
import SectionTitle from "../SectionTitle";
import HomePersonalitiesContainer from "./HomePersonalitiesContainer";
import HomeContentContainer from "./HomeContent.style";
const HomeContent = ({ personalities, href, isLoggedIn }) => {
    const { t } = useTranslation();

    return (
        <HomeContentContainer>
            <Row
                className="main-content"
                style={{ paddingTop: "32px" }}
            >
                <HomePersonalitiesContainer
                    personalities={personalities}
                    isLoggedIn={isLoggedIn}
                />
            
                <Col span={isLoggedIn ? 24 : 6}
                    className={`${isLoggedIn ? "join-container-logged-in" : "join-container-logged-out"}`}>
                    {!isLoggedIn &&
                        <>
                            <Row className="section-title-container">
                                <SectionTitle>
                                    {t("home:sectionTitle2")}
                                </SectionTitle>
                            </Row>

                            <Row id="create_account" className="CTA-registration-container">
                                <CTARegistration></CTARegistration>
                            </Row>
                        </>
                    }
                    <SocialMediaShare isLoggedIn={isLoggedIn} href={href} />
                </Col>
            </Row>
        </HomeContentContainer>
    )
}

export default HomeContent
