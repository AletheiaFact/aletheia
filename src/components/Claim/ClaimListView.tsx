import { Row, Col } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import Seo from "../Seo";
import ClaimList from "./ClaimList";
import SourceList from "../Source/SourceList";

const ClaimListView = () => {
    const { t } = useTranslation();

    return (
        <>
            <Seo
                title={t("seo:claimListTitle")}
                description={t("seo:claimListDescription")}
            />
            <Row justify="center" style={{ marginTop: "64px" }}>
                <Col sm={22} md={14} lg={12}>
                    <ClaimList personality={{ _id: null }} />
                </Col>
                <Col offset={1} sm={22} md={14} lg={8}>
                    <SourceList />
                </Col>
            </Row>
        </>
    );
};

export default ClaimListView;
