import { Typography } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import VerificationRequestCard from "./VerificationRequestCard";
import { useAppSelector } from "../../store/store";
import ManageVerificationRequestGroup from "./ManageVerificationRequestGroup";

const VerificationRequestMainContent = ({
    verificationRequestGroup,
    content,
    openDrawer,
}) => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);

    return (
        <main style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Typography.Title level={3}>
                {t("verificationRequest:verificationRequestTitle")}
            </Typography.Title>
            <VerificationRequestCard content={content} />
            {!vw.xs && verificationRequestGroup?.length > 0 && (
                <ManageVerificationRequestGroup
                    label={t(
                        "verificationRequest:manageVerificationRequestsGroup"
                    )}
                    suffix={`: ${verificationRequestGroup.length}`}
                    openDrawer={openDrawer}
                />
            )}
        </main>
    );
};

export default VerificationRequestMainContent;
