import React from "react";
import { Row, Col } from "antd";
import SocialMediaShare from "../SocialMediaShare";
import { useTranslation } from "next-i18next";
import SectionTitle from "../SectionTitle";
import PersonalitiesGrid from "./PersonalitiesGrid";
import { useAppSelector } from "../../store/store";
import CTARegistration from "../Home/CTARegistration";
import { useAtom } from "jotai";
import { isUserLoggedIn } from "../../atoms/currentUser";

const MorePersonalities = ({ personalities, href, title }) => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const [isLoggedIn] = useAtom(isUserLoggedIn);

    return (
        <Row
            style={{
                width: "100%",
                paddingTop: "32px",
                justifyContent: "center",
            }}
        >
            <Col span={isLoggedIn || vw?.md ? 18 : 12}>
                <PersonalitiesGrid
                    personalities={personalities}
                    title={title}
                />
            </Col>

            <Col
                span={isLoggedIn || vw?.md ? 24 : 6}
                style={{ paddingLeft: vw?.md ? 0 : 20 }}
            >
                {!isLoggedIn && (
                    <>
                        {!vw?.md && (
                            <SectionTitle>
                                {t("home:sectionTitle2")}
                            </SectionTitle>
                        )}

                        <Row id="create_account">
                            <CTARegistration />
                        </Row>
                    </>
                )}
                <SocialMediaShare href={href} />
            </Col>
        </Row>
    );
};

export default MorePersonalities;
