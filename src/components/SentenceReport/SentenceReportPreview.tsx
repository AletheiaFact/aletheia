import React from "react";
import CTARegistration from "../Home/CTARegistration";
import { Col } from "antd";
import SentenceReportComments from "./SentenceReportComments";
import SentenceReportContent from "./SentenceReportContent";
import { isUserLoggedIn } from "../../atoms/currentUser";
import { useAtom } from "jotai";

const SentenceReportPreview = ({
    canShowReportPreview,
    context,
    href,
    componentStyle,
}) => {
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    return (
        <Col span={componentStyle.span} offset={componentStyle.offset}>
            {canShowReportPreview && (
                <SentenceReportComments context={context} />
            )}
            <SentenceReportContent
                context={context?.reviewDataHtml || context}
                classification={context.classification}
                showClassification={canShowReportPreview}
                href={href}
            />
            {!isLoggedIn && <CTARegistration />}
        </Col>
    );
};

export default SentenceReportPreview;
