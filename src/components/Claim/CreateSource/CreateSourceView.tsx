import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import BaseSourceForm from "./BaseSourceForm";
import { Col, Row } from "antd";
import sourceApi from "../../../api/sourceApi";
import { useAtom } from "jotai";
import { currentUserId } from "../../../atoms/currentUser";
import { useRouter } from "next/router";
import { currentNameSpace } from "../../../atoms/namespace";

const CreateSourceView = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [nameSpace] = useAtom(currentNameSpace);
    const [userId] = useAtom(currentUserId);

    const handleSubmit = ({ source, summary, classification, recaptcha }) => {
        if (!isLoading) {
            setIsLoading(true);
            sourceApi
                .createSource(t, router, {
                    href: source,
                    user: userId,
                    recaptcha,
                    nameSpace: nameSpace,
                    props: {
                        summary,
                        classification,
                        date: new Date(),
                    },
                })
                .then(() => {
                    setIsLoading(false);
                });
        }
    };

    return (
        <Row justify="center">
            <Col span={18}>
                <BaseSourceForm
                    handleSubmit={handleSubmit}
                    disableFutureDates
                    isLoading={isLoading}
                    disclaimer={t("claimForm:disclaimer")}
                    dateExtraText={t("claimForm:dateFieldHelp")}
                />
            </Col>
        </Row>
    );
};

export default CreateSourceView;
