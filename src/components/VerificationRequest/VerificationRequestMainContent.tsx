import { Box, Typography, IconButton } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import VerificationRequestCard from "./VerificationRequestCard";
import { useAppSelector } from "../../store/store";
import ManageVerificationRequestGroup from "./ManageVerificationRequestGroup";
import { useAtom } from "jotai";
import { currentUserRole } from "../../atoms/currentUser";
import { Roles } from "../../types/enums";
import EditIcon from '@mui/icons-material/Edit';
import EditVerificationRequestDrawer from "./EditVerificationRequestDrawer";

const VerificationRequestMainContent = ({
    verificationRequestGroup,
    content,
    openDrawer,
}) => {
    const { t } = useTranslation();
    const [role] = useAtom(currentUserRole);
    const { vw } = useAppSelector((state) => state);
    const [openEditDrawer, setOpenEditDrawer] = useState(false);

    const [currentRequest, setCurrentRequest] = useState(content);

    const handleSave = (updateRequest) => {
        setCurrentRequest(updateRequest)
        setOpenEditDrawer(false);
    };

    return (
        <main style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography style={{ fontFamily: "serif", fontWeight: 600, fontSize: 26, lineHeight: 1.35 }} variant="h3">
                    {t("verificationRequest:verificationRequestTitle")}
                </Typography>

                {role == Roles.Admin && (
                    <IconButton size="small">
                        <EditIcon
                            style={{ fontSize: 18 }}
                            color="primary"
                            onClick={() => setOpenEditDrawer(true)} />
                    </IconButton>
                )}
            </Box>

            {openEditDrawer && (
                <EditVerificationRequestDrawer
                    open={openEditDrawer}
                    onClose={() => setOpenEditDrawer(false)}
                    verificationRequest={currentRequest}
                    onSave={handleSave}
                />
            )}

            <VerificationRequestCard verificationRequest={currentRequest} t={t} />
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
