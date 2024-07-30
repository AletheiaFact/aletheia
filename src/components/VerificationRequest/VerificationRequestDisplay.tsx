import { Col, Typography } from "antd";
import React, { useContext, useState } from "react";
import VerificationRequestCard from "./VerificationRequestCard";
import { useTranslation } from "next-i18next";
import VerificationRequestDisplayStyle from "./VerificationRequestDisplay.style";
import { useAppSelector } from "../../store/store";
import VerificationRequestAlert from "./VerificationRequestAlert";
import VerificationRequestRecommendations from "./VerificationRequestRecommendations";
import { VerificationRequestContext } from "./VerificationRequestProvider";
import VerificationRequestDrawer from "./VerificationRequestDrawer";
import ManageVerificationRequestGroup from "./ManageVerificationRequestGroup";

const VerificationRequestDisplay = ({ content }) => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { group, onRemoveVerificationRequest } = useContext(
        VerificationRequestContext
    );
    const { content: contentText } = content;
    const verificationRequestGroup = group?.content?.filter(
        (c) => c._id !== content._id
    );

    const onRemove = (id) => {
        setIsLoading(true);
        onRemoveVerificationRequest(id).then(() => setIsLoading(false));
    };

    return (
        <VerificationRequestDisplayStyle>
            <VerificationRequestAlert
                targetId={content?.group?.targetId}
                verificationRequestId={content._id}
            />

            <Col
                span={24}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
                <Typography.Title level={3}>
                    {t("verificationRequest:verificationRequestTitle")}
                </Typography.Title>
                <VerificationRequestCard content={contentText} />
                {!vw.xs && verificationRequestGroup?.length > 0 && (
                    <ManageVerificationRequestGroup
                        label={t(
                            "verificationRequest:manageVerificationRequestsGroup"
                        )}
                        openDrawer={() => setOpen(true)}
                    />
                )}
            </Col>

            <VerificationRequestRecommendations />

            <VerificationRequestDrawer
                groupContent={verificationRequestGroup}
                open={open}
                isLoading={isLoading}
                onCloseDrawer={() => setOpen(false)}
                onRemove={onRemove}
            />
        </VerificationRequestDisplayStyle>
    );
};

export default VerificationRequestDisplay;
