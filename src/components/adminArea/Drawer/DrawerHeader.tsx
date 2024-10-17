import React, { useState } from "react";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { Divider, Grid } from "@mui/material";
import { currentUserId } from "../../../atoms/currentUser";
import { atomUserList } from "../../../atoms/userEdit";
import { Status } from "../../../types/enums";
import { finishEditingItem } from "../../../atoms/editDrawer";
import userApi from "../../../api/userApi";
import HeaderUserStatus from "./HeaderUserStatus";
import Button, { ButtonType } from "../../Button";
import { canEdit } from "../../../utils/GetUserPermission";

const DrawerHeader = ({ currentUser, setIsLoading }) => {
    const { t } = useTranslation();

    const [, finishEditing] = useAtom(finishEditingItem);
    const [status, setStatus] = useState(currentUser?.state || Status.Active);
    const [userId] = useAtom(currentUserId);

    const shouldEdit = canEdit(currentUser, userId);

    const handleClickChangeStatus = async () => {
        try {
            setIsLoading(true);
            const sendStatus =
                status === Status.Active ? Status.Inactive : Status.Active;
            const response = await userApi.update(
                currentUser?._id,
                { state: sendStatus },
                t
            );

            if (response.success) {
                setStatus(sendStatus);
                finishEditing({
                    newItem: { ...currentUser, state: sendStatus },
                    listAtom: atomUserList,
                    closeDrawer: false,
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Grid item xs={10}>
            <h2>{t("admin:editDrawerTitle")}</h2>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    flexWrap: "wrap",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    {userId !== currentUser?._id && (
                        <HeaderUserStatus
                            status={status}
                            style={{
                                display: "flex",
                                flexWrap: "nowrap",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        />
                    )}
                    {" | "}
                    <h3 style={{ marginBottom: 0, wordBreak: "break-all" }}>
                        {currentUser?.name} - {currentUser?.email}
                    </h3>
                </div>
                {userId !== currentUser?._id && shouldEdit && (
                    <Button
                        type={ButtonType.whiteBlue}
                        onClick={handleClickChangeStatus}
                    >
                        {t(`admin:user-status-${status}-button`)}
                    </Button>
                )}
            </div>
            <Divider />
        </Grid>
    );
};

export default DrawerHeader;
