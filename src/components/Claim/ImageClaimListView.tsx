import { Row, Col } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import Seo from "../Seo";
import ClaimList from "./ClaimList";

const ImageClaimListView = () => {
    const { t } = useTranslation();
    return (
        <>
            <Seo
                title={t("seo:noPersonalityClaimListTitle")}
                description={t("seo:noPersonalityClaimListDescription")}
            />
            <Row justify="center" style={{ marginTop: "64px" }}>
                <Col sm={22} md={14} lg={12}>
                    <ClaimList personality={{ _id: null }} />
                </Col>
            </Row>
        </>
    );
};

export default ImageClaimListView;
