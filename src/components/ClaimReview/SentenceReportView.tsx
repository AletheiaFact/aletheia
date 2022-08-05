import React from "react";
import { Col, Row } from "antd";
import SocialMediaShare from "../SocialMediaShare";
import SentenceReportCard from "./SentenceReportCard";
import NewCTARegistration from "./NewCTARegistration";
import CTARegistration from "../Home/CTARegistration";
import SentenceReportViewStyle from "./SentenceReportView.style";
import SentenceReportContent from "./SentenceReportContent";

const SentenceReportView = ({
    personality,
    claim,
    sentence,
    href,
    context,
}) => {
    return (
        <SentenceReportViewStyle>
            <Row>
                <Col offset={3} span={18}>
                    <Row style={{ borderBottom: "1px solid #dfdfdf" }}>
                        <Col
                            lg={{ order: 1, span: 16 }}
                            md={{ order: 2, span: 24 }}
                            sm={{ order: 2, span: 24 }}
                            xs={{ order: 2, span: 24 }}
                            className="sentence-report-card"
                        >
                            <SentenceReportCard
                                personality={personality}
                                claim={claim}
                                sentence={sentence}
                                date={claim?.date}
                                claimType={claim?.type}
                                context={context}
                            />
                        </Col>
                        <Col
                            lg={{ order: 2, span: 8 }}
                            md={{ order: 1, span: 24 }}
                            sm={{ order: 1, span: 24 }}
                            xs={{ order: 1, span: 24 }}
                        >
                            <NewCTARegistration />
                        </Col>
                        <Col style={{ order: 3 }}>
                            <SentenceReportContent
                                context={context}
                                personality={personality}
                                claim={claim}
                            />
                        </Col>
                    </Row>
                    <CTARegistration></CTARegistration>
                </Col>
                <Col span={24}>
                    <SocialMediaShare
                        isLoggedIn={"isLoggedIn"}
                        quote={personality?.name}
                        href={href}
                        claim={claim?.title}
                    />
                </Col>
            </Row>
        </SentenceReportViewStyle>
    );
};

export default SentenceReportView;
