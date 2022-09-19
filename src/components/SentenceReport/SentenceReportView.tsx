import { Col, Row } from "antd";
import React from "react";

import { useAppSelector } from "../../store/store";
import CTARegistration from "../Home/CTARegistration";
import SentenceReportContent from "./SentenceReportContent";

const SentenceReportView = ({ personality, claim, context }) => {
    const { isLoggedIn } = useAppSelector((state) => {
        return {
            isLoggedIn: state?.login,
        };
    });

    return (
        <div>
            <Row>
                <Col offset={3} span={18}>
                    <Col>
                        <SentenceReportContent
                            context={context}
                            personality={personality}
                            claim={claim}
                        />
                    </Col>
                    {!isLoggedIn && <CTARegistration />}
                </Col>
            </Row>
        </div>
    );
};

export default SentenceReportView;
