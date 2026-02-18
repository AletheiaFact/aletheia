import { Box, Typography, IconButton, Grid } from "@mui/material";
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
import TrackingCard from "../Tracking/TrackingCard";

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
        <main className="container">
            <Box className="box-title">
                <Typography className="title" variant="h1">
                    {t("verificationRequest:verificationRequestTitle")}
                </Typography>

                {role == Roles.Admin && (
                    <IconButton size="small">
                        <EditIcon
                            className="edit-icon"
                            color="primary"
                            onClick={() => setOpenEditDrawer(true)} />
                    </IconButton>
                )}
                {openEditDrawer && (
                    <EditVerificationRequestDrawer
                        open={openEditDrawer}
                        onClose={() => setOpenEditDrawer(false)}
                        verificationRequest={currentRequest}
                        onSave={handleSave}
                    />
                )}
            </Box>
            <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={12} lg={7} xl={8}>
                    <VerificationRequestCard verificationRequest={currentRequest} t={t} style={{ height: "100%" }} />
                </Grid>
                <Grid item xs={12} lg={5} xl={4}>
                    <TrackingCard
                        verificationRequestId={content._id}
                        isMinimal={true}
                    />
                </Grid>
            </Grid>
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
