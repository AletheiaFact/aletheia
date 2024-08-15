import React, { useState } from "react";
import { Col, Row } from "antd";
import colors from "../../../styles/colors";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import CreateVerificationRequestForm from "./BaseVerificationRequestForm";
import verificationRequestApi from "../../../api/verificationRequestApi";

const CreateVerificationRequestView = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (values) => {
        if (!isLoading) {
            setIsLoading(true);
            const newVerificationRequest = values;
            verificationRequestApi
                .createVerificationRequest(t, router, newVerificationRequest)
                .then((s) => {
                    router.push(`/verification-request/${s.data_hash}`);
                    setIsLoading(false);
                });
            setIsLoading(false);
        }
    };

    return (
        <Row justify="center" style={{ background: colors.lightGray }}>
            <Col span={18}>
                <CreateVerificationRequestForm
                    handleSubmit={handleSubmit}
                    disableFutureDates
                    isLoading={isLoading}
                />
            </Col>
        </Row>
    );
};

export default CreateVerificationRequestView;
