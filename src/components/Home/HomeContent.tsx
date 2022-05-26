import React from "react";
import CTARegistration from "./CTARegistration";
import { Row, Col } from "antd";
import SocialMediaShare from "../SocialMediaShare";
import { useTranslation } from 'next-i18next';
import SectionTitle from "../SectionTitle";
import PersonalitiesContainer from "./HomePersonalitiesContainer";

const HomeContent = ({ personalities, href, isLoggedIn }) => {
    const { t } = useTranslation();

    return (
        <Row className="main-content">
            <PersonalitiesContainer
                personalities={personalities}
                isLoggedIn={isLoggedIn}
            />
            
            <Col span={isLoggedIn ? 24 : 6}
                className={`${isLoggedIn ? "join-container-logged-in" : "join-container-logged-out"}`}>
                {!isLoggedIn &&
                    <>
                        <Row className="section-join-title">
                            <SectionTitle>
                                {t("home:sectionTitle2")}
                            </SectionTitle>
                        </Row>

                        <Row id="create_account">
                            <CTARegistration></CTARegistration>
                        </Row>
                    </>
                }
                <SocialMediaShare href={href} />
            </Col>
        </Row>
    )
}

export default HomeContent
