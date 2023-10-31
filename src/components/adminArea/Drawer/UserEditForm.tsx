import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { atomUserList } from "../../../atoms/userEdit";
import { Autocomplete, Avatar, Box, Grid, TextField } from "@mui/material";
import { useTranslation } from "next-i18next";
import { Roles } from "../../../types/enums";
import Label from "../../Label";
import userApi from "../../../api/userApi";
import { finishEditingItem } from "../../../atoms/editDrawer";
import { atomBadgesList } from "../../../atoms/badges";
import { Badge } from "../../../types/Badge";
import Button from "../../Button";
import { currentUserId } from "../../../atoms/currentUser";
import { canEdit } from "../../../utils/GetUserPermission";
import UserEditRoles from "./UserEditRoles";

const UserEditForm = ({ currentUser, setIsLoading }) => {
    const { t } = useTranslation();
    const [, finishEditing] = useAtom(finishEditingItem);
    const [badges, setBadges] = useState([]);
    const [role, setUserRole] = useState(currentUser?.role || Roles.Regular);
    const [badgesList] = useAtom(atomBadgesList);
    const [userId] = useAtom(currentUserId);

    const handleChangeBadges = (_event, newValue: Badge[]) => {
        setBadges(newValue);
    };

    useEffect(() => {
        // this was necessery because the select was not recognizing the
        // badges in currentUser.badges as selected items
        const badgeIds = currentUser?.badges?.map((obj) => obj._id);
        setUserRole(currentUser?.role || { main: Roles.Regular });

        setBadges(
            badgeIds?.length
                ? badgesList.filter((badge) => badgeIds?.includes(badge._id))
                : []
        );
    }, [badgesList, currentUser?.badges, currentUser?.role]);

    const shouldEdit = canEdit(currentUser, userId);

    const handleClickSave = async () => {
        try {
            setIsLoading(true);
            const sendBadges = badges.map((badge) => badge._id);
            await userApi.update(
                currentUser?._id,
                { role, badges: sendBadges },
                t
            );

            finishEditing({
                newItem: { ...currentUser, role, badges },
                listAtom: atomUserList,
                closeDrawer: true,
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Grid item xs={10} mt={2}>
                <UserEditRoles
                    currentUser={currentUser}
                    role={role}
                    setUserRole={setUserRole}
                    shouldEdit={shouldEdit}
                />
            </Grid>
            <Grid item xs={10} mt={2}>
                <Label>{t("menu:badgesItem")}</Label>
                <Autocomplete
                    disabled={!shouldEdit}
                    multiple
                    id="badges"
                    options={badgesList}
                    getOptionLabel={(option) => option.name}
                    value={badges}
                    onChange={handleChangeBadges}
                    defaultValue={currentUser?.badges}
                    disableCloseOnSelect
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={t("badges:selectBadges")}
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box component={"li"} {...props}>
                            <Avatar
                                src={option.image.content}
                                sx={{ mr: 1 }}
                                sizes="small"
                            />
                            {option.name}
                        </Box>
                    )}
                />
            </Grid>
            <Grid item xs={10} mt={5}>
                {shouldEdit && (
                    <Button onClick={handleClickSave}>
                        {t("admin:saveButtonLabel")}
                    </Button>
                )}
            </Grid>
        </>
    );
};

export default UserEditForm;
