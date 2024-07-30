import React from "react";
import LargeDrawer from "../LargeDrawer";
import { Col, Typography } from "antd";
import colors from "../../styles/colors";
import VerificationRequestCard from "./VerificationRequestCard";
import AletheiaButton from "../Button";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";

const VerificationRequestDrawer = ({
    groupContent,
    open,
    onCloseDrawer,
    isLoading,
    onRemove,
}) => {
    const { t } = useTranslation();

    return (
        <LargeDrawer
            open={open}
            onClose={onCloseDrawer}
            backgroundColor={colors.lightGraySecondary}
        >
            <Col style={{ margin: "32px 64px" }}>
                <Typography.Title level={3}>
                    {t("verificationRequest:verificationRequestTitle")}s
                </Typography.Title>
                {groupContent.length > 0 ? (
                    groupContent.map(({ _id, content }) => (
                        <VerificationRequestCard
                            key={_id}
                            content={content}
                            actions={[
                                <AletheiaButton
                                    key="remove"
                                    onClick={() => onRemove(_id)}
                                    loading={isLoading}
                                >
                                    <DeleteOutlined />
                                </AletheiaButton>,
                            ]}
                        />
                    ))
                ) : (
                    <span>
                        {t("verificationRequest:noVerificationRequestsMessage")}
                    </span>
                )}
            </Col>
        </LargeDrawer>
    );
};

export default VerificationRequestDrawer;
