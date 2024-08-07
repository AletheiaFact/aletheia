import React, { useState } from "react";
import LargeDrawer from "../LargeDrawer";
import { Col, Typography } from "antd";
import colors from "../../styles/colors";
import VerificationRequestCard from "./VerificationRequestCard";
import AletheiaButton from "../Button";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import WarningModal from "../Modal/WarningModal";

const VerificationRequestDrawer = ({
    groupContent,
    open,
    onCloseDrawer,
    isLoading,
    onRemove,
}) => {
    const { t } = useTranslation();
    const [removeWarningModal, setRemoveWarningModal] = useState(false);

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
                {groupContent?.length > 0 ? (
                    groupContent?.map((item) => (
                        <>
                            <VerificationRequestCard
                                key={item._id}
                                content={item}
                                t={t}
                                actions={[
                                    <AletheiaButton
                                        key="remove"
                                        onClick={() =>
                                            setRemoveWarningModal(true)
                                        }
                                        loading={isLoading}
                                    >
                                        <DeleteOutlined />
                                    </AletheiaButton>,
                                ]}
                            />
                            <WarningModal
                                open={removeWarningModal}
                                title={t("warningModal:title", {
                                    warning: t(
                                        "warningModal:removeVerificationRequest"
                                    ),
                                })}
                                width={400}
                                handleOk={() => {
                                    onRemove(item._id);
                                    setRemoveWarningModal(!removeWarningModal);
                                }}
                                handleCancel={() =>
                                    setRemoveWarningModal(!removeWarningModal)
                                }
                            />
                        </>
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
