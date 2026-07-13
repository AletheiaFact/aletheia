import React, { useState } from "react";
import { useAtom } from "jotai";
import { Divider, Grid } from "@mui/material";
import { currentUserId } from "../../../atoms/currentUser";
import { atomUserList } from "../../../atoms/userEdit";
import { Status } from "../../../types/enums";
import { finishEditingItem } from "../../../atoms/editDrawer";
import userApi from "../../../api/userApi";
import HeaderUserStatus from "./HeaderUserStatus";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import { canEdit } from "../../../utils/GetUserPermission";
import { useTranslations } from "next-intl";

const DrawerHeader = ({ currentUser, setIsLoading }) => {
    const tAdmin = useTranslations("admin");

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
                tAdmin
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
            <h2>{tAdmin("editDrawerTitle")}</h2>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
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
                    <h3 style={{ wordBreak: "break-all" }}>
                        {currentUser?.name} - {currentUser?.email}
                    </h3>
                </div>
                {userId !== currentUser?._id && shouldEdit && (
                    <AletheiaButton
                        type={ButtonType.whiteBlue}
                        onClick={handleClickChangeStatus}
                    >
                        {tAdmin(`user-status-${status}-button`)}
                    </AletheiaButton>
                )}
            </div>
            <Divider />
        </Grid>
    );
};

export default DrawerHeader;
