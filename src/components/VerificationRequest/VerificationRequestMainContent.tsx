import { Typography } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import VerificationRequestCard from "./VerificationRequestCard";
import { useAppSelector } from "../../store/store";
import ManageVerificationRequestGroup from "./ManageVerificationRequestGroup";
import { useAtom } from "jotai";
import { currentUserRole } from "../../atoms/currentUser";
import { Roles } from "../../types/enums";

const VerificationRequestMainContent = ({
    verificationRequestGroup,
    content,
    openDrawer,
}) => {
    const { t } = useTranslation();
    const [role] = useAtom(currentUserRole);
    const { vw } = useAppSelector((state) => state);

    return (
        <main style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Typography.Title level={3}>
                {t("verificationRequest:verificationRequestTitle")}
            </Typography.Title>
            <VerificationRequestCard content={content} t={t} />
            {!vw.xs &&
                role !== Roles.Regular &&
                verificationRequestGroup?.length > 0 && (
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
